import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Extract search parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'ACTIVE';
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('page_size') || '10';

        // URL del endpoint backend
        const backendUrl = process.env.PATIENTS_SUMMARY_ENDPOINT || 'https://soulware.site/api/profiles/getPatientProfiles';
        
        // Build the full URL with parameters
        const params = new URLSearchParams({
            status,
            page,
            page_size: pageSize,
        });
        
        const fullUrl = `${backendUrl}?${params.toString()}`;

        console.log('Proxying patient profiles request to:', fullUrl);

        // Hacer la petición al backend desde el servidor (sin restricciones CORS)
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            console.error('Backend error:', errorData);
            return NextResponse.json(
                { error: errorData.error || `Failed to fetch patients: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Patient profiles fetched successfully');

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in patients API route:', error);
        return NextResponse.json(
            { error: 'Internal server error while fetching patients' },
            { status: 500 }
        );
    }
}