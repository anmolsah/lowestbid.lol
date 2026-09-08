import { NextResponse } from 'next/server';
import { incrementBidClicksAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { bidId } = await req.json();

    if (!bidId || typeof bidId !== 'string') {
      return NextResponse.json({ success: false, error: 'bidId is required' }, { status: 400 });
    }

    const clicks = await incrementBidClicksAsync(bidId);

    return NextResponse.json({
      success: true,
      bidId,
      clicks,
    });
  } catch (error: any) {
    console.error('Error tracking bid click:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
