'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Title1 } from '@fluentui/react-text';
// Importamos solo los componentes de Fluent que vamos a usar
import { Button, Select, Field, Dialog, DialogSurface, DialogTitle, DialogBody, DialogContent } from '@fluentui/react-components';

// Importamos las funciones e interfaces del servicio de planes de terapia
import {
    getTherapyPlans,
    TherapyPlanData,
    TherapyPlanListResponse,
    TherapyPlanQueryParams,
    ScheduleEntry
} from "./service";


// --------------------------------------------------------
// COMPONENTES AUXILIARES
// --------------------------------------------------------

/**
 * Mapeo de días de la semana (del servicio) a nombres en español
 */
const dayMap: { [key in ScheduleEntry['dayOfWeek']]: string } = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
};

/**
 * Formatea una cadena ISO 8601 a una hora legible (ej: 14:00)
 */
const formatIsoToTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return 'Hora inválida';
    }
};

/**
 * NUEVA FUNCIÓN: Formatea una cadena ISO 8601 a una fecha legible (ej: 28/11/2025)
 */
const formatIsoToDate = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
        return 'Fecha inválida';
    }
};

/**
 * Modal para mostrar los detalles del horario (Schedule) de un Plan de Terapia.
 * Actualizado para mostrar la fecha exacta de la sesión.
 */
interface SessionDetailsModalProps {
    plan: TherapyPlanData | null;
    onClose: () => void;
}

function SessionDetailsModal({ plan, onClose }: SessionDetailsModalProps) {
    if (!plan) return null;

    return (
        <Dialog open={!!plan}>
            <DialogSurface className="w-11/12 md:w-1/3 max-w-lg">
                <DialogBody>
                    <DialogTitle className="text-xl font-bold">
                        Horario del Plan #{plan.id}
                    </DialogTitle>
                    <DialogContent>
                        {/* Se usa div con clases para simular Body1 de Fluent */}
                        <div className="mb-4 text-base text-gray-800">
                            Paciente: {plan.description.replace('Plan de rehabilitación para ', '')}
                        </div>

                        {/* Tabla de Sesiones */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    {/* Columna agregada para mostrar la fecha exacta */}
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Fecha</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Día</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Inicio</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Fin</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                {plan.schedule.length > 0 ? (
                                    plan.schedule.map((session, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            {/* Mostrar la fecha exacta */}
                                            <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                                {formatIsoToDate(session.startTime)}
                                            </td>
                                            {/* Mantener el día como referencia contextual */}
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                {dayMap[session.dayOfWeek]}
                                            </td>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                {formatIsoToTime(session.startTime)}
                                            </td>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                {formatIsoToTime(session.endTime)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-3 text-center text-sm text-gray-500">
                                            Este plan no tiene sesiones programadas.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                    </DialogContent>
                    {/* Reemplazo de DialogFooter por un div simple con estilos de Tailwind */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={onClose} appearance="secondary">Cerrar</Button>
                    </div>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}


// Definición de Props para la Tabla
interface TherapyPlansSummaryTableProps {
    plans: TherapyPlanData[];
    onViewDetails: (plan: TherapyPlanData) => void;
}

/**
 * Componente de Tabla enfocado en los detalles del Plan (ID y Objetivos)
 * Modificado para llamar a onViewDetails al hacer clic en el botón.
 */
function TherapyPlansSummaryTable({ plans, onViewDetails }: TherapyPlansSummaryTableProps) {
    return (
        <div className="overflow-x-auto w-full flex-grow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                <tr>
                    {/* Campo clave para identificar el Plan */}
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Plan</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Paciente (ID)</th>
                    {/* Campo clave para el Plan de Terapia */}
                    <th className="p-3 text-left text-sm font-semibold text-gray-800 max-w-xs">Objetivos Principales</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Terapista</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Responsable Legal</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Evaluación</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-800"></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition duration-100">
                        <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {plan.id}
                        </td>
                        <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {/* Mostramos el nombre descriptivo y el ID del paciente */}
                            {plan.description.replace('Plan de rehabilitación para ', '')} ({plan.patientId})
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-normal max-w-xs">
                            {/* Mostrando el campo goals del plan */}
                            {plan.goals}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{plan.assignedTherapistId}</td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{plan.legalResponsibleId}</td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{plan.assessmentId}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                            <Button
                                appearance="primary"
                                size="medium"
                                onClick={() => onViewDetails(plan)}
                            >
                                Ver detalle
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Componente de Paginador y Selector de Tamaño (Footer Controls)
 */
interface FooterControlsProps {
    pagination: {
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
}

function FooterControls({ pagination, onPageChange, onSizeChange }: FooterControlsProps) {
    const { page, size, totalPages } = pagination;

    return (
        <div className="flex justify-end items-center py-3 px-3 bg-white border-t border-gray-200">
            {/* Control de Tamaño de Página */}
            <Field label="Mostrar" className="flex items-center space-x-2 mr-6 text-sm">
                <Select
                    value={String(size)}
                    onChange={(e) => onSizeChange(parseInt(e.target.value))}
                    size="small"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </Select>
            </Field>

            {/* Paginación */}
            <div className="flex items-center space-x-2 text-sm">
                <Button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    appearance="subtle"
                    size="medium"
                    className="bg-gray-100 hover:bg-gray-200"
                >
                    Anterior
                </Button>

                {/* Indicador de página */}
                <span className="text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md text-xs font-semibold">
                    Página {page} de {totalPages}
                </span>

                <Button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    appearance="subtle"
                    size="medium"
                    className="bg-gray-100 hover:bg-gray-200"
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
}


// --------------------------------------------------------
// COMPONENTE PRINCIPAL DE PÁGINA
// --------------------------------------------------------

export default function TherapyPlansPage() {
    const [plans, setPlans] = useState<TherapyPlanData[]>([]);

    // Nuevo estado para manejar el plan seleccionado y mostrar el modal
    const [selectedPlan, setSelectedPlan] = useState<TherapyPlanData | null>(null);

    // Estado de paginación y metadata
    const [coincidences, setCoincidences] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para manejar el clic en "Ver detalle"
    const handleViewDetails = (plan: TherapyPlanData) => {
        setSelectedPlan(plan);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setSelectedPlan(null);
    };


    // Función para cambiar el tamaño de la página y reiniciar a la página 1
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1); // Esencial para cargar la primera página con el nuevo tamaño
    };

    // Efecto: Llamar al servicio backend cuando cambia la página o el tamaño
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Parámetros de paginación enviados al servicio mock
                const params: TherapyPlanQueryParams = {
                    page: currentPage,
                    size: pageSize,
                };

                // Llamada al servicio que simula el backend/fallback
                const response: TherapyPlanListResponse = await getTherapyPlans(params);

                // Actualizar el estado con la respuesta del servicio
                setPlans(response.data.items);
                setCoincidences(response.data.totalItems);
                setMaxPage(response.data.totalPages);

            } catch (err) {
                // El servicio ya gestiona el fallback, este catch es para errores finales.
                console.error("Error final al obtener datos:", err);
                setError(err instanceof Error ? err.message : "Error desconocido al cargar los planes.");
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        // Ejecutar la obtención de datos
        void fetchData();
    }, [currentPage, pageSize]);

    // Datos de paginación para el componente FooterControls
    const paginationData = useMemo(() => ({
        page: currentPage,
        size: pageSize,
        totalItems: coincidences,
        totalPages: maxPage,
    }), [currentPage, pageSize, coincidences, maxPage]);


    if (error) {
        return (
            <div className="flex justify-center items-center h-screen w-full bg-gray-50">
                <p className="text-red-700 bg-red-100 p-6 rounded-md shadow-lg">
                    Error: {error}
                </p>
            </div>
        );
    }

    // Estilo para ocupar toda la pantalla (h-screen, flex-col, flex-grow)
    return (
        <div className="flex flex-col h-screen w-full bg-white">
            {/* Contenedor principal con título */}
            <div className="w-full max-w-full mx-auto px-8 py-6">
                <Title1 className="text-gray-900">Planes de Terapia</Title1>
                <div className="text-sm text-gray-500 mt-2">
                    Coincidencias encontradas: {coincidences}
                </div>
            </div>

            {/* Contenedor de la Tabla (flex-grow para expandirse) */}
            <div className="flex flex-col flex-grow w-full max-w-full mx-auto px-8 overflow-hidden">
                <div className="bg-white flex-grow border border-gray-200 rounded-lg overflow-hidden">

                    {loading && (
                        <div className="flex justify-center items-center py-20 h-full">
                            <p className="text-blue-600 text-lg">Cargando datos...</p>
                        </div>
                    )}

                    {(!loading && plans.length === 0) && (
                        <div className="text-center py-20 text-gray-500">
                            No se encontraron planes.
                        </div>
                    )}

                    {/* Tabla de resumen */}
                    {(!loading && plans.length > 0) && (
                        <TherapyPlansSummaryTable
                            plans={plans}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </div>
            </div>

            {/* Paginador siempre visible en la parte inferior (fijo si es necesario) */}
            <div className="w-full max-w-full mx-auto px-8">
                <FooterControls
                    pagination={paginationData}
                    onPageChange={setCurrentPage}
                    onSizeChange={handlePageSizeChange}
                />
            </div>

            {/* Modal de Detalles de Sesión */}
            <SessionDetailsModal
                plan={selectedPlan}
                onClose={handleCloseModal}
            />
        </div>
    );
}