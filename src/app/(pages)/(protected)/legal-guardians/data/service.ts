// Types for legal guardian data
export interface LegalGuardianProfile {
    id: number;
    firstNames: string;
    paternalSurname: string;
    maternalSurname: string;
    identityDocumentNumber: string;
    documentType: "DNI" | "RUC" | "PASSPORT" | "OTHER";
    phone: string;
    email: string;
    relationship: string;
}

// Fetch legal guardians profiles with mock fallback
async function fetchFromApi(): Promise<LegalGuardianProfile[]> {
    // Use Next.js API route as proxy to avoid CORS issues
    const ApiUrl = '/api/legal-guardians';

    console.log(`Fetching legal guardians from API proxy: ${ApiUrl}`);

    try {
        const response = await fetch(ApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Failed to fetch legal guardians: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Check if the response has the expected structure
        if (data && data.legalResponsible && Array.isArray(data.legalResponsible)) {
            return data.legalResponsible;
        } else if (data && data.legalResponsibles && Array.isArray(data.legalResponsibles)) {
            return data.legalResponsibles;
        } else if (data && data.guardians && Array.isArray(data.guardians)) {
            return data.guardians;
        } else if (Array.isArray(data)) {
            // Fallback if the response is directly an array
            return data;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error fetching legal guardians:', error);
        throw error;
    }
}

// Mock data for development
async function getMockData(): Promise<LegalGuardianProfile[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const guardians = [
                {
                    documentType: "DNI" as const,
                    email: "carmen.perez@gmail.com",
                    firstNames: "Carmen Rosa",
                    id: 1,
                    identityDocumentNumber: "18456723",
                    maternalSurname: "González",
                    paternalSurname: "Pérez",
                    phone: "+51987123456",
                    relationship: "Madre"
                },
                {
                    documentType: "DNI" as const,
                    email: "roberto.jimenez@hotmail.com",
                    firstNames: "Roberto Carlos",
                    id: 2,
                    identityDocumentNumber: "19567834",
                    maternalSurname: "Morales",
                    paternalSurname: "Jiménez",
                    phone: "+51976234567",
                    relationship: "Padre"
                }
            ];

            resolve(guardians);
        }, 500);
    });
}

// Main fetch function with fallback logic
export default async function fetchLegalGuardiansData(): Promise<LegalGuardianProfile[]> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    // Si no hay URL configurada o se fuerza mock, usar datos mock
    if (useMock) {
        console.log('📝 Using MOCK data for legal guardians');
        return getMockData();
    }

    // Si hay URL, hacer fetch real
    try {
        return await fetchFromApi();
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