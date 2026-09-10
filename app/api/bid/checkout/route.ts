import { NextResponse } from 'next/server';
import { upsertBidAsync, Bid } from '@/lib/db';
import { createCheckout } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, message, twitter, amount, category } = body;
    const allowedCategories = [
      'AI Agents & Infrastructure',
      'SEO & AI Visibility',
      'Marketing & Advertising',
      'Analytics',
      'Crypto, Web3 & Investing',
      'Developer Tools',
      'Business, Finance & Legal',
      'Security, Privacy & Compliance',
      'Health, Fitness & Wellness',
      'Social Media & Creator Tools',
      'Leaderboards & Attention Markets',
      'Hiring, Jobs & Careers',
      'Education & Learning',
      'Agencies, Studios & Services',
      'Other',
    ];
    const cleanCategory = (typeof category === 'string' && allowedCategories.includes(category.trim())) ? category.trim() : 'AI Agents & Infrastructure';

    // Validate amount (must be in multiples of $1.50)
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1.5 || parsedAmount > 9999999) {
      return NextResponse.json(
        { success: false, error: 'Bid amount must be at least $1.50 and a multiple of $1.50' },
        { status: 400 }
      );
    }

    const roundedAmount = Math.round(parsedAmount * 100) / 100;
    const amountCents = Math.round(roundedAmount * 100);

    // Enforce multiple of $1.50 (150 cents)
    if (amountCents % 150 !== 0) {
      return NextResponse.json(
        { success: false, error: 'Bid amount must be a multiple of $1.50 (e.g., $1.50, $3.00, $4.50, $6.00, $7.50)' },
        { status: 400 }
      );
    }

    // Validate and format URL or @handle
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Destination URL or @handle is required' },
        { status: 400 }
      );
    }

    let rawUrl = url.trim();
    let isTwitterHandle = false;
    let twitterHandle = (twitter && typeof twitter === 'string') ? twitter.trim().slice(0, 30) : undefined;

    // Handle @username input directly
    if (rawUrl.startsWith('@')) {
      const handle = rawUrl.replace(/^@+/, '');
      rawUrl = `https://x.com/${handle}`;
      isTwitterHandle = true;
      if (!twitterHandle) twitterHandle = `@${handle}`;
    }

    let formattedUrl = rawUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid URL (e.g., https://yourproduct.com or @handle)' },
        { status: 400 }
      );
    }

    // Derive title from URL or handle if omitted
    let cleanTitle = (title && typeof title === 'string') ? title.trim().slice(0, 50) : '';
    if (!cleanTitle) {
      if (isTwitterHandle && twitterHandle) {
        cleanTitle = twitterHandle;
      } else {
        try {
          const parsed = new URL(formattedUrl);
          cleanTitle = parsed.hostname.replace(/^www\./, '');
        } catch {
          cleanTitle = 'Anonymous Bidder';
        }
      }
    }

    // Clean pitch message and twitter
    const cleanMessage = (message && typeof message === 'string') ? message.trim().slice(0, 160) : '';
    const cleanTwitter = twitterHandle;

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
      category: cleanCategory,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentId: checkout.sessionId,
    };

    await upsertBidAsync(newBid);

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
