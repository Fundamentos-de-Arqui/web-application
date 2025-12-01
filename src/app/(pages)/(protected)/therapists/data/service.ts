// Types for therapist data
export interface TherapistProfile {
    id: number;
    firstNames: string;
    paternalSurname: string;
    maternalSurname: string;
    identityDocumentNumber: string;
    documentType: "DNI" | "RUC" | "PASSPORT" | "OTHER";
    phone: string;
    email: string;
    specialtyName: string;
    attentionPlaceAddress: string;
}

// Fetch therapists profiles with mock fallback
async function fetchFromApi(): Promise<TherapistProfile[]> {
    // Use Next.js API route as proxy to avoid CORS issues
    const ApiUrl = '/api/therapists';

    console.log(`Fetching therapists from API proxy: ${ApiUrl}`);

    try {
        const response = await fetch(ApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Failed to fetch therapists: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Check if the response has the expected structure
        if (data && data.therapists && Array.isArray(data.therapists)) {
            return data.therapists;
        } else if (Array.isArray(data)) {
            // Fallback if the response is directly an array
            return data;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error fetching therapists:', error);
        throw error;
    }
}

// Mock data for development
async function getMockData(): Promise<TherapistProfile[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const therapists = [
                {
                    attentionPlaceAddress: "Centro de Salud Mental, Av. Arequipa 1245, Miraflores, Lima",
                    documentType: "DNI" as const,
                    email: "ana.rodriguez@terapiaclinica.com",
                    firstNames: "Ana Sofía",
                    id: 1,
                    identityDocumentNumber: "25468731",
                    maternalSurname: "Martínez",
                    paternalSurname: "Rodríguez",
                    phone: "+51987654321",
                    specialtyName: "Psicología Clínica"
                },
                {
                    attentionPlaceAddress: "Clínica Pediátrica San Juan, Av. Brasil 567, Magdalena, Lima",
                    documentType: "DNI" as const,
                    email: "carlos.garcia@infancia.com",
                    firstNames: "Carlos Eduardo",
                    id: 2,
                    identityDocumentNumber: "26589473",
                    maternalSurname: "López",
                    paternalSurname: "García",
                    phone: "+51965432187",
                    specialtyName: "Psicología Infantil"
                }
            ];

            resolve(therapists);
        }, 500);
    });
}

// Main fetch function with fallback logic
export default async function fetchTherapistsData(): Promise<TherapistProfile[]> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    // Si no hay URL configurada o se fuerza mock, usar datos mock
    if (useMock) {
        console.log('📝 Using MOCK data for therapists');
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