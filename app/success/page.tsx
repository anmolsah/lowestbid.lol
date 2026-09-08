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

    // Fetch current leaderboard status
    const fetchLeaderboard = async () => {
      try {
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

    fetchLeaderboard();
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
        maxWidth: '540px',
        width: '100%',
        background: '#11131c',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: isChampion ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${isChampion ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: isChampion ? '#f59e0b' : '#10b981'
        }}>
          {isChampion ? <Crown size={36} /> : <CheckCircle size={36} />}
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: isChampion ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: isChampion ? '#f59e0b' : '#34d399',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          <Sparkles size={13} /> {isChampion ? 'REIGNING CHAMPION #1' : 'BID CONFIRMED & ACTIVE'}
        </span>

        <h1 style={{ fontSize: '2rem', marginBottom: '12px', color: '#fff' }}>
          {isChampion ? 'You Took The Throne!' : 'Your Bid is Live!'}
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.5, marginBottom: '28px' }}>
          {isChampion
            ? 'Congratulations! Your bid is currently the lowest unique bid on lowestbid.lol. Your project is featured in the #1 Hero Crown Spotlight!'
            : 'Your submission is locked in on the public leaderboard. If you have the lowest unique bid, your spotlight is active!'}
        </p>

        {bidDetails && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{bidDetails.title}</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
                ${bidDetails.amount?.toFixed(2)}
              </span>
            </div>
            {bidDetails.message && (
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.4 }}>
                {bidDetails.message}
              </p>
            )}
            <a
              href={bidDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <ExternalLink size={14} /> {bidDetails.url}
            </a>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
            Go to Leaderboard <ArrowRight size={18} />
          </Link>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
          >
            <Share2 size={16} /> Brag on X / Twitter
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
