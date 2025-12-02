'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Title1 } from '@fluentui/react-text';
import {
    Button, Select, Field, Dialog, DialogSurface, DialogTitle, DialogBody,
    DialogContent, Input, Textarea, Spinner,
    // Se eliminaron: Toast, ToastTitle, ToastBody, Toaster, useId, useToastController
    // Manteniendo solo los componentes de UI que no dieron error
    Dropdown, Option,
} from '@fluentui/react-components';

// =========================================================
// COMPONENTE: NOTIFICACIÓN TOAST SIMPLE (Reemplazo de Fluent UI Toast)
// =========================================================

interface CustomToastProps {
    title: string;
    body: string;
    intent: 'success' | 'error';
    onDismiss: () => void;
}

function CustomToast({ title, body, intent, onDismiss }: CustomToastProps) {
    const isSuccess = intent === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const shadowColor = isSuccess ? 'shadow-green-700/50' : 'shadow-red-700/50';

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3500); // Se oculta automáticamente después de 3.5 segundos
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm transition-all duration-300 
                        transform translate-y-0 opacity-100 ${bgColor} shadow-lg ${shadowColor}`}
            role="alert"
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-bold text-lg">{title}</div>
                    <p className="text-sm">{body}</p>
                </div>
                <button onClick={onDismiss} className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}


// =========================================================
// MOCK DE SERVICIO DE PLANES DE TERAPIA (Para hacer el archivo autónomo)
// =========================================================

interface ScheduleEntry {
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    startTime: string; // ISO 8601 string (e.g., "2025-01-01T09:00:00Z")
    endTime: string;   // ISO 8601 string
}

interface TherapyPlanData {
    id: number;
    patientId: number;
    assessmentId: number;
    assignedTherapistId: number;
    legalResponsibleId: number;
    description: string;
    goals: string;
    isActive: boolean;
    schedule: ScheduleEntry[];
    createdAt: string; // ISO 8601 string
}

interface TherapyPlanCreationData {
    assessmentId: number;
    assignedTherapistId: number;
    legalResponsibleId: number;
    description: string;
    goals: string;
    schedule: ScheduleEntry[];
}

interface TherapyPlanQueryParams {
    page: number;
    size: number;
}

interface TherapyPlanListResponse {
    data: {
        items: TherapyPlanData[];
        totalItems: number;
        totalPages: number;
    };
}

// Simulación de una base de datos en memoria para los planes
const mockPlans: TherapyPlanData[] = Array.from({ length: 25 }, (_, i) => ({
    id: 1000 + i,
    patientId: 500 + (i % 5),
    assessmentId: 100 + (i % 10),
    assignedTherapistId: 1 + (i % 5),
    legalResponsibleId: 1 + (i % 4),
    description: `Plan de rehabilitación para Paciente ${500 + (i % 5)}`,
    goals: `Mejorar la función motora en ${50 + i}% y reducir el dolor crónico.`,
    isActive: i % 3 !== 0,
    schedule: [
        { dayOfWeek: 'MONDAY', startTime: `2025-01-01T09:00:00Z`, endTime: `2025-01-01T10:00:00Z` },
        { dayOfWeek: 'WEDNESDAY', startTime: `2025-01-03T14:30:00Z`, endTime: `2025-01-03T15:30:00Z` },
    ],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

let nextPlanId = 1026;

// Simulación de la función para obtener planes (API GET)
const getTherapyPlans = async (params: TherapyPlanQueryParams): Promise<TherapyPlanListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula latencia

    const { page, size } = params;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const totalItems = mockPlans.length;
    const totalPages = Math.ceil(totalItems / size);

    const items = mockPlans.slice(startIndex, endIndex);

    return {
        data: {
            items,
            totalItems,
            totalPages,
        },
    };
};

// Simulación de la función para crear un plan (API POST)
const createTherapyPlan = async (data: TherapyPlanCreationData): Promise<TherapyPlanData> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula latencia

    // Crear el nuevo plan
    const newPlan: TherapyPlanData = {
        ...data,
        id: nextPlanId++,
        patientId: 999, // ID Ficticio para un nuevo paciente
        isActive: true,
        createdAt: new Date().toISOString(),
    };

    // Agregar al inicio para que aparezca en la primera página
    mockPlans.unshift(newPlan);

    return newPlan;
};

// =========================================================
// UTILIDADES
// =========================================================

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
const dayOptions: ScheduleEntry['dayOfWeek'][] = Object.keys(dayMap) as ScheduleEntry['dayOfWeek'][];

// Mapeo de IDs ficticios para las opciones del Dropdown
const MOCK_IDS = {
    therapists: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Terapista #${i + 1}` })),
    legalResponsibles: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, name: `Responsable Legal #${i + 1}` })),
    assessments: Array.from({ length: 10 }, (_, i) => ({ id: 100 + i, name: `Evaluación #${100 + i}` })),
};

/**
 * Formatea una cadena ISO 8601 a una hora legible (ej: 14:00)
 */
const formatIsoToTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // Esto solo funciona si la hora es local al navegador. Si es 'Z', se ajusta.
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    } catch (e) {
        return 'Hora inválida';
    }
};

/**
 * Formatea una cadena ISO 8601 a una fecha legible (ej: 28/11/2025)
 */
const formatIsoToDate = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
        return 'Fecha inválida';
    }
};

// =========================================================
// COMPONENTE: MODAL DE CREACIÓN DE PLAN DE TERAPIA (El Componente 'Pop-up' Autosuficiente)
// =========================================================

interface CreateTherapyPlanModalProps {
    isOpen: boolean;
    onClose: (didCreate?: boolean) => void;
    // La función showToast ahora usa el tipo CustomToastProps
    showToast: (title: string, body: string, intent: 'success' | 'error') => void;
}

function CreateTherapyPlanModal({ isOpen, onClose, showToast }: CreateTherapyPlanModalProps) {
    // ---------------- Estado del Formulario Principal
    const defaultPlanState: TherapyPlanCreationData = {
        assessmentId: MOCK_IDS.assessments[0].id,
        assignedTherapistId: MOCK_IDS.therapists[0].id,
        legalResponsibleId: MOCK_IDS.legalResponsibles[0].id,
        description: "",
        goals: "",
        schedule: [],
    };
    const [planData, setPlanData] = useState<TherapyPlanCreationData>(defaultPlanState);
    const [loading, setLoading] = useState(false);

    // ---------------- Estado del Formulario Temporal de Sesión
    const defaultSessionState = {
        dayOfWeek: dayOptions[0],
        date: "", // YYYY-MM-DD
        timeStart: "", // HH:MM
        timeEnd: "", // HH:MM
    };
    const [tempSession, setTempSession] = useState(defaultSessionState);
    const [sessionError, setSessionError] = useState<string | null>(null);

    // Reiniciar estados al abrir/cerrar
    useEffect(() => {
        if (!isOpen) {
            setPlanData(defaultPlanState);
            setTempSession(defaultSessionState);
            setSessionError(null);
            setLoading(false);
        }
    }, [isOpen]);

    // Manejadores de cambio de input (Planes)
    const handlePlanDataChange = (field: keyof TherapyPlanCreationData, value: any) => {
        const finalValue = (field === 'assessmentId' || field === 'assignedTherapistId' || field === 'legalResponsibleId')
            ? parseInt(value)
            : value;

        setPlanData(prev => ({ ...prev, [field]: finalValue }));
    };

    // Manejadores de cambio de input (Sesiones Temporales)
    const handleSessionChange = (field: keyof typeof defaultSessionState, value: string) => {
        setTempSession(prev => ({ ...prev, [field]: value }));
        setSessionError(null);
    };

    // Validación de Sesión
    const validateSession = () => {
        if (!tempSession.date || !tempSession.timeStart || !tempSession.timeEnd) {
            setSessionError("Todos los campos de fecha/hora son obligatorios.");
            return false;
        }

        // Simplemente verifica el formato de fecha/hora
        const startDateTime = new Date(`${tempSession.date}T${tempSession.timeStart}:00Z`);
        const endDateTime = new Date(`${tempSession.date}T${tempSession.timeEnd}:00Z`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            setSessionError("Formato de fecha u hora inválido.");
            return false;
        }

        if (startDateTime >= endDateTime) {
            setSessionError("La hora de inicio debe ser anterior o igual a la hora de fin.");
            return false;
        }

        return true;
    }

    // Agregar Sesión al Horario
    const addSession = () => {
        if (!validateSession()) return;

        // Creamos las cadenas ISO directamente con la zona horaria UTC ('Z')
        const startTimeISO = `${tempSession.date}T${tempSession.timeStart}:00Z`;
        const endTimeISO = `${tempSession.date}T${tempSession.timeEnd}:00Z`;

        const newSession: ScheduleEntry = {
            dayOfWeek: tempSession.dayOfWeek,
            startTime: startTimeISO,
            endTime: endTimeISO,
        };

        // Agregar la nueva sesión y ordenar por hora de inicio
        setPlanData(prev => ({
            ...prev,
            schedule: [...prev.schedule, newSession].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        }));

        // Limpiar el formulario temporal, manteniendo el día
        setTempSession({ ...defaultSessionState, dayOfWeek: tempSession.dayOfWeek });
    };

    // Remover Sesión
    const removeSession = (index: number) => {
        setPlanData(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
    };

    // Manejar el envío del formulario y LLAMADA AL SERVICIO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validación de campos principales y schedule
        if (!planData.description || !planData.goals) {
            showToast("Error de Validación", "La descripción y los objetivos son obligatorios.", 'error');
            setLoading(false);
            return;
        }
        if (planData.schedule.length === 0) {
            showToast("Error de Horario", "Debe agregar al menos una sesión al horario.", 'error');
            setLoading(false);
            return;
        }

        try {
            // Llama al servicio de creación, desacoplado del componente padre
            const createdPlan = await createTherapyPlan(planData);

            // Éxito: mostrar toast y cerrar modal forzando el refresco
            showToast("Plan Creado", `El Plan de Terapia #${createdPlan.id} fue creado exitosamente.`, 'success');
            onClose(true);

        } catch (error) {
            console.error("Error al crear el plan:", error);
            showToast("Error de Creación", "Hubo un problema al crear el plan. Intente de nuevo.", 'error');
            onClose(false);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // UI del Pop-up
    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => data.open === false && onClose()}>
            <DialogSurface className="w-11/12 md:w-2/3 max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
                <DialogBody>
                    <DialogTitle className="text-2xl font-bold border-b pb-3 mb-4">
                        Crear Nuevo Plan de Terapia
                    </DialogTitle>
                    <DialogContent>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* IDs y Metadatos */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Assessment ID */}
                                <Field label="ID Evaluación Requerida" required>
                                    <Dropdown
                                        aria-labelledby="assessment-label"
                                        placeholder="Seleccione Evaluación"
                                        onSelect={(_, data) => handlePlanDataChange('assessmentId', data.optionValue)}
                                        value={String(planData.assessmentId)}
                                    >
                                        {MOCK_IDS.assessments.map(item => (
                                            <Option key={item.id} value={String(item.id)}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Dropdown>
                                </Field>

                                {/* Therapist ID */}
                                <Field label="ID Terapista Asignado" required>
                                    <Dropdown
                                        aria-labelledby="therapist-label"
                                        placeholder="Seleccione Terapista"
                                        onSelect={(_, data) => handlePlanDataChange('assignedTherapistId', data.optionValue)}
                                        value={String(planData.assignedTherapistId)}
                                    >
                                        {MOCK_IDS.therapists.map(item => (
                                            <Option key={item.id} value={String(item.id)}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Dropdown>
                                </Field>

                                {/* Legal Responsible ID */}
                                <Field label="ID Responsable Legal" required>
                                    <Dropdown
                                        aria-labelledby="responsible-label"
                                        placeholder="Seleccione Responsable"
                                        onSelect={(_, data) => handlePlanDataChange('legalResponsibleId', data.optionValue)}
                                        value={String(planData.legalResponsibleId)}
                                    >
                                        {MOCK_IDS.legalResponsibles.map(item => (
                                            <Option key={item.id} value={String(item.id)}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Dropdown>
                                </Field>
                            </div>

                            {/* Descripción y Objetivos */}
                            <Field label="Descripción del Plan" required className="w-full">
                                <Textarea
                                    value={planData.description}
                                    onChange={(e) => handlePlanDataChange('description', e.target.value)}
                                    placeholder="Ej: Plan de rehabilitación post-operatoria enfocado en la movilidad y fuerza."
                                    resize="vertical"
                                />
                            </Field>

                            <Field label="Objetivos (Goals)" required className="w-full">
                                <Textarea
                                    value={planData.goals}
                                    onChange={(e) => handlePlanDataChange('goals', e.target.value)}
                                    placeholder="Ej: Recuperar el 90% del rango de movimiento en 12 semanas. Reducir el dolor a nivel 2/10."
                                    resize="vertical"
                                />
                            </Field>

                            {/* Sección de Horario (Schedule) */}
                            <h3 className="text-xl font-semibold pt-4 border-t mt-6 text-gray-800">Programar Sesiones</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-md border">
                                {/* Día de la Semana */}
                                <Field label="Día de la Semana" required>
                                    <Select
                                        value={tempSession.dayOfWeek}
                                        onChange={(e) => handleSessionChange('dayOfWeek', e.target.value as ScheduleEntry['dayOfWeek'])}
                                    >
                                        {dayOptions.map(day => (
                                            <option key={day} value={day}>{dayMap[day]}</option>
                                        ))}
                                    </Select>
                                </Field>

                                {/* Fecha */}
                                <Field label="Fecha" required>
                                    <Input
                                        type="date"
                                        value={tempSession.date}
                                        onChange={(e) => handleSessionChange('date', e.target.value)}
                                    />
                                </Field>

                                {/* Hora de Inicio/Fin */}
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <Field label="Hora Inicio" required>
                                        <Input
                                            type="time"
                                            value={tempSession.timeStart}
                                            onChange={(e) => handleSessionChange('timeStart', e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Hora Fin" required>
                                        <Input
                                            type="time"
                                            value={tempSession.timeEnd}
                                            onChange={(e) => handleSessionChange('timeEnd', e.target.value)}
                                        />
                                    </Field>
                                </div>

                                {/* Botón de Agregar */}
                                <div className="md:col-span-4 flex justify-end">
                                    <Button
                                        appearance="secondary"
                                        onClick={addSession}
                                        className="h-10 w-full md:w-auto"
                                        type="button"
                                    >
                                        Agregar Sesión al Horario
                                    </Button>
                                </div>
                            </div>

                            {sessionError && (
                                <div className="text-red-600 text-sm">{sessionError}</div>
                            )}

                            {/* Lista de Sesiones Agregadas */}
                            <h4 className="text-lg font-medium pt-2 text-gray-700">Horario Programado ({planData.schedule.length} sesiones)</h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-800">Fecha</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-800">Día</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-800">Inicio</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-800">Fin</th>
                                        <th className="p-3 text-right text-sm font-semibold text-gray-800">Acción</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                    {planData.schedule.length > 0 ? (
                                        planData.schedule.map((session, index) => (
                                            <tr key={index} className="hover:bg-blue-50">
                                                <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                                    {formatIsoToDate(session.startTime)}
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                    {dayMap[session.dayOfWeek]}
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                    {formatIsoToTime(session.startTime)}
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                    {formatIsoToTime(session.endTime)}
                                                </td>
                                                <td className="p-3 text-right whitespace-nowrap">
                                                    <Button
                                                        size="small"
                                                        appearance="subtle"
                                                        onClick={() => removeSession(index)}
                                                        type="button"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-3 text-center text-sm text-gray-500 italic">
                                                Agregue sesiones para definir el horario del plan.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Botones de Acción Final */}
                            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                                <Button
                                    appearance="secondary"
                                    onClick={() => onClose()}
                                    disabled={loading}
                                    type="button"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    appearance="primary"
                                    type="submit"
                                    disabled={loading || !planData.description || !planData.goals || planData.schedule.length === 0}
                                >
                                    {loading ? <Spinner size="tiny" /> : 'Guardar y Crear Plan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

// --------------------------------------------------------
// COMPONENTE: MODAL DE DETALLES (Vista auxiliar)
// --------------------------------------------------------

interface SessionDetailsModalProps {
    plan: TherapyPlanData | null;
    onClose: () => void;
}

function SessionDetailsModal({ plan, onClose }: SessionDetailsModalProps) {
    if (!plan) return null;

    return (
        <Dialog open={!!plan} onOpenChange={(_, data) => data.open === false && onClose()}>
            <DialogSurface className="w-11/12 md:w-1/3 max-w-lg shadow-2xl">
                <DialogBody>
                    <DialogTitle className="text-xl font-bold border-b pb-3 mb-4">
                        Horario del Plan #{plan.id}
                    </DialogTitle>
                    <DialogContent>
                        <div className="mb-4 text-base text-gray-800">
                            Paciente (ID {plan.patientId}): {plan.description.replace('Plan de rehabilitación para ', '')}
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Fecha</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Día</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Inicio</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Fin</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                {plan.schedule.length > 0 ? (
                                    plan.schedule.map((session, index) => (
                                        <tr key={index} className="hover:bg-blue-50">
                                            <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                                {formatIsoToDate(session.startTime)}
                                            </td>
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
                                        <td colSpan={4} className="p-3 text-center text-sm text-gray-500 italic">
                                            Este plan no tiene sesiones programadas.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                    </DialogContent>
                    <div className="flex justify-end pt-4 border-t mt-4">
                        <Button onClick={onClose} appearance="secondary">Cerrar</Button>
                    </div>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

// --------------------------------------------------------
// COMPONENTE: TABLA DE RESUMEN
// --------------------------------------------------------

interface TherapyPlansSummaryTableProps {
    plans: TherapyPlanData[];
    onViewDetails: (plan: TherapyPlanData) => void;
}

function TherapyPlansSummaryTable({ plans, onViewDetails }: TherapyPlansSummaryTableProps) {
    return (
        <div className="overflow-x-auto w-full flex-grow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Plan</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">Paciente (ID)</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800 max-w-xs">Objetivos Principales</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Terapista</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-800">ID Evaluación</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-800"></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-blue-50 transition duration-100">
                        <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {plan.id}
                        </td>
                        <td className="p-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {plan.description.replace('Plan de rehabilitación para ', '')} ({plan.patientId})
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-normal max-w-xs">
                            {plan.goals}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{plan.assignedTherapistId}</td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{plan.assessmentId}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                            <Button
                                appearance="primary"
                                size="medium"
                                onClick={() => onViewDetails(plan)}
                            >
                                Ver horario
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// --------------------------------------------------------
// COMPONENTE: CONTROLES DE PIE DE PÁGINA
// --------------------------------------------------------

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
    const { page, size, totalPages, totalItems } = pagination;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-3 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                Mostrando {Math.min((page - 1) * size + 1, totalItems)} - {Math.min(page * size, totalItems)} de {totalItems} planes.
            </span>

            <div className="flex items-center space-x-4">
                <Field label="Mostrar" className="flex items-center space-x-2 text-sm">
                    <Select
                        value={String(size)}
                        onChange={(e) => onSizeChange(parseInt(e.target.value))}
                        size="small"
                        className="w-16"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </Select>
                </Field>

                <div className="flex items-center space-x-2 text-sm">
                    <Button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        appearance="subtle"
                        size="medium"
                        className="bg-gray-100 hover:bg-gray-200"
                    >
                        Anterior
                    </Button>

                    <span className="text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md text-xs font-semibold">
                        Página {page} de {totalPages}
                    </span>

                    <Button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        appearance="subtle"
                        size="medium"
                        className="bg-gray-100 hover:bg-gray-200"
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// COMPONENTE PRINCIPAL DE PÁGINA
// --------------------------------------------------------

interface ToastState {
    title: string;
    body: string;
    intent: 'success' | 'error';
}

export default function TherapyPlansPage() {
    const [plans, setPlans] = useState<TherapyPlanData[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<TherapyPlanData | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentToast, setCurrentToast] = useState<ToastState | null>(null); // Estado para el toast personalizado

    const [coincidences, setCoincidences] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para mostrar el toast personalizado
    const showToast = useCallback((title: string, body: string, intent: 'success' | 'error') => {
        setCurrentToast({ title, body, intent });
    }, []);

    // Función para ocultar el toast personalizado
    const dismissToast = useCallback(() => {
        setCurrentToast(null);
    }, []);


    const handleViewDetails = (plan: TherapyPlanData) => {
        setSelectedPlan(plan);
    };

    const handleCloseDetailsModal = () => {
        setSelectedPlan(null);
    };


    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Función de cierre del modal de creación que puede forzar el refresco
    const handleCloseCreateModal = (didCreate = false) => {
        setIsCreateModalOpen(false);
        if (didCreate) {
            // Volver a la primera página para ver el elemento nuevo y refrescar la lista
            setCurrentPage(1);
            setRefreshTrigger(prev => prev + 1);
        }
    };

    // Efecto: Llamada al servicio para obtener los datos
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const params: TherapyPlanQueryParams = {
                    page: currentPage,
                    size: pageSize,
                };

                const response: TherapyPlanListResponse = await getTherapyPlans(params);

                setPlans(response.data.items);
                setCoincidences(response.data.totalItems);
                setMaxPage(response.data.totalPages);

            } catch (err) {
                console.error("Error final al obtener datos:", err);
                setError(err instanceof Error ? err.message : "Error desconocido al cargar los planes.");
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [currentPage, pageSize, refreshTrigger]);


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

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 relative">

            {/* Notificación Toast Personalizada */}
            {currentToast && (
                <CustomToast
                    title={currentToast.title}
                    body={currentToast.body}
                    intent={currentToast.intent}
                    onDismiss={dismissToast}
                />
            )}

            {/* Encabezado */}
            <div className="w-full max-w-full mx-auto px-8 py-6 bg-white shadow-md flex justify-between items-center border-b border-gray-100">
                <Title1 className="text-gray-900">Gestión de Planes de Terapia</Title1>

                {/* Botón que activa el Pop-up (Componente de Creación) */}
                <Button
                    appearance="primary"
                    size="large"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="shadow-lg transition duration-150 hover:shadow-xl"
                >
                    + Crear Nuevo Plan
                </Button>
            </div>

            {/* Contenido principal y tabla */}
            <div className="flex flex-col flex-grow w-full max-w-full mx-auto px-8 pt-6 pb-4 overflow-hidden">
                <div className="text-sm text-gray-600 mb-3">
                    Total de planes encontrados: <span className="font-semibold text-gray-800">{coincidences}</span>
                </div>

                <div className="bg-white flex-grow border border-gray-200 rounded-xl overflow-hidden shadow-2xl flex flex-col">

                    {loading && (
                        <div className="flex justify-center items-center py-20 flex-grow">
                            <Spinner size="huge" label="Cargando planes de terapia..." />
                        </div>
                    )}

                    {(!loading && plans.length === 0) && (
                        <div className="text-center py-20 text-gray-500 flex-grow flex items-center justify-center">
                            <p className="text-lg">No hay planes de terapia registrados aún.</p>
                        </div>
                    )}

                    {(!loading && plans.length > 0) && (
                        <>
                            <TherapyPlansSummaryTable
                                plans={plans}
                                onViewDetails={handleViewDetails}
                            />
                            {/* Paginador integrado al contenedor de la tabla */}
                            <FooterControls
                                pagination={paginationData}
                                onPageChange={setCurrentPage}
                                onSizeChange={handlePageSizeChange}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Detalles de Sesión */}
            <SessionDetailsModal
                plan={selectedPlan}
                onClose={handleCloseDetailsModal}
            />

            {/* El Pop-up/Modal de Creación que contiene toda la lógica de servicio */}
            <CreateTherapyPlanModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                showToast={showToast}
            />
        </div>
    );
}