import { NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const count = getVisitorCount();
  return NextResponse.json({ success: true, visitors: count });
}

export async function POST() {
  const count = incrementVisitorCount();
  return NextResponse.json({ success: true, visitors: count });
}
