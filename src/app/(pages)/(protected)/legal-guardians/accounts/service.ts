// Types for legal guardian registration
export interface LegalGuardianRegistrationRequest {
    password: string;
    documentType: "DNI" | "RUC" | "PASSPORT" | "OTHER";
    email: string;
    firstNames: string;
    identityDocumentNumber: string;
    maternalSurname: string;
    paternalSurname: string;
    phone: string;
    relationship: string;
}

export interface LegalGuardianRegistrationResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// Register legal guardian function
export async function registerLegalGuardian(
    guardianData: LegalGuardianRegistrationRequest
): Promise<LegalGuardianRegistrationResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_LEGAL_GUARDIAN_REGISTER_ENDPOINT || 'http://20.3.3.31:4000/api/register';

    try {
        console.log('Registering legal guardian:', guardianData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(guardianData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error al registrar responsable legal: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Legal guardian registered successfully:', data);

        return {
            success: true,
            message: 'Responsable legal registrado exitosamente',
            data: data
        };
    } catch (error) {
        console.error('Error registering legal guardian:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido al registrar responsable legal'
        };
    }
}