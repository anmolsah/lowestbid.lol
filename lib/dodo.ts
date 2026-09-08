import DodoPayments from 'dodopayments';
import { Webhook } from 'standardwebhooks';

const apiKey = process.env.DODO_PAYMENTS_API_KEY;
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode';
const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
const productId = process.env.DODO_PAYMENTS_PRODUCT_ID;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function isDodoConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 0 && productId && productId.trim().length > 0);
}

export function getDodoClient(): DodoPayments | null {
  if (!apiKey || apiKey.trim().length === 0) {
    return null;
  }
  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

export interface CreateCheckoutParams {
  bidId: string;
  amount: number; // in USD
  title: string;
  url: string;
  message: string;
  twitter?: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  sessionId: string;
  isSandboxSimulation: boolean;
}

export async function createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
  const { bidId, amount, title, url, message, twitter } = params;
  const amountCents = Math.round(amount * 100);

  const client = getDodoClient();

  if (client && productId) {
    try {
      const returnUrl = `${appUrl}/success?bid_id=${encodeURIComponent(bidId)}`;
      
      const session = await client.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
            amount: amountCents, // Dodo Payments accepts dynamic amount in cents for PWYW products
          },
        ],
        return_url: returnUrl,
        metadata: {
          bid_id: bidId,
          title,
          url,
          message,
          twitter: twitter || '',
          amount: amount.toFixed(2),
        },
        customization: {
          theme: 'dark',
        },
      });

      if (session && session.checkout_url) {
        return {
          checkoutUrl: session.checkout_url,
          sessionId: session.session_id,
          isSandboxSimulation: false,
        };
      }
    } catch (err) {
      console.error('Error creating Dodo Payments checkout session, falling back to sandbox mode:', err);
    }
  }

  // Fallback: Sandbox simulation checkout (allows testing everything when API key isn't configured yet)
  const simulationUrl = `${appUrl}/sandbox-checkout?bid_id=${encodeURIComponent(bidId)}&amount=${amount.toFixed(2)}`;
  return {
    checkoutUrl: simulationUrl,
    sessionId: `sandbox_session_${bidId}`,
    isSandboxSimulation: true,
  };
}

export function verifyWebhookEvent(rawBody: string, headers: Record<string, string>): any | null {
  if (!webhookSecret) {
    console.warn('DODO_PAYMENTS_WEBHOOK_KEY is not set. Webhook verification skipped in sandbox.');
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }

  try {
    const wh = new Webhook(webhookSecret);
    return wh.verify(rawBody, headers);
  } catch (err) {
    console.error('Dodo Webhook verification failed:', err);
    return null;
  }
}
