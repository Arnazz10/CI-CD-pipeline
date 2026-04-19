import { NextRequest, NextResponse } from 'next/server';
import { createInitialRun } from '@/lib/simulation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { branch, environment } = body;

    if (!branch || !environment) {
      return NextResponse.json({ error: 'Missing branch or environment' }, { status: 400 });
    }

    const run = createInitialRun({ branch, environment });
    return NextResponse.json(run);
  } catch (error) {
    console.error('Trigger Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
