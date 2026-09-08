import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookEvent } from '@/lib/dodo';
import { verifyBidAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headers: Record<string, string> = {
      'webhook-id': req.headers.get('webhook-id') || '',
      'webhook-signature': req.headers.get('webhook-signature') || '',
      'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
    };

    const event = verifyWebhookEvent(rawBody, headers);

    if (!event) {
      console.error('Invalid Dodo Payments webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    console.log('Received Dodo Payments webhook event:', event.type || event.event_type);

    const eventType = event.type || event.event_type;
    const payload = event.data || event;

    if (
      eventType === 'payment.succeeded' ||
      eventType === 'checkout.session.completed' ||
      eventType === 'payment.successful'
    ) {
      const bidId = payload.metadata?.bid_id || payload.metadata?.bidId;
      const paymentId = payload.payment_id || payload.session_id || payload.id;

      if (bidId) {
        await verifyBidAsync(bidId);
        console.log(`Successfully verified bid from webhook: ${bidId}`);
      } else if (paymentId) {
        await verifyBidAsync(paymentId);
        console.log(`Successfully verified bid by paymentId from webhook: ${paymentId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Dodo Payments webhook:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
