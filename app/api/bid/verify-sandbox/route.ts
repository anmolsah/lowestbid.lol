import { NextResponse } from 'next/server';
import { verifyBid, getAllBids } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { bidId } = await req.json();

    if (!bidId) {
      return NextResponse.json({ success: false, error: 'bidId is required' }, { status: 400 });
    }

    const verifiedBid = verifyBid(bidId);
    if (!verifiedBid) {
      return NextResponse.json({ success: false, error: 'Bid not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Bid successfully verified and activated on leaderboard!',
      bid: verifiedBid,
    });
  } catch (error) {
    console.error('Error verifying sandbox bid:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
