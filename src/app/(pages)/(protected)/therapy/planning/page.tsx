'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Title1 } from '@fluentui/react-text';
import {
    getTherapyPlans,
    TherapyPlanData,
    TherapyPlanListResponse,
    TherapyPlanQueryParams
} from "@/app/(pages)/(protected)/therapy/planning/service";
import FiliationFilesTabs from "@/app/(pages)/(protected)/patients/filiation-files/components/FiliationFilesTabs";

type AssessmentStatus = "POST_OP" | "CRONIC" | "NEW_PATIENT";

const TAB_STATUS_MAP: Record<number, AssessmentStatus> = {
    1: "POST_OP",
    2: "CRONIC",
    3: "NEW_PATIENT",
};

export default function TherapyPlansPage() {
    const [fullPlanList, setFullPlanList] = useState<TherapyPlanData[]>([]);

    const [coincidences, setCoincidences] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);

    const [activeTab, setTab] = useState(1);
    const [status, setStatus] = useState<AssessmentStatus>("POST_OP");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setStatus(TAB_STATUS_MAP[activeTab] || "POST_OP");
    }, [activeTab]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // Simulación: Mapeamos el 'status' local a un filtro real del backend (e.g., patientId)
            // Se debe ajustar esta lógica de simulación en un entorno real.
            const simulatedFilterValue = status === "POST_OP" ? 19 : 54;

            try {
                const params: TherapyPlanQueryParams = {
                    page: currentPage,
                    size: pageSize,
                    patientId: simulatedFilterValue,
                };

                const response: TherapyPlanListResponse = await getTherapyPlans(params);

                const totalResults = response.data.totalItems;
                const totalPages = response.data.totalPages;

                setFullPlanList(prev => {
                    const merged = new Map();
                    prev.forEach(p => merged.set(p.id, p));
                    response.data.items.forEach(p => merged.set(p.id, p));
                    return Array.from(merged.values());
                });

                setCoincidences(totalResults);
                setMaxPage(totalPages);

            } catch (err) {
                console.error("Error al obtener datos:", err);
                setError("Error al cargar los planes. Intente recargar la página.");
                setFullPlanList([]); // Limpiar lista en caso de error
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [status, currentPage, pageSize]);

    const filteredPlanList = useMemo(() => {
        return fullPlanList.sort((a, b) => a.id - b.id);
    }, [fullPlanList]);

    const paginatedPlanList = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return filteredPlanList.slice(startIndex, endIndex).slice(0, pageSize);
    }, [filteredPlanList, currentPage, pageSize]);


    if (error) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <p className="text-red-700 bg-red-100 p-4 rounded-md shadow-lg">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="mb-8">
                <FiliationFilesTabs activeTab={activeTab} setTab={setTab} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                {/* <ExcelImportArea /> */}
                <Title1 className="text-gray-800">Fichas de Planes de Terapia</Title1>

                <div className="text-sm text-gray-500">
                    Coincidencias encontradas: {coincidences} | Filtro activo: {status}
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-blue-600">Cargando datos...</p>
                    </div>
                )}

                {(!loading && paginatedPlanList.length === 0) && (
                    <div className="text-center py-10 text-gray-500">
                        No se encontraron planes para este filtro.
                    </div>
                )}

            </div>
        </div>
    );
}