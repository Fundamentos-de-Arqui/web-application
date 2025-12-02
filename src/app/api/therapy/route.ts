import { NextRequest, NextResponse } from 'next/server';
/*
export async function GET(request: NextRequest) {
    try {
        // URL del endpoint backend
        const backendUrl = process.env.SESSIONS_ENDPOINT || 'http://20.3.3.31:4000/api/therapy-plans';

        console.log('Proxying request to:', backendUrl);

        // Hacer la petición al backend desde el servidor (sin restricciones CORS)
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Error al obtener planes de terapia: ${response.statusText}. ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Therapy plans fetched successfully:', data);

        // Devolver los datos tal como los devuelve el backend
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in therapists proxy:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido al obtener planes de terapia' },
            { status: 500 }
        );
    }
}*/