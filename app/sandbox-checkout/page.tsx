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
        maxWidth: '460px',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        boxShadow: 'var(--shadow-elevated)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gold-bg)',
            border: '1px solid var(--accent-gold-border)',
            color: 'var(--accent-gold)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            <Sparkles size={12} /> Sandbox Mode
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-emerald-bg)',
            border: '1px solid var(--accent-emerald-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            color: 'var(--accent-emerald)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', color: 'var(--text-main)' }}>Dodo Payments Checkout</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Simulate a secure one-time payment for your bid on <strong>lowestbid.lol</strong>
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Item</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>lowestbid.lol Spotlight Bid</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Bid ID</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{bidId.slice(0, 16)}...</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '1.05rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--text-main)' }}>Total Amount</span>
            <span style={{ color: 'var(--accent-gold)' }}>${parseFloat(amount).toFixed(2)} USD</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-xs)', background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)', color: 'var(--accent-coral)', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSimulatePayment}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Verifying Payment...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> Complete ${parseFloat(amount).toFixed(2)} Payment
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.4 }}>
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
