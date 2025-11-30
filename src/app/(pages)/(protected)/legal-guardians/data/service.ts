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

export interface LegalGuardiansResponse {
    success: boolean;
    message?: string;
    data?: LegalGuardianProfile[];
}

// Fetch legal guardians profiles
export async function fetchLegalGuardiansProfiles(): Promise<LegalGuardiansResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_LEGAL_GUARDIANS_PROFILES_ENDPOINT || 'http://20.3.3.31:4000/api/profiles/legal-responsible';

    try {
        console.log('Fetching legal guardians profiles from:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error al obtener perfiles de responsables legales: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Legal guardians profiles fetched successfully:', data);

        return {
            success: true,
            message: 'Perfiles obtenidos exitosamente',
            data: data
        };
    } catch (error) {
        console.error('Error fetching legal guardians profiles:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido al obtener perfiles de responsables legales',
            data: []
        };
    }
}

// Mock data for development
export function getMockLegalGuardiansData(): LegalGuardianProfile[] {
    return [
        {
            documentType: "DNI",
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
            documentType: "DNI",
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
}