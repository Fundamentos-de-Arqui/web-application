import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        
        // URL del endpoint backend - usando el endpoint correcto del API Gateway
        const backendUrl = process.env.MEDICAL_RECORDS_ENDPOINT || 'https://soulware.site/api/clinical-folders/medical-records';

        // Build query parameters from the request data - flexible parameter handling
        const params = new URLSearchParams();
        
        // Always include patientId
        if (requestData.patientId) {
            params.append('patientId', requestData.patientId.toString());
        }
        
        // Optional parameters - only add if provided
        if (requestData.versionNumber !== undefined && requestData.versionNumber !== null) {
            params.append('versionNumber', requestData.versionNumber.toString());
        }
        
        if (requestData.orderBy && requestData.orderBy !== 'null') {
            params.append('orderBy', requestData.orderBy);
        }
        
        if (requestData.page !== undefined) {
            params.append('page', requestData.page.toString());
        }
        
        if (requestData.size !== undefined) {
            params.append('size', requestData.size.toString());
        }

        const fullUrl = `${backendUrl}?${params.toString()}`;

        console.log('Proxying medical records request to:', fullUrl);
        console.log('Query parameters:', Object.fromEntries(params));

        // Hacer la petición al backend con GET y query parameters
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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