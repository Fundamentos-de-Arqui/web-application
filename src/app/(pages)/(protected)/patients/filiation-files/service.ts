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

async function fetchFromApi(status: string, page: number, pageSize: number): Promise<PatientsSummaryWrapperDto> {
    // Use Next.js API route as proxy to avoid CORS issues
    const ApiUrl = '/api/patients';

    const params = new URLSearchParams({
        status: status,
        page_size: pageSize.toString(),
        page: page.toString(),
    });

    const url = `${ApiUrl}?${params.toString()}`;

    console.log(`Fetching patients summary from API proxy: ${url}`);

    try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Failed to fetch patients summary: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching patients summary:', error);
        throw error;
    }
}

//Call to api gateway
async function getMockData(): Promise<PatientsSummaryWrapperDto> {
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

async function getData(
    status: string,
    page: number,
    pageSize: number
): Promise<PatientsSummaryWrapperDto> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    // Si no hay URL configurada o se fuerza mock, usar datos mock
    if (useMock) {
        console.log('📝 Using MOCK data for patient profiles');
        return getMockData();
    }

    // Si hay URL, hacer fetch real
    try {
        return await fetchFromApi(status, page, pageSize);
    } catch (error) {
        // Si falla y estás en desarrollo, puedes retornar mock como fallback
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ API call failed, falling back to MOCK data');
            return getMockData();
        }
        // En producción, relanzar el error
        throw error;
    }
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
    const wrapper = await getData(status, currentPage, pageSize);
    return {
        totalResults: wrapper.totalResults,
        currentPage: wrapper.currentPage,
        maxPage: wrapper.maxPage,
        patients: wrapper.patients.map(mapToPatientSummary),
    };
}

export async function uploadExcelFile(file: File): Promise<void> {
    // Usar la API route de Next.js como proxy para evitar problemas de CORS
    const apiUrl = '/api/excel/upload-and-process';
    
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            // No incluir Content-Type header, el navegador lo establecerá automáticamente con el boundary correcto
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Error al subir el archivo: ${response.statusText}`);
        }

        // El endpoint solo importa, no procesa, así que solo verificamos que la respuesta sea exitosa
        console.log('Archivo subido exitosamente al endpoint de importación');
    } catch (error) {
        console.error('Error uploading Excel file:', error);
        throw error;
    }
}