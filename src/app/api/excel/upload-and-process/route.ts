import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // URL del endpoint backend
        const backendUrl = process.env.EXCEL_UPLOAD_ENDPOINT || 'http://20.3.3.31:4000/api/excel/upload-and-process';

        // Crear un nuevo FormData para enviar al backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);

        // Hacer la petición al backend desde el servidor (sin restricciones CORS)
        const response = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Error al subir el archivo: ${response.statusText}. ${errorText}` },
                { status: response.status }
            );
        }

        // Si la respuesta es JSON, devolverla; si no, devolver un mensaje de éxito
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ success: true, message: 'Archivo subido exitosamente' });
    } catch (error) {
        console.error('Error in upload proxy:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error desconocido al subir el archivo' },
            { status: 500 }
        );
    }
}

