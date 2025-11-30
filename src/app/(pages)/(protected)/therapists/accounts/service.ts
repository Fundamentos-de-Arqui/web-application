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
    const apiUrl = process.env.NEXT_PUBLIC_THERAPIST_REGISTER_ENDPOINT || 'http://20.3.3.31:4000/api/register';

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
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error al registrar terapeuta: ${response.statusText}`);
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