import DodoPayments from 'dodopayments';
import { Webhook } from 'standardwebhooks';

// Helper to sanitize environment variables (trims whitespace, removes wrapping quotes)
function cleanEnv(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function getDodoConfig() {
  const apiKey = cleanEnv(process.env.DODO_PAYMENTS_API_KEY);
  const environment = (cleanEnv(process.env.DODO_PAYMENTS_ENVIRONMENT) as 'test_mode' | 'live_mode') || 'test_mode';
  const webhookSecret = cleanEnv(process.env.DODO_PAYMENTS_WEBHOOK_KEY);
  const productId = cleanEnv(process.env.DODO_PAYMENTS_PRODUCT_ID);

  return { apiKey, environment, webhookSecret, productId };
}

export function isDodoConfigured(): boolean {
  const { apiKey, productId } = getDodoConfig();
  return Boolean(apiKey && apiKey.length > 0 && productId && productId.length > 0);
}

export function getDodoClient(): DodoPayments | null {
  const { apiKey, environment } = getDodoConfig();
  if (!apiKey || apiKey.length === 0) {
    return null;
  }
  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

// Dynamically resolve base URL to avoid localhost redirects when deployed on Vercel
export function resolveAppUrl(req?: Request): string {
  const envUrl = cleanEnv(process.env.NEXT_PUBLIC_APP_URL);

  // 1. If explicit custom domain set (and not localhost when running on Vercel)
  if (envUrl && (!process.env.VERCEL || !envUrl.includes('localhost'))) {
    return envUrl.replace(/\/$/, '');
  }

  // 2. Derive dynamically from incoming request headers
  if (req) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    if (host) {
      const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      return `${proto}://${host}`.replace(/\/$/, '');
    }
  }

  // 3. Fallback to Vercel system environment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
  }

  return envUrl || 'http://localhost:3000';
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
  error?: string;
}

export async function createCheckout(
  params: CreateCheckoutParams,
  req?: Request
): Promise<CheckoutResult> {
  const { bidId, amount, title, url, message, twitter } = params;
  const amountCents = Math.round(amount * 100);
  const { productId } = getDodoConfig();
  const client = getDodoClient();
  const appUrl = resolveAppUrl(req);

  if (client && productId) {
    try {
      const returnUrl = `${appUrl}/success?bid_id=${encodeURIComponent(bidId)}`;
      
      const session = await client.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
            amount: amountCents, // dynamic amount in cents
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
          theme: 'light',
        },
      });

      if (session && session.checkout_url) {
        return {
          checkoutUrl: session.checkout_url,
          sessionId: session.session_id,
          isSandboxSimulation: false,
        };
      }
    } catch (err: any) {
      console.error('Error creating Dodo Payments checkout session:', {
        message: err?.message,
        status: err?.status,
        body: err?.body || err?.error,
      });
      // Return details if checkout failed
    }
  }

  // Fallback: Sandbox simulation checkout (ensures functional testing)
  const simulationUrl = `${appUrl}/sandbox-checkout?bid_id=${encodeURIComponent(bidId)}&amount=${amount.toFixed(2)}`;
  return {
    checkoutUrl: simulationUrl,
    sessionId: `sandbox_session_${bidId}`,
    isSandboxSimulation: true,
  };
}

// Verify a checkout session directly with Dodo Payments API
export async function retrieveCheckoutSession(sessionId: string) {
  const client = getDodoClient();
  if (!client) return null;
  try {
    return await client.checkoutSessions.retrieve(sessionId);
  } catch (err) {
    console.error(`Failed to retrieve Dodo checkout session ${sessionId}:`, err);
    return null;
  }
}

export function verifyWebhookEvent(rawBody: string, headers: Record<string, string>): any | null {
  const { webhookSecret } = getDodoConfig();

  if (!webhookSecret) {
    console.warn('DODO_PAYMENTS_WEBHOOK_KEY is not set. Parsing webhook body directly.');
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
