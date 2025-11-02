import {PatientSummary} from "@/app/(pages)/(protected)/patients/filiation-files/model/PatientSummary";

//Resource
interface PatientSummaryDto {
    id: number;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    name: string;
    documentType: "DNI" | "CE";
    documentNumber: string;
    legalResponsible: string;
    legalResponsiblePhone: string;
    scheduledAt: string;
}

interface PatientsSummaryWrapperDto {
    totalResults: number;
    currentPage: number;
    maxPage: number;
    patients: PatientSummaryDto[];
}

//Call to api gateway
async function getData(): Promise<PatientsSummaryWrapperDto> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const patients: PatientSummaryDto[] = [
                {
                    id: 1,
                    status: "ACTIVE",
                    name: "Juan Carlos Perez Gomez",
                    documentType: "DNI",
                    documentNumber: "12345678",
                    legalResponsible: "Maria Luisa Gomez Torres",
                    legalResponsiblePhone: "988776655",
                    scheduledAt: "2024-11-15T10:30:00",
                },
                {
                    id: 2,
                    status: "INACTIVE",
                    name: "Ana Sofia Rodriguez Martinez",
                    documentType: "DNI",
                    documentNumber: "87654321",
                    legalResponsible: "Carlos Rodriguez Sanchez",
                    legalResponsiblePhone: "977554433",
                    scheduledAt: "2024-11-16T14:15:00",
                },
                {
                    id: 3,
                    status: "ARCHIVED",
                    name: "Luis Fernando Castro Vega",
                    documentType: "CE",
                    documentNumber: "CE123456789",
                    legalResponsible: "Juan Carlos Bodoque",
                    legalResponsiblePhone: "123654123",
                    scheduledAt: "2024-11-16T14:15:00",
                },
            ];

            resolve({
                totalResults: patients.length,
                currentPage: 1,
                maxPage: 1,
                patients,
            });
        }, 500);
    });
}

//Mapper helper
function mapToPatientSummary(dto: PatientSummaryDto): PatientSummary {
    return {
        id: dto.id,
        name: dto.name,
        status: dto.status,
        documentNumber: dto.documentNumber,
        documentType: dto.documentType,
        legalGuardianName: dto.legalResponsible,
        legalGuardianPhone: dto.legalResponsiblePhone,
        initialAssessmentDate: new Date(dto.scheduledAt)
    };
}

export default async function fetchPatientsSummaryData(
    status: string,
    currentPage: number,
    pageSize: number
): Promise<{
    totalResults: number;
    currentPage: number;
    maxPage: number;
    patients: PatientSummary[];
}> {
    const wrapper = await getData();
    return {
        totalResults: wrapper.totalResults,
        currentPage: wrapper.currentPage,
        maxPage: wrapper.maxPage,
        patients: wrapper.patients.map(mapToPatientSummary),
    };
}