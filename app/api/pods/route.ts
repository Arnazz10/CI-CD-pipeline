import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const environment = searchParams.get('environment');

  if (!environment) {
    return NextResponse.json({ error: 'Missing environment parameter' }, { status: 400 });
  }

  const env = store.getEnvironment(environment);
  if (!env) {
    return NextResponse.json({ error: 'Environment not found' }, { status: 404 });
  }

  return NextResponse.json(env.pods);
}
