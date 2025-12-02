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

    let patientName = `Paciente Ejemplo ${id}`;
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

const MOCK_PLANS: TherapyPlanData[] = Array.from({ length: 100 }, (_, i) => generateMockPlan(i + 1, i));

export function getMockTherapyPlans(params: TherapyPlanQueryParams): TherapyPlanListResponse {
    let filteredPlans = MOCK_PLANS;

    const totalItems = filteredPlans.length;
    const page = params.page || 1;
    const size = params.size || 10;
    const totalPages = Math.ceil(totalItems / size);

    const finalPage = Math.min(Math.max(1, page), totalPages) || 1;
    const finalStartIndex = (finalPage - 1) * size;
    const finalEndIndex = finalStartIndex + size;

    const paginatedItems = filteredPlans.slice(finalStartIndex, finalEndIndex);

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

export async function getTherapyPlans(
    params: TherapyPlanQueryParams = {}
): Promise<TherapyPlanListResponse> {

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });

    const apiUrlWithParams = `${API_ROUTE}?${query.toString()}`;
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
            }
            console.warn(`Error ${response.status} al conectar con API. Usando mock data. Detalle: ${errorDetail}`);

            return getMockTherapyPlans(params);
        }

        const data: TherapyPlanListResponse = await response.json();
        console.log(`Planes de Terapia obtenidos del API. Total: ${data.data.totalItems}`);
        return data;

    } catch (error) {
        console.error('Error de conexión con el backend (red/servidor). Usando mock data.', error);

        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockTherapyPlans(params);
    }
}