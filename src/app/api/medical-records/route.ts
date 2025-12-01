import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        
        // URL del endpoint backend
        const backendUrl = process.env.MEDICAL_RECORDS_ENDPOINT || 'https://soulware.site/api/clinical-folders/medical-records/';

        console.log('Proxying medical records request to:', backendUrl);
        console.log('Request data:', requestData);

        // Hacer la petición al backend con GET pero con body (caso especial)
        const response = await fetch(backendUrl, {
            method: 'GET',
            body: JSON.stringify(requestData),
            // Headers vacíos como se especificó
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);
            console.error('Backend error:', errorText);
            return NextResponse.json(
                { error: `Failed to fetch medical records: ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Medical records fetched successfully');

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in medical records API route:', error);
        return NextResponse.json(
            { error: 'Internal server error while fetching medical records' },
            { status: 500 }
        );
    }
}