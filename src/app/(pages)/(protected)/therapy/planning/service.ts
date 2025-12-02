export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleItem {
    dayOfWeek: DayOfWeek;
    endTime: string;
    startTime: string;
}

export interface TherapyPlanData {
    assessmentId: number;
    assignedTherapistId: number;
    description: string;
    goals: string;
    id: number;
    legalResponsibleId: number;
    patientId: number;
    schedule: ScheduleItem[];
}

export interface TherapyPlanCreationPayload {
    assessmentId: number;
    description: string;
    goals: string;
    assignedTherapistId: number;
    legalResponsibleId: number;
    schedule: ScheduleItem[];
}

export interface TherapyPlanResponse {
    status: "success" | "error" | string;
    data: TherapyPlanData;
    timestamp: string;
}

export interface TherapyPlanList {
    items: TherapyPlanData[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

export interface TherapyPlanListResponse {
    status: "success" | "error" | string;
    data: TherapyPlanList;
    timestamp: string;
}

export interface TherapyPlanQueryParams {
    page?: number;
    size?: number;
    assessmentId?: number;
    therapistId?: number;
    patientId?: number;
}

const API_ROUTE = '/api/therapy-plans';

export async function createTherapyPlan(
    payload: TherapyPlanCreationPayload
): Promise<TherapyPlanResponse> {

    console.log('Enviando payload al proxy de Next.js:', API_ROUTE, payload);

    try {
        const response = await fetch(API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errorData = await response.json();
                errorDetail = errorData.error || errorData.message || response.statusText;
            } catch (e) {
            }
            throw new Error(`Error ${response.status}: ${errorDetail}`);
        }

        const data: TherapyPlanResponse = await response.json();
        console.log('Plan de Terapia creado exitosamente. ID:', data.data.id);
        return data;

    } catch (error) {
        console.error('Error en el servicio createTherapyPlan:', error);
        throw error;
    }
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
    console.log('Obteniendo planes de terapia de:', apiUrlWithParams);

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
            throw new Error(`Error ${response.status}: ${errorDetail}`);
        }

        const data: TherapyPlanListResponse = await response.json();
        console.log(`Planes de Terapia obtenidos. Total: ${data.data.totalItems}`);
        return data;

    } catch (error) {
        console.error('Error en el servicio getTherapyPlans:', error);
        throw error;
    }
}