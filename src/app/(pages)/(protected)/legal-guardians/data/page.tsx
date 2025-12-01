'use client';

import styles from './data.module.css';
import { useEffect, useMemo, useState } from 'react';
import LegalGuardiansSummaryTable from "@/app/(pages)/(protected)/legal-guardians/data/components/LegalGuardiansSummaryTable";
import { Title1 } from "@fluentui/react-text";
import { LegalGuardianProfile } from "@/app/(pages)/(protected)/legal-guardians/data/service";
import fetchLegalGuardiansData from "@/app/(pages)/(protected)/legal-guardians/data/service";

export default function LegalGuardiansDataPage() {
    const [guardiansList, setGuardiansList] = useState<LegalGuardianProfile[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Fetch legal guardians data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchLegalGuardiansData();
                setGuardiansList(response);
            } catch (error) {
                console.error('Error fetching legal guardians data:', error);
            }
        };
        void fetchData();
    }, []);

    // Pagination logic
    const paginatedGuardiansList = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return guardiansList.slice(startIndex, endIndex);
    }, [guardiansList, currentPage, pageSize]);

    const totalPages = Math.ceil(guardiansList.length / pageSize);

    return (
        <div className="main-column">
            <div className={styles.controlsDiv}>
                {/* Espacio para controles - mantiene la estructura de pacientes */}
            </div>
            <div className={styles.dataTableDiv}>
                <Title1>Datos de Responsables Legales</Title1>
                <LegalGuardiansSummaryTable guardians={paginatedGuardiansList} />
                {guardiansList.length > pageSize && (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                        Página {currentPage} de {totalPages} - Total: {guardiansList.length} responsables legales
                    </div>
                )}
            </div>
        </div>
    );
}