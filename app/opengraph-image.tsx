import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'lowestbid.lol — The Anti-Outbid Leaderboard';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090a0f',
          color: '#ffffff',
          padding: '60px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '2px solid rgba(245, 158, 11, 0.6)',
              fontSize: '32px',
              marginRight: '16px',
            }}
          >
            👑
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '52px',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            <span>lowestbid</span>
            <span style={{ color: '#f59e0b' }}>.lol</span>
          </div>
        </div>

        {/* Tag Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 22px',
            borderRadius: '999px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#f59e0b',
            fontSize: '20px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '28px',
          }}
        >
          <span>The Pay-to-Rank Billboard Game</span>
        </div>

        {/* Main Pitch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '960px',
            color: '#f8fafc',
            marginBottom: '40px',
          }}
        >
          <span>Outsmart the whales without breaking the piggy bank.</span>
        </div>

        {/* Feature Highlights Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#131823',
              borderRadius: '12px',
              border: '1px solid #283347',
              fontSize: '20px',
              color: '#e2e8f0',
              fontWeight: 600,
              marginRight: '16px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✨</span>
            <span>Lowest Unique Bid Wins</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#131823',
              borderRadius: '12px',
              border: '1px solid #283347',
              fontSize: '20px',
              color: '#e2e8f0',
              fontWeight: 600,
              marginRight: '16px',
            }}
          >
            <span style={{ marginRight: '8px' }}>🎯</span>
            <span>Multiples of $1.50</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#131823',
              borderRadius: '12px',
              border: '1px solid #283347',
              fontSize: '20px',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            <span style={{ marginRight: '8px' }}>⚡</span>
            <span>Verified via Dodo</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
