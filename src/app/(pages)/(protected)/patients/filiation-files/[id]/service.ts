interface ResponseGet {
    id: number //del registro
    scheduledAt: string
    patient: Patient
    therapist: Therapist
    assessmentType: string,
    createdAt: string,
    description: string,
    diagnostic: string,
    treatment: string,
    versionNumber: number
}

interface Patient{
    birthDate: string,
    birthPlace: string,
    country: string,
    currentAddress: string,
    currentAge: number,
    currentEducationalInstitution: string,
    district: string,
    documentType: string,
    educationLevel: string,
    email: string,
    firstAppointmentAge: number,
    firstNames: string,
    gender: string,
    identityDocumentNumber: string,
    maritalStatus: string,
    maternalSurname: string,
    occupation: string,
    paternalSurname: string,
    phone: string,
    province: string,
    region: string,
    religion: string
}

interface Therapist {
     attentionPlaceAddress: string,
     documentType: string,
     email: string,
     firstNames: string,
     identityDocumentNumber: string,
     maternalSurname: string,
     paternalSurname: string,
     phone: string,
     specialtyName: string
}

function getMockData(id: number): ResponseGet {
    return {
        id: id,
        scheduledAt: "2024-11-15T10:30:00",
        createdAt: "2024-11-15T09:00:00",
        assessmentType: "Evaluación Inicial",
        description: "Paciente presenta cuadro de ansiedad moderada relacionada con el inicio del año escolar. Se observa dificultad para concentrarse y episodios ocasionales de tensión muscular.",
        diagnostic: "F41.1 - Trastorno de ansiedad generalizada",
        treatment: "Se recomienda terapia cognitivo-conductual semanal durante 12 sesiones. Ejercicios de relajación y respiración diarios. Revisión mensual del progreso.",
        versionNumber: 1,
        patient: {
            birthDate: "2010-05-15",
            birthPlace: "Lima",
            country: "Perú",
            currentAddress: "Av. Principal 123, Dpto. 401",
            currentAge: 14,
            currentEducationalInstitution: "Colegio San Juan Bautista",
            district: "San Isidro",
            documentType: "DNI",
            educationLevel: "Secundaria - 3er Grado",
            email: "juan.perez.gomez@email.com",
            firstAppointmentAge: 13,
            firstNames: "Juan Carlos",
            gender: "Masculino",
            identityDocumentNumber: "12345678",
            maritalStatus: "Soltero",
            maternalSurname: "Gomez",
            occupation: "Estudiante",
            paternalSurname: "Perez",
            phone: "987654321",
            province: "Lima",
            region: "Lima",
            religion: "Católico"
        },
        therapist: {
            attentionPlaceAddress: "Av. Terapeutas 456, Consultorio 302, San Isidro",
            documentType: "DNI",
            email: "maria.garcia.lopez@clinica.com",
            firstNames: "María Elena",
            identityDocumentNumber: "87654321",
            maternalSurname: "Lopez",
            paternalSurname: "Garcia",
            phone: "998877665",
            specialtyName: "Psicología Clínica Infantil y Adolescente"
        }
    };
}
export default async function getFiliationFileData(id: number): Promise<ResponseGet> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    // Si no hay URL configurada o se fuerza mock, usar datos mock
    if (useMock) {
        console.log('📝 Usando datos MOCK para ID:', id);
        // Simular delay de red
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getMockData(id));
            }, 300);
        });
    }

    // Use Next.js API route as proxy to avoid CORS issues
    const apiUrl = '/api/medical-records';

    const requestBody = {
        patientId: id,
        versionNumber: 2,
        orderBy: "null",
        page: 0,
        size: 10
    };

    try {
        console.log('Fetching medical records for patient ID:', id);
        
        const response = await fetch(apiUrl, {
            method: 'POST', // Use POST to send the body to the proxy
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Failed to fetch filiation file: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Medical records data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching filiation file:', error);
        
        // Fallback to mock data in development if API fails
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ API call failed, falling back to MOCK data');
            return getMockData(id);
        }
        
        throw error;
    }
}

