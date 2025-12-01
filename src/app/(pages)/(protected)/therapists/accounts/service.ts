// Types for therapist registration
export interface TherapistRegistrationRequest {
    password: string;
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

export interface TherapistRegistrationResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// Register therapist function
export async function registerTherapist(
    therapistData: TherapistRegistrationRequest
): Promise<TherapistRegistrationResponse> {
    // Use Next.js API route as proxy to avoid CORS issues
    const apiUrl = '/api/therapists/register';

    try {
        console.log('Registering therapist:', therapistData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(therapistData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Error al registrar terapeuta: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Therapist registered successfully:', data);

        return {
            success: true,
            message: 'Terapeuta registrado exitosamente',
            data: data
        };
    } catch (error) {
        console.error('Error registering therapist:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido al registrar terapeuta'
        };
    }
}