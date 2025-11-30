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

export interface TherapistsResponse {
    success: boolean;
    message?: string;
    data?: TherapistProfile[];
}

// Fetch therapists profiles
export async function fetchTherapistsProfiles(): Promise<TherapistsResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_THERAPISTS_PROFILES_ENDPOINT || 'http://20.3.3.31:4000/api/profiles/therapists';

    try {
        console.log('Fetching therapists profiles from:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error al obtener perfiles de terapeutas: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Therapists profiles fetched successfully:', data);

        return {
            success: true,
            message: 'Perfiles obtenidos exitosamente',
            data: data
        };
    } catch (error) {
        console.error('Error fetching therapists profiles:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido al obtener perfiles de terapeutas',
            data: []
        };
    }
}

// Mock data for development
export function getMockTherapistsData(): TherapistProfile[] {
    return [
        {
            attentionPlaceAddress: "Centro de Salud Mental, Av. Arequipa 1245, Miraflores, Lima",
            documentType: "DNI",
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
            documentType: "DNI",
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
}