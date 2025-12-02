export interface ScheduleEntry {
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    startTime: string; // Cadena ISO 8601, ej., "2025-12-22T20:30:00Z"
    endTime: string;   // Cadena ISO 8601, ej., "2025-12-22T21:30:00Z"
}

export interface TherapyPlanData {
    id: number;
    patientId: number;
    assessmentId: number;
    assignedTherapistId: number;
    description: string;
    goals: string;
    legalResponsibleId: number;
    schedule: ScheduleEntry[];
}

// Interfaz para los datos que se envían al POST (sin 'id' ni 'patientId' de entrada)
export interface TherapyPlanCreationData extends Omit<TherapyPlanData, 'id' | 'patientId'> {}


export interface TherapyPlanQueryParams {
    page?: number;
    size?: number;
}

export interface TherapyPlanListResponse {
    data: {
        items: TherapyPlanData[];
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
    };
}

// --- CONFIGURACIÓN Y MOCK DATA ---
// Usaremos la URL específica que proporcionaste
const API_BASE_URL = 'http://20.3.3.31:4000';
const API_ROUTE = '/api/therapy-plans';

const RESPONSABLES = [
    { name: "Ana Lucía Fernández Delgado", phone: "+51954456789", id: 1 },
    { name: "Carmen Rosa Pérez González", phone: "+51987123456", id: 2 },
    { name: "Rosa María Castro Vargas", phone: "+51965345678", id: 3 },
    { name: "Roberto Carlos Jiménez Morales", phone: "+51976234567", id: 4 },
];

const DAYS_OF_WEEK: ScheduleEntry["dayOfWeek"][] = ["MONDAY", "WEDNESDAY", "FRIDAY", "SATURDAY"];

const generateMockSchedule = (id: number): ScheduleEntry[] => {
    const schedules: ScheduleEntry[] = [];
    const numSessions = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numSessions; i++) {
        const day = DAYS_OF_WEEK[(id + i) % DAYS_OF_WEEK.length];
        const hour = 10 + (id % 8);
        const date = new Date();
        date.setFullYear(2025);
        date.setMonth(11); // Diciembre
        date.setDate(20 + i);
        date.setHours(hour, 0, 0, 0);

        const startTime = date.toISOString().replace(/\.\d{3}Z$/, 'Z');
        date.setHours(hour + 1);
        const endTime = date.toISOString().replace(/\.\d{3}Z$/, 'Z');

        schedules.push({ dayOfWeek: day, startTime, endTime });
    }
    return schedules;
}

const generateMockPlan = (id: number, index: number): TherapyPlanData => {
    const responsible = RESPONSABLES[index % RESPONSABLES.length];

    let patientName = `${id}`;
    if (id === 1) patientName = "Camila Alejandra Fernández Romero";
    if (id === 2) patientName = "Diego Alejandro Pérez Martín";
    if (id === 3) patientName = "Isabella Sofía Castro Mendoza";

    return {
        id,
        patientId: 50 + id,
        assessmentId: 100 + id,
        assignedTherapistId: Math.floor(Math.random() * 10) + 1,
        description: `Plan de rehabilitación para ${patientName}`,
        goals: `Meta: Mejorar la funcionalidad en ${id}% en las próximas 8 semanas.`,
        legalResponsibleId: responsible.id,
        schedule: generateMockSchedule(id),
    };
};

// Generamos 100 planes de prueba
const MOCK_PLANS: TherapyPlanData[] = Array.from({ length: 100 }, (_, i) => generateMockPlan(i + 1, i));

// Variable para el próximo ID de mock
let nextMockId = MOCK_PLANS.length + 1;

/**
 * Genera la respuesta paginada usando los datos de mock locales.
 */
export function getMockTherapyPlans(params: TherapyPlanQueryParams): TherapyPlanListResponse {
    let filteredPlans = MOCK_PLANS;

    // 1. Aplicar Paginación
    const totalItems = filteredPlans.length;
    const page = params.page || 1;
    const size = params.size || 10;
    const totalPages = Math.ceil(totalItems / size);

    // Ajuste de límites para paginación segura
    const finalPage = Math.min(Math.max(1, page), totalPages) || 1;
    const finalStartIndex = (finalPage - 1) * size;
    const finalEndIndex = finalStartIndex + size;

    // Invertimos el orden para que los planes recién creados aparezcan primero
    const paginatedItems = filteredPlans.slice().reverse().slice(finalStartIndex, finalEndIndex);

    return {
        data: {
            items: paginatedItems,
            page: finalPage,
            size: size,
            totalItems: totalItems,
            totalPages: totalPages,
        }
    };
}


// --- FUNCIÓN PRINCIPAL DE OBTENCIÓN (GET) ---
export async function getTherapyPlans(
    params: TherapyPlanQueryParams = {}
): Promise<TherapyPlanListResponse> {

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });

    const apiUrlWithParams = `${API_BASE_URL}${API_ROUTE}?${query.toString()}`;
    console.log('Intentando obtener planes de terapia de:', apiUrlWithParams);

    try {
        const response = await fetch(apiUrlWithParams, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errorData = await response.json();
                errorDetail = errorData.error || errorData.message || response.statusText;
            } catch (e) {
                // No hay JSON en el cuerpo de error
            }
            console.warn(`Error ${response.status} al conectar con API (GET). Usando mock data. Detalle: ${errorDetail}`);

            // FALLBACK 1: Error HTTP (respuesta 4xx/5xx), pero la conexión se estableció.
            return getMockTherapyPlans(params);
        }

        const data: TherapyPlanListResponse = await response.json();
        console.log(`Planes de Terapia obtenidos del API. Total: ${data.data.totalItems}`);
        return data;

    } catch (error) {
        // FALLBACK 2: Error de red (fetch falló completamente, ej. CORS, DNS, servidor caído).
        console.error('Error de conexión con el backend (GET). Usando mock data.', error);

        // Simulación de un retraso mínimo para simular un intento de red fallido.
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockTherapyPlans(params);
    }
}


// --- FUNCIÓN PRINCIPAL DE CREACIÓN (POST) ---
export async function createTherapyPlan(
    planData: TherapyPlanCreationData
): Promise<TherapyPlanData> {

    const apiUrl = `${API_BASE_URL}${API_ROUTE}`;
    console.log('Intentando crear plan de terapia en:', apiUrl);

    // Simulación del ID del paciente. Esto podría ser manejado por el backend
    // o requerido en la interfaz TherapyPlanCreationData, pero aquí lo simulamos para el mock.
    const patientIdGuess = planData.assessmentId + 1;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(planData),
        });

        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errorData = await response.json();
                errorDetail = errorData.error || errorData.message || response.statusText;
            } catch (e) {
                // No hay JSON en el cuerpo de error
            }
            console.warn(`Error ${response.status} al crear plan en API (POST). Usando mock data. Detalle: ${errorDetail}`);

            // FALLBACK 1: Error HTTP (respuesta 4xx/5xx) -> Simular creación localmente
            const newMockPlan: TherapyPlanData = {
                ...planData,
                id: nextMockId++, // Asignar nuevo ID simulado
                patientId: patientIdGuess,
            };
            MOCK_PLANS.push(newMockPlan);
            console.log(`Plan creado en mock con ID: ${newMockPlan.id}`);
            return newMockPlan;
        }

        // Si la respuesta es exitosa (200, 201), parsear el cuerpo
        const responseBody = await response.json();
        const createdPlan: TherapyPlanData = responseBody.data;

        // Opcional: Si el backend es exitoso, agregar el plan al mock para mantener la consistencia en el GET posterior
        // Esto solo es necesario en un entorno de desarrollo sin base de datos real.
        MOCK_PLANS.push(createdPlan);

        console.log(`Plan de Terapia creado exitosamente. ID: ${createdPlan.id}`);
        return createdPlan;

    } catch (error) {
        // FALLBACK 2: Error de red (fetch falló completamente) -> Simular creación localmente
        console.error('Error de conexión con el backend (POST). Simulando creación local.', error);

        await new Promise(resolve => setTimeout(resolve, 500));

        const newMockPlan: TherapyPlanData = {
            ...planData,
            id: nextMockId++, // Asignar nuevo ID simulado
            patientId: patientIdGuess,
        };
        MOCK_PLANS.push(newMockPlan);
        console.log(`Plan creado en mock con ID: ${newMockPlan.id}`);
        return newMockPlan;
    }
}