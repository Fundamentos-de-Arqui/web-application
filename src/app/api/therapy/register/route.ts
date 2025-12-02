import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_THERAPY_PLANS_ENDPOINT || 'http://20.3.3.31:4000/api/therapy-plans';

    try {
        const payload = await request.json();

        console.log('Proxying POST request to backend:', backendUrl, 'with payload:', payload);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            console.error('Backend error on POST:', errorData);
            return NextResponse.json(
                { error: errorData.error || errorData.message || `Failed to create therapy plan: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Therapy plan created successfully by backend:', data);

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Error in therapy-plans API route (proxy):', error);
        return NextResponse.json(
            { error: 'Internal server error while creating therapy plan' },
            { status: 500 }
        );
    }
}