'use client';

import styles from './data.module.css';
import { useEffect, useMemo, useState } from 'react';
import TherapistsSummaryTable from "@/app/(pages)/(protected)/therapists/data/components/TherapistsSummaryTable";
import { Title1 } from "@fluentui/react-text";
import { TherapistProfile } from "@/app/(pages)/(protected)/therapists/data/service";
import fetchTherapistsData from "@/app/(pages)/(protected)/therapists/data/service";

export default function TherapistsDataPage() {
    const [therapistsList, setTherapistsList] = useState<TherapistProfile[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Fetch therapists data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTherapistsData();
                setTherapistsList(response);
            } catch (error) {
                console.error('Error fetching therapists data:', error);
            }
        };
        void fetchData();
    }, []);

    // Pagination logic
    const paginatedTherapistsList = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return therapistsList.slice(startIndex, endIndex);
    }, [therapistsList, currentPage, pageSize]);

    const totalPages = Math.ceil(therapistsList.length / pageSize);

    return (
        <div className="main-column">
            <div className={styles.controlsDiv}>
                {/* Espacio para controles - mantiene la estructura de pacientes */}
            </div>
            <div className={styles.dataTableDiv}>
                <Title1>Datos de Terapeutas</Title1>
                <TherapistsSummaryTable therapists={paginatedTherapistsList} />
                {therapistsList.length > pageSize && (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                        Página {currentPage} de {totalPages} - Total: {therapistsList.length} terapeutas
                    </div>
                )}
            </div>
        </div>
    );
}