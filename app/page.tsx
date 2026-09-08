'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  ExternalLink,
  Flame,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  HelpCircle,
  Clock,
  Swords,
  PlusCircle,
  X,
  Share2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MousePointerClick,
} from 'lucide-react';

interface BidItem {
  id: string;
  amount: number;
  title: string;
  url: string;
  message: string;
  twitter?: string;
  createdAt: string;
  status: 'pending' | 'verified';
  isUnique?: boolean;
  clashCount?: number;
  clicks?: number;
}

interface LeaderboardStats {
  totalVolume: number;
  totalBids: number;
  currentLowestUniqueBid: number | null;
  clashedCount: number;
  highestBid: number | null;
  uniqueBidsCount: number;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'unique' | 'whales' | 'feed'>('unique');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Leaderboard data from server
  const [reigningChampion, setReigningChampion] = useState<BidItem | null>(null);
  const [uniqueBids, setUniqueBids] = useState<BidItem[]>([]);
  const [clashedBids, setClashedBids] = useState<BidItem[]>([]);
  const [highRollers, setHighRollers] = useState<BidItem[]>([]);
  const [recentFeed, setRecentFeed] = useState<BidItem[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalVolume: 0,
    totalBids: 0,
    currentLowestUniqueBid: null,
    clashedCount: 0,
    highestBid: null,
    uniqueBidsCount: 0,
  });
  const [isDodoConfigured, setIsDodoConfigured] = useState(false);

  // Form State
  const [formAmount, setFormAmount] = useState('1.07');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formTwitter, setFormTwitter] = useState('');
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaStatus, setMetaStatus] = useState('');

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/bids');
      const json = await res.json();
      if (json.success && json.data) {
        setReigningChampion(json.data.reigningChampion);
        setUniqueBids(json.data.uniqueBids || []);
        setClashedBids(json.data.clashedBids || []);
        setHighRollers(json.data.highRollers || []);
        setRecentFeed(json.data.recentFeed || []);
        setStats(json.data.stats || {});
        setIsDodoConfigured(json.isDodoConfigured || false);
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000); // Polling every 6s for live feel
    return () => clearInterval(interval);
  }, []);

  // Quick amount chip selector
  const handleQuickChip = (amount: string) => {
    setFormAmount(amount);
  };

  // Track clicks on website links
  const handleTrackClick = (bidId: string) => {
    const updateClicks = (item: BidItem) =>
      item.id === bidId ? { ...item, clicks: (item.clicks || 0) + 1 } : item;

    setReigningChampion((prev) =>
      prev && prev.id === bidId ? { ...prev, clicks: (prev.clicks || 0) + 1 } : prev
    );
    setUniqueBids((prev) => prev.map(updateClicks));
    setClashedBids((prev) => prev.map(updateClicks));
    setHighRollers((prev) => prev.map(updateClicks));
    setRecentFeed((prev) => prev.map(updateClicks));

    try {
      fetch('/api/bid/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId }),
        keepalive: true,
      }).catch((err) => console.error('Error tracking click:', err));
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch website metadata (description & title fallback)
  const handleFetchMeta = async (customUrl?: string) => {
    const raw = (customUrl !== undefined ? customUrl : formUrl).trim();
    if (!raw) return;

    let normalized = raw;
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    try {
      new URL(normalized);
    } catch {
      return;
    }

    setFetchingMeta(true);
    setMetaStatus('Fetching website info...');

    try {
      const res = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      });

      const data = await res.json();
      if (data.success) {
        let filledCount = 0;
        if (data.description) {
          setFormMessage(data.description);
          filledCount++;
        }
        if (data.title && (!formTitle || formTitle.trim().length === 0)) {
          setFormTitle(data.title);
          filledCount++;
        }

        if (filledCount > 0) {
          setMetaStatus('Description auto-filled from site!');
        } else {
          setMetaStatus('No description meta tag found');
        }
      } else {
        setMetaStatus('');
      }
    } catch (err) {
      console.error('Failed to fetch website metadata:', err);
      setMetaStatus('');
    } finally {
      setFetchingMeta(false);
      setTimeout(() => setMetaStatus(''), 4500);
    }
  };

  // Submit Bid & Create Dodo Payments Checkout
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const numericAmount = parseFloat(formAmount);
    if (isNaN(numericAmount) || numericAmount < 1 || numericAmount > 9999999) {
      setErrorMessage('Bid amount must be between $1.00 and $9,999,999.00');
      setSubmitting(false);
      return;
    }

    if (!formTitle.trim()) {
      setErrorMessage('Please enter your project name or handle.');
      setSubmitting(false);
      return;
    }

    if (!formUrl.trim()) {
      setErrorMessage('Please enter your destination URL.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/bid/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          title: formTitle.trim(),
          url: formUrl.trim(),
          message: formMessage.trim(),
          twitter: formTwitter.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      // Redirect directly to Dodo Payments checkout or Sandbox test checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with payment server');
      setSubmitting(false);
    }
  };

  // Format relative time helper
  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="container">
      {/* Top Header */}
      <header className="header-nav">
        <Link href="/" className="brand-logo">
          <div className="brand-icon-box">
            <TrendingDown size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">lowestbid.lol</span>
              <span className="brand-badge">THE ANTI-OUTBID</span>
            </div>
          </div>
        </Link>

        <div className="header-right">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
            <PlusCircle size={16} /> Place a Bid
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-subtitle-badge">
          <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
          Inspired by outbid.lol &bull; The lowest unique bid claims the #1 crown
        </div>

        <h1 className="hero-title">
          The Pay-to-Rank Billboard where <br />
          <span className="text-gradient-gold">Lowest Unique Bid</span> Wins.
        </h1>

        <p className="hero-description">
          Tired of bidding wars where only billionaires win? Bid anywhere from <strong>$1.00</strong> to <strong>$9,999,999</strong>. 
          If your bid is the lowest number that nobody else chose, you seize the #1 spotlight on the internet.
        </p>

        {/* Platform Stats */}
        <div className="stats-bar">
          <div className="stat-box">
            <div className="stat-label">
              <DollarSign size={14} /> Total Volume Paid
            </div>
            <div className="stat-value text-gradient-emerald">
              ${stats.totalVolume ? stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              <Crown size={14} style={{ color: 'var(--accent-gold)' }} /> Current #1 Low Bid
            </div>
            <div className="stat-value text-gradient-gold">
              {stats.currentLowestUniqueBid ? `$${stats.currentLowestUniqueBid.toFixed(2)}` : 'None yet'}
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              <Flame size={14} /> Total Bids Submitted
            </div>
            <div className="stat-value">{stats.totalBids}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              <Swords size={14} style={{ color: 'var(--accent-rose)' }} /> Clashed / Duplicate Bids
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>{stats.clashedCount}</div>
          </div>
        </div>
      </section>

      {/* Reigning Champion Hero Crown Showcase */}
      <section>
        {reigningChampion ? (
          <div className="champion-card">
            <div className="champion-inner">
              <div>
                <div className="champion-crown-tag">
                  <Crown size={15} /> Reigning #1 Champion Spotlight
                </div>

                <div className="champion-title-row">
                  <h2 className="champion-title">{reigningChampion.title}</h2>
                  <a
                    href={reigningChampion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="champion-url-badge"
                    onClick={() => handleTrackClick(reigningChampion.id)}
                  >
                    Visit Link <ExternalLink size={13} />
                  </a>
                  <span className="champion-clicks-badge" title="Total website clicks from visitors">
                    <MousePointerClick size={12} /> {(reigningChampion.clicks || 0).toLocaleString()} {(reigningChampion.clicks || 0) === 1 ? 'click' : 'clicks'}
                  </span>
                  {reigningChampion.twitter && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {reigningChampion.twitter}
                    </span>
                  )}
                </div>

                <p className="champion-message">
                  &ldquo;{reigningChampion.message || 'Holding the lowest unique bid on lowestbid.lol!'}&rdquo;
                </p>

                <div className="champion-meta-row">
                  <span>Joined: {formatTimeAgo(reigningChampion.createdAt)}</span>
                  <span>&bull;</span>
                  <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Verified on Dodo Payments
                  </span>
                </div>
              </div>

              <div className="champion-bid-badge">
                <span className="champion-bid-label">Winning Unique Bid</span>
                <span className="champion-bid-amount">${reigningChampion.amount.toFixed(2)}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Target to under-bid
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="champion-card">
            <div className="champion-inner" style={{ textAlign: 'center', display: 'block', padding: '48px 20px' }}>
              <Crown size={48} style={{ color: 'var(--accent-gold)', margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>The Throne is Open!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Be the first to place a bid of $1.00 or higher and claim the #1 spotlight immediately.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                Claim Crown for $1.00
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <div className="cta-banner">
        <div className="cta-banner-text">
          <h3>Want this spotlight for your product or brand?</h3>
          <p>Submit a unique bid between $1.00 and $9,999,999. Instant exposure via Dodo Payments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
          <PlusCircle size={18} /> Place a Bid ($1 - $9,999,999)
        </button>
      </div>

      {/* Leaderboard Tabs */}
      <section>
        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'unique' ? 'active' : ''}`}
              onClick={() => setActiveTab('unique')}
            >
              <Crown size={16} style={{ color: 'var(--accent-gold)' }} />
              Lowest Unique Bids
              <span className="tab-badge">{uniqueBids.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'whales' ? 'active' : ''}`}
              onClick={() => setActiveTab('whales')}
            >
              <Flame size={16} style={{ color: 'var(--accent-gold)' }} />
              Whales / High Rollers
              <span className="tab-badge">{highRollers.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Clock size={16} style={{ color: '#38bdf8' }} />
              Live Activity Feed
              <span className="tab-badge">{recentFeed.length}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px' }} /> Auto-syncing
          </div>
        </div>

        {/* Tab 1: Lowest Unique Bids */}
        {activeTab === 'unique' && (
          <div className="leaderboard-list">
            {uniqueBids.length === 0 && clashedBids.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No bids yet. Be the first to place a bid!
              </div>
            ) : (
              <>
                {/* Unique Bids List */}
                {uniqueBids.map((bid, index) => {
                  const isTop = index === 0;
                  return (
                    <div
                      key={bid.id}
                      className={`bid-row ${isTop ? 'champion-row' : ''}`}
                    >
                      <div className="bid-rank">
                        {isTop ? <Crown size={22} style={{ color: 'var(--accent-gold)' }} /> : `#${index + 1}`}
                      </div>

                      <div className="bid-content">
                        <div className="bid-content-top">
                          <span className="bid-title">{bid.title}</span>
                          <a
                            href={bid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bid-url"
                            onClick={() => handleTrackClick(bid.id)}
                          >
                            {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={12} />
                          </a>
                          <span className="bid-clicks-badge" title="Total website clicks from visitors">
                            <MousePointerClick size={11} /> {(bid.clicks || 0).toLocaleString()} {(bid.clicks || 0) === 1 ? 'click' : 'clicks'}
                          </span>
                          {bid.twitter && <span className="bid-twitter">{bid.twitter}</span>}
                        </div>
                        {bid.message && <p className="bid-message">{bid.message}</p>}
                      </div>

                      <div className="bid-right">
                        <div className="bid-price">${bid.amount.toFixed(2)}</div>
                        <span className="bid-status-pill pill-unique">
                          {isTop ? '👑 #1 Spot' : 'Unique'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Clashed Bids Section */}
                {clashedBids.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--accent-rose)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '12px'
                    }}>
                      <Swords size={16} /> Clashed Bids (Lost Uniqueness Due to Duplicates)
                    </div>

                    {clashedBids.map((bid) => (
                      <div key={bid.id} className="bid-row clashed" style={{ marginBottom: '8px' }}>
                        <div className="bid-rank" style={{ color: 'var(--accent-rose)' }}>
                          <Swords size={18} />
                        </div>
                        <div className="bid-content">
                          <div className="bid-content-top">
                            <span className="bid-title">{bid.title}</span>
                            <a
                              href={bid.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bid-url"
                              onClick={() => handleTrackClick(bid.id)}
                            >
                              {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={12} />
                            </a>
                            <span className="bid-clicks-badge" title="Total website clicks from visitors">
                              <MousePointerClick size={11} /> {(bid.clicks || 0).toLocaleString()} {(bid.clicks || 0) === 1 ? 'click' : 'clicks'}
                            </span>
                            {bid.twitter && <span className="bid-twitter">{bid.twitter}</span>}
                          </div>
                          {bid.message && <p className="bid-message">{bid.message}</p>}
                        </div>
                        <div className="bid-right">
                          <div className="bid-price" style={{ color: '#fb7185' }}>${bid.amount.toFixed(2)}</div>
                          <span className="bid-status-pill pill-clashed">
                            Duplicate ({bid.clashCount} bids)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 2: Whales & High Rollers */}
        {activeTab === 'whales' && (
          <div className="leaderboard-list">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Honoring the biggest spenders who flex their budget on lowestbid.lol.
            </div>
            {highRollers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No whale bids yet. Place a bid to claim the whale spotlight!
              </div>
            ) : (
              highRollers.map((bid, index) => (
                <div key={bid.id} className="bid-row">
                  <div className="bid-rank">
                    {index === 0 ? '🐋' : `#${index + 1}`}
                  </div>
                  <div className="bid-content">
                    <div className="bid-content-top">
                      <span className="bid-title">{bid.title}</span>
                      <a
                        href={bid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bid-url"
                        onClick={() => handleTrackClick(bid.id)}
                      >
                        {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={12} />
                      </a>
                      <span className="bid-clicks-badge" title="Total website clicks from visitors">
                        <MousePointerClick size={11} /> {(bid.clicks || 0).toLocaleString()} {(bid.clicks || 0) === 1 ? 'click' : 'clicks'}
                      </span>
                      {bid.twitter && <span className="bid-twitter">{bid.twitter}</span>}
                    </div>
                    {bid.message && <p className="bid-message">{bid.message}</p>}
                  </div>
                  <div className="bid-right">
                    <div className="bid-price text-gradient-gold">${bid.amount.toFixed(2)}</div>
                    <span className="bid-status-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                      {bid.amount >= 100 ? 'Whale Flex' : 'Backer'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Live Feed */}
        {activeTab === 'feed' && (
          <div className="leaderboard-list">
            {recentFeed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No live activity yet. Be the first to place a bid!
              </div>
            ) : (
              recentFeed.map((bid) => (
                <div key={bid.id} className="bid-row">
                  <div className="bid-rank">
                    <Clock size={16} />
                  </div>
                  <div className="bid-content">
                    <div className="bid-content-top">
                      <span className="bid-title">{bid.title}</span>
                      <a
                        href={bid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bid-url"
                        onClick={() => handleTrackClick(bid.id)}
                      >
                        {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={12} />
                      </a>
                      <span className="bid-clicks-badge" title="Total website clicks from visitors">
                        <MousePointerClick size={11} /> {(bid.clicks || 0).toLocaleString()} {(bid.clicks || 0) === 1 ? 'click' : 'clicks'}
                      </span>
                    </div>
                    {bid.message && <p className="bid-message">{bid.message}</p>}
                  </div>
                  <div className="bid-right">
                    <div className="bid-price">${bid.amount.toFixed(2)}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formatTimeAgo(bid.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* FAQ / How It Works */}
      <section className="faq-section">
        <h3 className="faq-title">How Does lowestbid.lol Work?</h3>
        <div className="faq-grid">
          <div className="faq-card">
            <h4><Crown size={18} style={{ color: 'var(--accent-gold)' }} /> 1. Submit Your Bid</h4>
            <p>
              Choose any bid amount from <strong>$1.00</strong> up to <strong>$9,999,999</strong>. Enter your product title, destination link, and pitch.
            </p>
          </div>

          <div className="faq-card">
            <h4><Swords size={18} style={{ color: 'var(--accent-rose)' }} /> 2. The Lowest Unique Rule</h4>
            <p>
              If two people bid the exact same price (e.g. two bids of $1.00), both bids <strong>clash</strong>. The throne goes to the <em>lowest unique bid</em>!
            </p>
          </div>

          <div className="faq-card">
            <h4><ShieldCheck size={18} style={{ color: '#10b981' }} /> 3. Powered by Dodo Payments</h4>
            <p>
              Instant, secure payments handled seamlessly via Dodo Payments. Once confirmed, your bid immediately takes its spot on the public leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <strong>lowestbid.lol</strong> &mdash; The anti-outbid pay-to-rank game.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 150ms' }}>
              Terms & Rules
            </Link>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 150ms' }}>
              Privacy Policy
            </Link>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} /> Secured by Dodo Payments
            </span>
            <a
              href="https://twitter.com/intent/tweet?text=Check%20out%20lowestbid.lol%20-%20the%20pay-to-rank%20billboard%20where%20the%20lowest%20unique%20bid%20wins!&url=https://lowestbid.lol"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Share2 size={14} /> Share on X
            </a>
          </div>
        </div>
      </footer>

      {/* Bid Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => !submitting && setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                <Crown size={12} /> Claim The Spotlight
              </span>
              <h3 className="modal-title">Place Your Bid</h3>
              <p className="modal-subtitle">
                Bid between $1.00 and $9,999,999. Powered by Dodo Payments.
              </p>
            </div>

            <form onSubmit={handleBidSubmit}>
              {/* Bid Amount */}
              <div className="form-group">
                <label className="form-label">
                  Bid Amount ($ USD) &mdash; Min $1.00, Max $9,999,999.00
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.00"
                  max="9999999"
                  className="input-text"
                  placeholder="1.07"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  required
                />
                {/* Quick chip amounts */}
                <div className="quick-amount-chips">
                  {['1.00', '1.07', '1.99', '2.50', '4.20', '10.00', '100.00'].map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      className="chip-btn"
                      onClick={() => handleQuickChip(chip)}
                    >
                      ${chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Project */}
              <div className="form-group">
                <label className="form-label">Project / Handle / Name</label>
                <input
                  type="text"
                  maxLength={50}
                  className="input-text"
                  placeholder="e.g. My Cool AI App or @YourHandle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              {/* URL */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Destination URL</label>
                  {fetchingMeta && (
                    <span className="meta-status-text" style={{ color: '#38bdf8' }}>
                      <Loader2 size={12} className="animate-spin" /> Fetching description...
                    </span>
                  )}
                  {!fetchingMeta && metaStatus && (
                    <span className="meta-status-text">
                      <Sparkles size={12} /> {metaStatus}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    className="input-text"
                    style={{ paddingRight: formUrl.trim() ? '105px' : '14px' }}
                    placeholder="https://yourproduct.com"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    onBlur={() => handleFetchMeta()}
                    required
                  />
                  {formUrl.trim() && (
                    <button
                      type="button"
                      className="meta-fetch-btn"
                      onClick={() => handleFetchMeta(formUrl)}
                      disabled={fetchingMeta}
                      title="Auto-fetch description and title from website"
                    >
                      {fetchingMeta ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Auto-fetch
                    </button>
                  )}
                </div>
              </div>

              {/* Pitch Message */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Tagline / Short Pitch (Optional)</label>
                  {formMessage && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formMessage.length}/150
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={150}
                  className="input-text"
                  placeholder="The best tool for devs to ship fast..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                />
              </div>

              {/* Twitter / X Handle */}
              <div className="form-group">
                <label className="form-label">Twitter / X Handle (Optional)</label>
                <input
                  type="text"
                  maxLength={30}
                  className="input-text"
                  placeholder="@yourusername"
                  value={formTwitter}
                  onChange={(e) => setFormTwitter(e.target.value)}
                />
              </div>

              {/* Live Preview */}
              <div className="preview-box">
                <div className="preview-label">Live Card Preview</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                      {formTitle || 'Your Project Name'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'underline', marginTop: '2px' }}>
                      {formUrl || 'https://yourproduct.com'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px' }}>
                      {formMessage || 'Your pitch message will appear here for visitors.'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
                      ${parseFloat(formAmount || '1.00').toFixed(2)}
                    </div>
                    <span className="bid-status-pill pill-unique" style={{ marginTop: '4px', display: 'inline-block' }}>
                      Preview
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  fontSize: '0.85rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <DollarSign size={18} /> Pay ${parseFloat(formAmount || '1.00').toFixed(2)} with Dodo Payments
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                Secured by Dodo Payments &bull; Instant activation upon payment
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
