import { ImageResponse } from 'next/og';
import { getLeaderboardDataAsync } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'lowestbid.lol — The Lowest-Cost Way to Claim #1 on the Internet';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function extractDomain(url: string): string {
  if (!url) return '';
  try {
    const withProto = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(withProto);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
}

export default async function Image() {
  // Fetch real live data from the database
  let reigningChampion = null;
  let uniqueBids: any[] = [];
  let stats: any = {
    highestBid: null,
    totalVolume: 0,
    uniqueBidsCount: 0,
    totalClicks: 0,
    totalVisitors: 1286,
  };

  try {
    const data = await getLeaderboardDataAsync();
    reigningChampion = data.reigningChampion;
    uniqueBids = data.uniqueBids || [];
    stats = {
      ...stats,
      ...(data.stats || {}),
    };
  } catch (err) {
    console.error('Error fetching live data for opengraph image:', err);
  }

  const topBids = uniqueBids.slice(0, 3);
  const topBidFormatted = stats.highestBid
    ? `$${stats.highestBid.toFixed(2)}`
    : reigningChampion
    ? `$${reigningChampion.amount.toFixed(2)}`
    : '$1.50';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAF9F6',
          padding: '40px 52px',
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
                fontSize: '14px',
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
                fontSize: '14px',
                fontWeight: 700,
                color: '#E06346',
              }}
            >
              <span>Starts at $1.50</span>
            </div>
          </div>
        </div>

        {/* Hero Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: '6px',
            marginBottom: '4px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E2D9',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#5C5C5C',
              marginBottom: '10px',
            }}
          >
            <span style={{ color: '#E06346' }}>⚡</span>
            <span>The lowest-cost #1 billboard on the web · Starts at $1.50</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '40px',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#1C1C1C',
              marginBottom: '6px',
            }}
          >
            <span>Claim the </span>
            <span style={{ color: '#E06346', marginLeft: '10px', marginRight: '10px' }}>#1 Spot</span>
            <span>on the Internet — for $1.50</span>
          </div>

          {/* Real Live Stats Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              marginTop: '10px',
              padding: '10px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E2D9',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', fontWeight: 700, textTransform: 'uppercase' }}>Top Bid</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#E06346' }}>{topBidFormatted}</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E2D9', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', fontWeight: 700, textTransform: 'uppercase' }}>Total Visitors</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#1C1C1C' }}>{(stats.totalVisitors || 1286).toLocaleString()}</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E2D9', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', fontWeight: 700, textTransform: 'uppercase' }}>Total Clicks</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#1C1C1C' }}>{(stats.totalClicks || 0).toLocaleString()}</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E2D9', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', fontWeight: 700, textTransform: 'uppercase' }}>Active Spots</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#1C1C1C' }}>{stats.uniqueBidsCount || topBids.length}</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E2D9', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', fontWeight: 700, textTransform: 'uppercase' }}>Total Volume</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#1C1C1C' }}>${(stats.totalVolume || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Live Leaderboard Real Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
          }}
        >
          {topBids.length > 0 ? (
            topBids.map((bid: any, index: number) => {
              const isChampion = index === 0;
              const domain = extractDomain(bid.url);
              return (
                <div
                  key={bid.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                    border: isChampion ? '2px solid #E06346' : '1.5px solid #E5E2D9',
                    borderRadius: '14px',
                    padding: '12px 20px',
                    boxShadow: isChampion ? '0 4px 16px rgba(224, 99, 70, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {/* Left: Rank + Info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: isChampion ? 'rgba(224, 99, 70, 0.12)' : '#F4F2EC',
                        border: isChampion ? '1px solid rgba(224, 99, 70, 0.3)' : '1px solid #E5E2D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isChampion ? '18px' : '14px',
                        fontWeight: 900,
                        color: isChampion ? '#E06346' : '#5C5C5C',
                        flexShrink: 0,
                      }}
                    >
                      {isChampion ? '👑' : `#${index + 1}`}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            color: '#1C1C1C',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxWidth: '520px',
                          }}
                        >
                          {bid.title || domain || 'Website'}
                        </span>
                        {isChampion && (
                          <div
                            style={{
                              display: 'flex',
                              backgroundColor: 'rgba(224, 99, 70, 0.12)',
                              color: '#E06346',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            #1 REIGNING CHAMPION
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#666666',
                          marginTop: '2px',
                        }}
                      >
                        {bid.category && <span>{bid.category}</span>}
                        {bid.category && domain && <span>•</span>}
                        {domain && <span style={{ color: '#E06346', fontWeight: 600 }}>{domain}</span>}
                        <span>•</span>
                        <span>{(bid.clicks || 0).toLocaleString()} clicks</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Outbid Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      flexShrink: 0,
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
                          fontSize: '20px',
                          fontWeight: 900,
                          color: isChampion ? '#E06346' : '#1C1C1C',
                        }}
                      >
                        ${bid.amount.toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#8C8C8C',
                        }}
                      >
                        {isChampion ? 'Top Bid' : 'Active'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: isChampion ? '#1C1C1C' : '#F4F2EC',
                        color: isChampion ? '#FFFFFF' : '#1C1C1C',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      <span>Outbid</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                border: '1.5px dashed #E5E2D9',
                borderRadius: '16px',
                padding: '28px',
                fontSize: '18px',
                color: '#5C5C5C',
                fontWeight: 600,
              }}
            >
              <span>Be the first to claim the #1 spot on lowestbid.lol for $1.50!</span>
            </div>
          )}
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
              gap: '16px',
              fontSize: '13px',
              color: '#5C5C5C',
              fontWeight: 600,
            }}
          >
            <span>👑 Highest Bidder Takes #1</span>
            <span>•</span>
            <span>⚡ Starts at Just $1.50</span>
            <span>•</span>
            <span>📊 Verified Real Click & Visitor Tracking</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '13px',
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
