import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const runs = store.getAllRuns();
  return NextResponse.json(runs);
}
