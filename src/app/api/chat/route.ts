import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.headers.get('x-session-id') || body.session_id || 'sess_default';

    if (!body.text || typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json(
        { error: 'invalid_input', message: 'A legal question or problem statement is required.' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        text: body.text.trim(),
        session_id: sessionId,
        case_id: body.case_id || undefined,
        lang: body.lang || 'en',
      }),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData?.detail?.error || 'backend_error',
          message: errorData?.detail?.message || errorData?.message || `Backend service returned HTTP ${backendRes.status}`,
        },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error proxying legal query to backend:', error);
    return NextResponse.json(
      {
        error: 'backend_offline',
        message: 'Unable to connect to the Legal Saathi legal intelligence backend. Please verify that the FastAPI backend service is running on port 8000.',
      },
      { status: 503 }
    );
  }
}
