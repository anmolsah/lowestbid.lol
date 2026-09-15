import { NextResponse } from 'next/server';
import { getVisitorCountAsync, incrementVisitorCountAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const count = await getVisitorCountAsync();
  return NextResponse.json({ success: true, visitors: count });
}

export async function POST() {
  const count = await incrementVisitorCountAsync();
  return NextResponse.json({ success: true, visitors: count });
}
