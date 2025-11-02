'use client';

import styles from './filiation-files.module.css';
import {useEffect, useMemo, useState} from 'react';
import {useI18n} from '@/app/providers/i18n';
import FiliationFilesTabs from "@/app/(pages)/(protected)/patients/filiation-files/components/FiliationFilesTabs";
import FiliationFilesSummaryTable from "@/app/(pages)/(protected)/patients/filiation-files/components/FiliationFilesSummaryTable";
import Pager from "@/app/components/shared/Pager";
import fetchPatientsSummaryData from "@/app/(pages)/(protected)/patients/filiation-files/service";
import {Title1} from "@fluentui/react-text";
import {PatientSummary, Status} from "@/app/(pages)/(protected)/patients/filiation-files/model/PatientSummary";

const PATIENTS_NAME_SPACE = 'patients';

export default function PatientsFiliationFilesPage() {
    const [fullPatientList, setFullPatientsList] = useState<PatientSummary[]>([]);
    const [coincidences, setCoincidences] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [activeTab, setTab] = useState(1);
    const [status, setStatus] = useState<Status>("ACTIVE");

    //Change tab -> change status filter
    useEffect(() => {
        const tabIntoStatus = (tab: number): Status => {
            switch (tab) {
                case 1:
                    return "ACTIVE";
                case 2:
                    return "INACTIVE";
                case 3:
                    return "ARCHIVED";
                default:
                    return "ACTIVE";
            }
        };
        setStatus(tabIntoStatus(activeTab));
    }, [activeTab]);

    //Change any search filter -> query the backend service
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchPatientsSummaryData(status, currentPage, pageSize);
            setFullPatientsList(prev => {
                const merged = new Map();
                prev.forEach(p => merged.set(p.id, p));
                response.patients.forEach(p => merged.set(p.id, p));
                return Array.from(merged.values());
            });
            setCoincidences(response.totalResults);
            setMaxPage(response.maxPage);
        };
        void fetchData();
    }, [status, currentPage, pageSize]);

    //Change page or full patient list -> recalc according to filter
    const filteredPatientsList = useMemo(() => {
        const filtered = fullPatientList.filter(
            patient => patient.status === status
        );
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [fullPatientList, status]);

    //If patient pool changes, the table data must update and recalc itself
    const paginatedPatientList = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredPatientsList.slice(startIndex, endIndex);
    }, [filteredPatientsList, currentPage, pageSize]);

    const i18n = useI18n();
    useEffect(() => {
        void i18n.loadChunk(PATIENTS_NAME_SPACE);
    }, [i18n.loadChunk]);

    return (
        <div className="main-column">
            <div className={styles.controlsDiv}>
                <FiliationFilesTabs activeTab={activeTab} setTab={setTab}/>
            </div>
            <div className={styles.dataTableDiv}>
                <Title1>{i18n.t(PATIENTS_NAME_SPACE, "table-header")}</Title1>
                <FiliationFilesSummaryTable patients={paginatedPatientList}/>
                <Pager
                    currentPage={currentPage}
                    totalPages={maxPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

//http://localhost:4000/api/profiles/getPatientProfiles?status=NNN&page_size=N&page=N