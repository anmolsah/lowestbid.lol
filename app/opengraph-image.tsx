import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'lowestbid.lol — The #1 Billboard Leaderboard on the Internet';
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
          backgroundColor: '#FAF9F6',
          padding: '44px 56px',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        {/* Subtle Decorative Background Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '999px',
            backgroundColor: 'rgba(224, 99, 70, 0.06)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '100px',
            width: '360px',
            height: '360px',
            borderRadius: '999px',
            backgroundColor: 'rgba(224, 99, 70, 0.04)',
            display: 'flex',
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Logo & Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#E06346',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: 900,
                marginRight: '14px',
                boxShadow: '0 4px 12px rgba(224, 99, 70, 0.3)',
              }}
            >
              👑
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '-1px',
                color: '#1C1C1C',
              }}
            >
              <span>lowestbid</span>
              <span style={{ color: '#E06346' }}>.lol</span>
            </div>
          </div>

          {/* Right Header Status Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E2D9',
                fontSize: '15px',
                fontWeight: 700,
                color: '#1C1C1C',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#10B981',
                  marginRight: '8px',
                  display: 'flex',
                }}
              />
              <span>Live Billboard</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(224, 99, 70, 0.1)',
                border: '1px solid rgba(224, 99, 70, 0.25)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#E06346',
              }}
            >
              <span>14 Categories</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: '8px',
            marginBottom: '6px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '46px',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#1C1C1C',
              marginBottom: '10px',
            }}
          >
            <span>Claim the </span>
            <span style={{ color: '#E06346', marginLeft: '10px', marginRight: '10px' }}>#1 Spot</span>
            <span>on the Internet</span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              color: '#5C5C5C',
              fontWeight: 500,
              marginBottom: '20px',
            }}
          >
            <span>The viral pay-to-rank leaderboard. Highest bidder takes the throne and drives real clicks.</span>
          </div>

          {/* Quick Bid Search Bar Mock (Exact Site UI) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E2D9',
              borderRadius: '999px',
              padding: '6px 8px 6px 20px',
              width: '680px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#8C8C8C',
                fontSize: '16px',
              }}
            >
              <span>https://yourwebsite.com</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F4F2EC',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1C1C1C',
                }}
              >
                <span style={{ marginRight: '6px' }}>🤖</span>
                <span>AI Agents</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5C5C5C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: '6px' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#E06346',
                  color: '#FFFFFF',
                  padding: '9px 20px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                <span>Claim Spot →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Leaderboard Cards Preview (Actual Cards on Site) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          {/* Card #1 - ThumbGen (Highest Bidder #1) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '2px solid #E06346',
              borderRadius: '16px',
              padding: '14px 22px',
              boxShadow: '0 4px 16px rgba(224, 99, 70, 0.12)',
            }}
          >
            {/* Left: Rank + Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(224, 99, 70, 0.12)',
                  border: '1px solid rgba(224, 99, 70, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginRight: '16px',
                }}
              >
                👑
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1C1C1C',
                    }}
                  >
                    ThumbGen - AI YouTube Thumbnail Generator
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'rgba(224, 99, 70, 0.12)',
                      color: '#E06346',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                    }}
                  >
                    #1 RANK
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#666666',
                    marginTop: '3px',
                  }}
                >
                  <span>🤖 AI Agents</span>
                  <span>•</span>
                  <span style={{ color: '#E06346' }}>thumbgen.online</span>
                  <span>•</span>
                  <span>1 unique click</span>
                </div>
              </div>
            </div>

            {/* Right: Bid + Outbid Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#E06346',
                  }}
                >
                  $3.00
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#8C8C8C',
                  }}
                >
                  Top Bid
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1C1C1C',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                <span>Outbid ⚡</span>
              </div>
            </div>
          </div>

          {/* Card #2 - FirstIssue.dev */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E2D9',
              borderRadius: '16px',
              padding: '14px 22px',
            }}
          >
            {/* Left: Rank + Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#F4F2EC',
                  border: '1px solid #E5E2D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#5C5C5C',
                  marginRight: '16px',
                }}
              >
                #2
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1C1C1C',
                    }}
                  >
                    FirstIssue.dev
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#666666',
                    marginTop: '3px',
                  }}
                >
                  <span>💻 Developer Tools</span>
                  <span>•</span>
                  <span style={{ color: '#E06346' }}>firstissue.dev</span>
                  <span>•</span>
                  <span>33 unique clicks</span>
                </div>
              </div>
            </div>

            {/* Right: Bid + Outbid Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#1C1C1C',
                  }}
                >
                  $1.50
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#8C8C8C',
                  }}
                >
                  Current Bid
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F4F2EC',
                  color: '#1C1C1C',
                  border: '1px solid #E5E2D9',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                <span>Outbid ⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '6px',
            borderTop: '1px solid #EBE7DE',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '14px',
              color: '#5C5C5C',
              fontWeight: 600,
            }}
          >
            <span>👑 Highest Bidder Takes #1</span>
            <span>•</span>
            <span>⚡ Instant Live Updates</span>
            <span>•</span>
            <span>📊 Verified Real Click Tracking</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#8C8C8C',
              fontWeight: 500,
            }}
          >
            <span>Built by </span>
            <span style={{ color: '#E06346', fontWeight: 700, marginLeft: '4px' }}>@anni_i29</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

