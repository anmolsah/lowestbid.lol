'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, ExternalLink, ArrowRight, Share2, CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const bidId = searchParams.get('bid_id') || '';
  const [bidDetails, setBidDetails] = useState<any>(null);
  const [isChampion, setIsChampion] = useState<boolean>(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#ec4899', '#ffffff'],
      });
    } catch (e) {
      console.log('Confetti effect executed');
    }

    // Fetch bid status & auto-verify with Dodo Payments
    const fetchStatus = async () => {
      try {
        if (bidId) {
          const statusRes = await fetch(`/api/bid/status?bid_id=${encodeURIComponent(bidId)}`);
          const statusJson = await statusRes.json();
          if (statusJson.success && statusJson.bid) {
            setBidDetails(statusJson.bid);
            setIsChampion(statusJson.isChampion);
            return;
          }
        }

        // Fallback: Check general leaderboard
        const res = await fetch('/api/bids');
        const json = await res.json();
        if (json.success && json.data) {
          const { reigningChampion, uniqueBids, clashedBids, highRollers } = json.data;
          const all = [...uniqueBids, ...clashedBids, ...highRollers];
          const matched = all.find((b: any) => b.id === bidId);
          if (matched) {
            setBidDetails(matched);
            if (reigningChampion && reigningChampion.id === matched.id) {
              setIsChampion(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch status:', err);
      }
    };

    fetchStatus();
  }, [bidId]);

  const tweetText = encodeURIComponent(
    isChampion
      ? `👑 I just claimed the #1 SPOT on lowestbid.lol with a winning bid of $${bidDetails?.amount ? bidDetails.amount.toFixed(2) : '1.00'}! Can anyone clash me? Check it out:`
      : `🚀 I just submitted my project to lowestbid.lol! Check out the viral pay-to-rank leaderboard:`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent('https://lowestbid.lol')}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        padding: '36px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-elevated)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '280px',
          background: isChampion
            ? 'radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%)'
            : 'radial-gradient(circle, var(--accent-emerald-bg) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-sm)',
          background: isChampion ? 'var(--accent-gold-bg)' : 'var(--accent-emerald-bg)',
          border: `1px solid ${isChampion ? 'var(--accent-gold-border)' : 'var(--accent-emerald-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: isChampion ? 'var(--accent-gold)' : 'var(--accent-emerald)'
        }}>
          {isChampion ? <Crown size={30} /> : <CheckCircle size={30} />}
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: isChampion ? 'var(--accent-gold-bg)' : 'var(--accent-emerald-bg)',
          color: isChampion ? 'var(--accent-gold)' : 'var(--accent-emerald)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          <Sparkles size={13} /> {isChampion ? 'REIGNING CHAMPION #1' : 'BID CONFIRMED & ACTIVE'}
        </span>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--text-main)' }}>
          {isChampion ? 'You Took The Throne!' : 'Your Bid is Live!'}
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
          {isChampion
            ? 'Congratulations! Your bid is currently the lowest unique bid on lowestbid.lol. Your project is featured in the #1 Hero Crown Spotlight!'
            : 'Your submission is locked in on the public leaderboard. If you have the lowest unique bid, your spotlight is active!'}
        </p>

        {bidDetails && (
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{bidDetails.title}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>
                ${bidDetails.amount?.toFixed(2)}
              </span>
            </div>
            {bidDetails.message && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px', lineHeight: 1.4 }}>
                {bidDetails.message}
              </p>
            )}
            <a
              href={bidDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontSize: '0.82rem', textDecoration: 'none' }}
            >
              <ExternalLink size={13} /> {bidDetails.url}
            </a>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/" className="btn-primary">
            Go to Leaderboard <ArrowRight size={16} />
          </Link>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Share2 size={15} /> Brag on X / Twitter
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading status...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
