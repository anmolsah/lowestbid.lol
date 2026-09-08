import { NextResponse } from 'next/server';
import { upsertBid, Bid } from '@/lib/db';
import { createCheckout } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, message, twitter, amount } = body;

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 9999999) {
      return NextResponse.json(
        { success: false, error: 'Bid amount must be between $1.00 and $9,999,999.00' },
        { status: 400 }
      );
    }

    const roundedAmount = Math.round(parsedAmount * 100) / 100;
    const amountCents = Math.round(roundedAmount * 100);

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project or handle name is required' },
        { status: 400 }
      );
    }
    const cleanTitle = title.trim().slice(0, 50);

    // Validate URL
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Destination URL is required' },
        { status: 400 }
      );
    }
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    try {
      new URL(formattedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid URL (e.g., https://yourproduct.com)' },
        { status: 400 }
      );
    }

    // Clean pitch message and twitter
    const cleanMessage = (message && typeof message === 'string') ? message.trim().slice(0, 160) : '';
    const cleanTwitter = (twitter && typeof twitter === 'string') ? twitter.trim().slice(0, 30) : undefined;

    // Generate unique Bid ID
    const bidId = `bid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Create Dodo Payments Checkout session with dynamic request host resolution
    const checkout = await createCheckout(
      {
        bidId,
        amount: roundedAmount,
        title: cleanTitle,
        url: formattedUrl,
        message: cleanMessage,
        twitter: cleanTwitter,
      },
      req
    );

    // Save pending bid in database
    const newBid: Bid = {
      id: bidId,
      amount: roundedAmount,
      amountCents,
      title: cleanTitle,
      url: formattedUrl,
      message: cleanMessage,
      twitter: cleanTwitter,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentId: checkout.sessionId,
    };

    upsertBid(newBid);

    return NextResponse.json({
      success: true,
      bidId,
      checkoutUrl: checkout.checkoutUrl,
      sessionId: checkout.sessionId,
      isSandboxSimulation: checkout.isSandboxSimulation,
    });
  } catch (error: any) {
    console.error('Error creating bid checkout:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to initiate checkout' },
      { status: 500 }
    );
  }
}
