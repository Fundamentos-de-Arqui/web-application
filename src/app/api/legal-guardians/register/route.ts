import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        
        // URL del endpoint backend
        const backendUrl = process.env.LEGAL_GUARDIAN_REGISTER_ENDPOINT || 'https://soulware.site/api/register';

        console.log('Proxying legal guardian registration to:', backendUrl);

        // Hacer la petición al backend desde el servidor (sin restricciones CORS)
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Error al registrar responsable legal: ${response.statusText}. ${errorText}` },
                { status: response.status }
            );
        }

        // Si la respuesta es JSON, devolverla; si no, devolver un mensaje de éxito
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ success: true, message: 'Responsable legal registrado exitosamente' });

    } catch (error) {
        console.error('Error in legal guardian registration proxy:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido al registrar responsable legal' },
            { status: 500 }
        );
    }
}