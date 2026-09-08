'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

function SandboxCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bidId = searchParams.get('bid_id') || '';
  const amount = searchParams.get('amount') || '1.00';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bid/verify-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Payment simulation failed');
      }

      router.push(`/success?bid_id=${encodeURIComponent(bidId)}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#11131c',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            <Sparkles size={12} /> Dodo Sandbox Mode
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#10b981'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px', color: '#fff' }}>Dodo Payments Checkout</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Simulate a secure one-time payment for your bid on <strong>lowestbid.lol</strong>
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
            <span>Item</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>lowestbid.lol Spotlight Bid</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
            <span>Bid ID</span>
            <span style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }}>{bidId.slice(0, 16)}...</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '1.1rem', fontWeight: 800 }}>
            <span style={{ color: '#fff' }}>Total Amount</span>
            <span style={{ color: '#f59e0b' }}>${parseFloat(amount).toFixed(2)} USD</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', fontSize: '0.85rem', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSimulatePayment}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Verifying Payment...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} /> Complete ${parseFloat(amount).toFixed(2)} Payment
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '18px', lineHeight: 1.4 }}>
          In production, this redirects to the official hosted Dodo Payments portal. Once you enter your Dodo API keys in <code>.env.local</code>, real card, UPI, and bank checkouts will be processed.
        </p>
      </div>
    </div>
  );
}

export default function SandboxCheckoutPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading checkout...</div>}>
      <SandboxCheckoutContent />
    </Suspense>
  );
}
