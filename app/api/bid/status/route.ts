import { NextRequest, NextResponse } from 'next/server';
import { getAllBidsAsync, verifyBidAsync, getLeaderboardDataAsync } from '@/lib/db';
import { retrieveCheckoutSession } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bidId = searchParams.get('bid_id');

    if (!bidId) {
      return NextResponse.json({ success: false, error: 'bid_id query parameter is required' }, { status: 400 });
    }

    const allBids = await getAllBidsAsync();
    let bid = allBids.find((b) => b.id === bidId);

    // If bid not found yet, check if paymentId matches
    if (!bid) {
      bid = allBids.find((b) => b.paymentId === bidId);
    }

    if (!bid) {
      return NextResponse.json({ success: false, error: 'Bid not found' }, { status: 404 });
    }

    // If pending, query Dodo Payments API directly to verify payment session
    if (bid.status === 'pending' && bid.paymentId && !bid.paymentId.startsWith('sandbox_session_')) {
      try {
        const session = await retrieveCheckoutSession(bid.paymentId);
        if (
          session &&
          (Boolean(session.payment_id) || (session as any).status === 'completed' || (session as any).payment_status === 'succeeded')
        ) {
          const verified = await verifyBidAsync(bid.id);
          if (verified) {
            bid = verified;
          }
        }
      } catch (err) {
        console.error('Error verifying session with Dodo on status check:', err);
      }
    }

    const { reigningChampion } = await getLeaderboardDataAsync();
    const isChampion = reigningChampion ? reigningChampion.id === bid.id : false;

    return NextResponse.json({
      success: true,
      bid,
      isVerified: bid.status === 'verified',
      isChampion,
    });
  } catch (error: any) {
    console.error('Error checking bid status:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
