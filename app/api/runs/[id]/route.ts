import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const run = store.getRun(params.id);
  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  }
  return NextResponse.json(run);
}
