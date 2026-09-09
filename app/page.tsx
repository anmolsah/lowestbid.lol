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
  Sun,
  Moon,
  ArrowRight,
  HelpCircle,
  Globe,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
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
  const [activeTab, setActiveTab] = useState<'unique' | 'clashed' | 'whales' | 'feed'>('unique');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

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

  // Hero Quick Bid Bar state
  const [quickUrl, setQuickUrl] = useState('');
  const [quickAmount, setQuickAmount] = useState('1.50');

  // Modal Form State
  const [formAmount, setFormAmount] = useState('1.50');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formTwitter, setFormTwitter] = useState('');
  const [formFavicon, setFormFavicon] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaStatus, setMetaStatus] = useState('');

  // Sync initial theme (light by default)
  useEffect(() => {
    try {
      const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
      if (current) {
        setTheme(current);
      } else {
        const saved = localStorage.getItem('lowestbid_theme') as 'dark' | 'light';
        const initial = saved || 'light';
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
      }
    } catch {
      // fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('lowestbid_theme', nextTheme);
    } catch {}
  };

  // Fetch leaderboard data
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
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

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

  // Auto-fetch website metadata
  const handleFetchMeta = async (customUrl?: string) => {
    const raw = (customUrl !== undefined ? customUrl : formUrl).trim();
    if (!raw) return;

    // Handle @username input
    if (raw.startsWith('@')) {
      const handle = raw.replace(/^@+/, '');
      setFormTitle((prev) => prev || `@${handle}`);
      setFormTwitter((prev) => prev || `@${handle}`);
      setFormFavicon(`https://unavatar.io/x/${handle}`);
      setFormMessage((prev) => prev || `Check out @${handle} on X!`);
      setMetaStatus('Twitter handle detected');
      setTimeout(() => setMetaStatus(''), 3500);
      return;
    }

    let normalized = raw;
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    try {
      const parsed = new URL(normalized);
      const domainName = parsed.hostname.replace(/^www\./, '');
      if (!formTitle) setFormTitle(domainName);
      if (!formFavicon) setFormFavicon(`https://www.google.com/s2/favicons?domain=${domainName}&sz=64`);
    } catch {
      return;
    }

    setFetchingMeta(true);
    setMetaStatus('Auto-filling info...');

    try {
      const res = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.description) {
          setFormMessage(data.description);
        }
        if (data.title) {
          setFormTitle(data.title);
        }
        if (data.favicon) {
          setFormFavicon(data.favicon);
        }
        if (data.twitter) {
          setFormTwitter(data.twitter);
        }
        if (data.url && raw.startsWith('@')) {
          setFormUrl(data.url);
        }
        setMetaStatus('Details fetched!');
      } else {
        setMetaStatus('');
      }
    } catch (err) {
      console.error('Failed to fetch website metadata:', err);
      setMetaStatus('');
    } finally {
      setFetchingMeta(false);
      setTimeout(() => setMetaStatus(''), 4000);
    }
  };

  // Open modal pre-filled with quick bid values
  const handleOpenModal = (presetAmount?: string, presetUrl?: string) => {
    if (presetAmount) {
      setFormAmount(presetAmount);
      setQuickAmount(presetAmount);
    }
    const targetUrl = presetUrl !== undefined ? presetUrl : quickUrl;
    if (targetUrl) {
      setFormUrl(targetUrl);
      setQuickUrl(targetUrl);
      handleFetchMeta(targetUrl);
    }
    setErrorMessage('');
    setShowCustomize(false);
    setIsModalOpen(true);
  };

  // Hero Quick-Bid Bar submit
  const handleQuickBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenModal(quickAmount, quickUrl);
  };

  // Submit Bid & Create Checkout
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const numericAmount = parseFloat(formAmount);
    const amountCents = Math.round(numericAmount * 100);
    if (isNaN(numericAmount) || numericAmount < 1.5 || numericAmount > 9999999 || amountCents % 150 !== 0) {
      setErrorMessage('Bid amount must be at least $1.50 and an exact multiple of $1.50 (e.g. $1.50, $3.00, $4.50, $6.00)');
      setSubmitting(false);
      return;
    }

    const targetUrl = formUrl.trim();
    if (!targetUrl) {
      setErrorMessage('Please enter your website URL or @handle.');
      setSubmitting(false);
      return;
    }

    // Auto-derive title if left empty by user
    let finalTitle = formTitle.trim();
    if (!finalTitle) {
      if (targetUrl.startsWith('@')) {
        finalTitle = targetUrl;
      } else {
        try {
          const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
          finalTitle = parsed.hostname.replace(/^www\./, '');
        } catch {
          finalTitle = 'Anonymous Bidder';
        }
      }
    }

    try {
      const res = await fetch('/api/bid/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          title: finalTitle,
          url: targetUrl,
          message: formMessage.trim(),
          twitter: formTwitter.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with payment server');
      setSubmitting(false);
    }
  };

  // Time format helper
  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getFaviconUrl = (urlStr: string) => {
    if (!urlStr) return '';
    try {
      const trimmed = urlStr.trim();
      if (trimmed.startsWith('@')) {
        return `https://unavatar.io/x/${trimmed.replace(/^@+/, '')}`;
      }
      const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const parsed = new URL(normalized);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
      return '';
    }
  };

  const quickChips = ['1.50', '3.00', '4.50', '6.00', '7.50', '9.00'];

  return (
    <div className="container">
      {/* Top Header */}
      <header className="nav-header">
        <Link href="/" className="nav-brand">
          <img
            src="/monogram.png"
            alt="lowestbid.lol"
            className="nav-brand-monogram"
            width={32}
            height={32}
          />
          <span className="nav-brand-title">lowestbid.lol</span>
        </Link>

        <div className="nav-right">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <a
            href="#how-it-works"
            className="footer-link"
            style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '4px' }}
          >
            Rules
          </a>

          <button onClick={() => handleOpenModal()} className="btn-nav-primary">
            <PlusCircle size={15} /> Place Bid
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          The Pay-to-Rank Billboard where <br />
          <span className="hero-title-highlight">Lowest Unique Bid</span> Wins.
        </h1>

        <p className="hero-description">
          Outsmart the whales without breaking the piggy bank. Pick your lucky multiple of <strong>$1.50</strong>, dodge the duplicate drama, and claim the internet’s most unhinged <strong>#1 throne</strong>.
        </p>

        {/* Quick Bid Hero Bar (Outbid.lol Style) */}
        <div className="quick-bid-card">
          <form onSubmit={handleQuickBidSubmit} className="quick-bid-form">
            <input
              type="text"
              className="quick-bid-url-input"
              placeholder="Enter your website URL or @handle..."
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              required
            />

            <div className="quick-bid-controls-row">
              <div className="quick-bid-amount-wrap">
                <span className="quick-bid-currency">$</span>
                <input
                  type="number"
                  step="1.50"
                  min="1.50"
                  max="9999999"
                  className="quick-bid-amount-input"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="quick-bid-submit-btn">
                Claim Spot <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Amount Chips */}
        <div className="quick-chips-row">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick bid:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`quick-chip ${quickAmount === chip ? 'active' : ''}`}
              onClick={() => {
                setQuickAmount(chip);
                handleOpenModal(chip, quickUrl);
              }}
            >
              ${chip}
            </button>
          ))}
        </div>
        <p className="quick-chip-hint">
          💡 Tip: Pick uncrowded multiples like $4.50 or $7.50 to dodge duplicate clashes!
        </p>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">
            <Crown size={12} style={{ color: 'var(--accent-gold)' }} /> #1 Low Bid
          </div>
          <div className="stat-val stat-val-gold">
            {stats.currentLowestUniqueBid ? `$${stats.currentLowestUniqueBid.toFixed(2)}` : 'None'}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <DollarSign size={12} /> Total Volume
          </div>
          <div className="stat-val">
            ${stats.totalVolume ? stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <Flame size={12} /> Total Bids
          </div>
          <div className="stat-val">{stats.totalBids}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <Swords size={12} style={{ color: 'var(--accent-coral)' }} /> Clashes
          </div>
          <div className="stat-val stat-val-coral">{stats.clashedCount}</div>
        </div>
      </div>

      {/* #1 Reigning Champion Spotlight Card */}
      {reigningChampion ? (
        <section className="champion-spotlight">
          <div className="champion-glow" />
          <div className="champion-top-tag">
            <Crown size={14} /> Reigning #1 Champion Spotlight
          </div>

          <div className="champion-layout">
            <div className="champion-details">
              <div className="champion-title-row">
                {reigningChampion.url && (
                  <img
                    src={getFaviconUrl(reigningChampion.url)}
                    alt=""
                    className="preview-favicon-img"
                    style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <h2 className="champion-title">{reigningChampion.title}</h2>
                <a
                  href={reigningChampion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="champion-link"
                  onClick={() => handleTrackClick(reigningChampion.id)}
                >
                  {reigningChampion.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <ExternalLink size={12} />
                </a>
                <span className="champion-clicks" title="Total clicks from visitors">
                  <MousePointerClick size={12} /> {(reigningChampion.clicks || 0).toLocaleString()} clicks
                </span>
                {reigningChampion.twitter && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {reigningChampion.twitter}
                  </span>
                )}
              </div>

              <p className="champion-pitch">
                &ldquo;{reigningChampion.message || 'Holding the lowest unique bid on lowestbid.lol!'}&rdquo;
              </p>

              <div className="champion-meta">
                <span>Joined {formatTimeAgo(reigningChampion.createdAt)}</span>
                <span>&bull;</span>
                <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Verified on Dodo Payments
                </span>
              </div>
            </div>

            <div className="champion-bid-col">
              <div className="champion-bid-sub">Winning Unique Bid</div>
              <div className="champion-bid-price">${reigningChampion.amount.toFixed(2)}</div>
              <button
                onClick={() => handleOpenModal((Math.max(1.50, Number((reigningChampion.amount - 1.50).toFixed(2)))).toFixed(2))}
                className="btn-outbid"
              >
                Under-bid Now <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="throne-open-card">
          <Crown size={40} className="throne-open-icon" />
          <h2 className="throne-open-title">The #1 Throne is Open!</h2>
          <p className="throne-open-desc">
            No bids placed yet. Place a bid of $1.50 or higher (in multiples of $1.50) to instantly claim the #1 spotlight on the internet.
          </p>
          <button onClick={() => handleOpenModal('1.50')} className="btn-nav-primary">
            Claim Crown for $1.50
          </button>
        </section>
      )}

      {/* Leaderboard Section */}
      <section className="leaderboard-section">
        <div className="tabs-header">
          <div className="tabs-group">
            <button
              className={`tab-btn ${activeTab === 'unique' ? 'active' : ''}`}
              onClick={() => setActiveTab('unique')}
            >
              <Crown size={15} style={{ color: 'var(--accent-gold)' }} />
              Lowest Unique
              <span className="tab-count">{uniqueBids.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'clashed' ? 'active' : ''}`}
              onClick={() => setActiveTab('clashed')}
            >
              <Swords size={15} style={{ color: 'var(--accent-coral)' }} />
              Clashed Duplicates
              <span className="tab-count">{clashedBids.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'whales' ? 'active' : ''}`}
              onClick={() => setActiveTab('whales')}
            >
              <Flame size={15} style={{ color: 'var(--accent-gold)' }} />
              High Rollers
              <span className="tab-count">{highRollers.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Clock size={15} />
              Live Feed
              <span className="tab-count">{recentFeed.length}</span>
            </button>
          </div>

          <div className="tabs-live-sync">
            Live auto-refresh
          </div>
        </div>

        {/* Tab 1: Lowest Unique Bids */}
        {activeTab === 'unique' && (
          <div className="leaderboard-list">
            {uniqueBids.length === 0 ? (
              <div className="empty-state-box">
                <Crown size={32} className="empty-state-icon" />
                <h3 className="empty-state-title">No Unique Bids Yet</h3>
                <p className="empty-state-desc">
                  Be the first to place an un-clashed bid and take rank #1!
                </p>
                <button onClick={() => handleOpenModal('1.50')} className="btn-nav-primary">
                  Place First Bid ($1.50)
                </button>
              </div>
            ) : (
              uniqueBids.map((bid, index) => {
                const isWinner = index === 0;
                return (
                  <div key={bid.id} className={`bid-card-row ${isWinner ? 'is-winner' : ''}`}>
                    <div className="bid-left-col">
                      <div className={`bid-rank-badge ${isWinner ? 'rank-1' : ''}`}>
                        {isWinner ? <Crown size={16} /> : `#${index + 1}`}
                      </div>

                      <div className="bid-info">
                        <div className="bid-header-line">
                          {bid.url && (
                            <img
                              src={getFaviconUrl(bid.url)}
                              alt=""
                              className="preview-favicon-img"
                              style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span className="bid-title">{bid.title}</span>
                          <a
                            href={bid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bid-domain-link"
                            onClick={() => handleTrackClick(bid.id)}
                          >
                            {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            <ArrowUpRight size={11} />
                          </a>
                          <span className="bid-clicks-tag" title="Total clicks from visitors">
                            <MousePointerClick size={10} /> {(bid.clicks || 0).toLocaleString()}
                          </span>
                          {bid.twitter && <span className="bid-twitter-tag">{bid.twitter}</span>}
                        </div>
                        {bid.message && <p className="bid-pitch-text">{bid.message}</p>}
                      </div>
                    </div>

                    <div className="bid-right-col">
                      <div className="bid-price-wrap">
                        <div className={`bid-price-num ${isWinner ? 'gold' : ''}`}>
                          ${bid.amount.toFixed(2)}
                        </div>
                        <span className={`bid-status-pill ${isWinner ? 'pill-winner' : 'pill-unique'}`}>
                          {isWinner ? '👑 #1 Spot' : 'Unique'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenModal((Math.max(1.50, Number((bid.amount - 1.50).toFixed(2)))).toFixed(2))}
                        className="bid-row-action-btn"
                        title="Bid a lower unique multiple of $1.50"
                      >
                        Under-bid
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Clashed Duplicate Bids */}
        {activeTab === 'clashed' && (
          <div className="leaderboard-list">
            {clashedBids.length === 0 ? (
              <div className="empty-state-box">
                <Swords size={32} className="empty-state-icon" />
                <h3 className="empty-state-title">No Clashed Bids</h3>
                <p className="empty-state-desc">
                  All active bids are currently unique. When two people bid the same dollar amount, both clash and show up here.
                </p>
              </div>
            ) : (
              clashedBids.map((bid) => (
                <div key={bid.id} className="bid-card-row is-clashed">
                  <div className="bid-left-col">
                    <div className="bid-rank-badge rank-clash">
                      <Swords size={16} />
                    </div>

                    <div className="bid-info">
                      <div className="bid-header-line">
                        {bid.url && (
                          <img
                            src={getFaviconUrl(bid.url)}
                            alt=""
                            className="preview-favicon-img"
                            style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="bid-title">{bid.title}</span>
                        <a
                          href={bid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bid-domain-link"
                          onClick={() => handleTrackClick(bid.id)}
                        >
                          {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ArrowUpRight size={11} />
                        </a>
                        <span className="bid-clicks-tag" title="Total clicks from visitors">
                          <MousePointerClick size={10} /> {(bid.clicks || 0).toLocaleString()}
                        </span>
                        {bid.twitter && <span className="bid-twitter-tag">{bid.twitter}</span>}
                      </div>
                      {bid.message && <p className="bid-pitch-text">{bid.message}</p>}
                    </div>
                  </div>

                  <div className="bid-right-col">
                    <div className="bid-price-wrap">
                      <div className="bid-price-num coral">${bid.amount.toFixed(2)}</div>
                      <span className="bid-status-pill pill-clashed">
                        Duplicate ({bid.clashCount} bids)
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenModal((bid.amount + 1.50).toFixed(2))}
                      className="bid-row-action-btn"
                    >
                      Dodge Clash
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Whales & High Rollers */}
        {activeTab === 'whales' && (
          <div className="leaderboard-list">
            {highRollers.length === 0 ? (
              <div className="empty-state-box">
                <Flame size={32} className="empty-state-icon" />
                <h3 className="empty-state-title">No High Rollers Yet</h3>
                <p className="empty-state-desc">
                  Flex your budget on lowestbid.lol by bidding any amount up to $9,999,999.
                </p>
              </div>
            ) : (
              highRollers.map((bid, index) => (
                <div key={bid.id} className="bid-card-row">
                  <div className="bid-left-col">
                    <div className="bid-rank-badge">
                      {index === 0 ? '🐋' : `#${index + 1}`}
                    </div>

                    <div className="bid-info">
                      <div className="bid-header-line">
                        {bid.url && (
                          <img
                            src={getFaviconUrl(bid.url)}
                            alt=""
                            className="preview-favicon-img"
                            style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="bid-title">{bid.title}</span>
                        <a
                          href={bid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bid-domain-link"
                          onClick={() => handleTrackClick(bid.id)}
                        >
                          {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ArrowUpRight size={11} />
                        </a>
                        <span className="bid-clicks-tag" title="Total clicks from visitors">
                          <MousePointerClick size={10} /> {(bid.clicks || 0).toLocaleString()}
                        </span>
                        {bid.twitter && <span className="bid-twitter-tag">{bid.twitter}</span>}
                      </div>
                      {bid.message && <p className="bid-pitch-text">{bid.message}</p>}
                    </div>
                  </div>

                  <div className="bid-right-col">
                    <div className="bid-price-wrap">
                      <div className="bid-price-num gold">${bid.amount.toFixed(2)}</div>
                      <span className="bid-status-pill pill-winner">
                        {bid.amount >= 100 ? 'Whale Flex' : 'Backer'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenModal((bid.amount + 1.50).toFixed(2))}
                      className="bid-row-action-btn"
                    >
                      Out-flex
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Live Activity Feed */}
        {activeTab === 'feed' && (
          <div className="leaderboard-list">
            {recentFeed.length === 0 ? (
              <div className="empty-state-box">
                <Clock size={32} className="empty-state-icon" />
                <h3 className="empty-state-title">No Recent Activity</h3>
                <p className="empty-state-desc">
                  Place a bid to see your activity appear live here.
                </p>
              </div>
            ) : (
              recentFeed.map((bid) => (
                <div key={bid.id} className="bid-card-row">
                  <div className="bid-left-col">
                    <div className="bid-rank-badge">
                      <Clock size={15} />
                    </div>

                    <div className="bid-info">
                      <div className="bid-header-line">
                        {bid.url && (
                          <img
                            src={getFaviconUrl(bid.url)}
                            alt=""
                            className="preview-favicon-img"
                            style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="bid-title">{bid.title}</span>
                        <a
                          href={bid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bid-domain-link"
                          onClick={() => handleTrackClick(bid.id)}
                        >
                          {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ArrowUpRight size={11} />
                        </a>
                        <span className="bid-clicks-tag" title="Total clicks from visitors">
                          <MousePointerClick size={10} /> {(bid.clicks || 0).toLocaleString()}
                        </span>
                      </div>
                      {bid.message && <p className="bid-pitch-text">{bid.message}</p>}
                    </div>
                  </div>

                  <div className="bid-right-col">
                    <div className="bid-price-wrap">
                      <div className="bid-price-num">${bid.amount.toFixed(2)}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatTimeAgo(bid.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <h3 className="how-section-title">How Lowest Unique Bidding Works</h3>
        <div className="how-grid">
          <div className="how-card">
            <div className="how-card-icon" style={{ background: 'var(--accent-gold-bg)', color: 'var(--accent-gold)' }}>
              <Crown size={18} />
            </div>
            <h4>1. Pick Multiples of $1.50</h4>
            <p>
              Enter your website URL, product name, and any bid in multiples of <strong>$1.50</strong> ($1.50, $3.00, $4.50...) up to <strong>$9,999,999</strong>. No account required.
            </p>
          </div>

          <div className="how-card">
            <div className="how-card-icon" style={{ background: 'var(--accent-coral-bg)', color: 'var(--accent-coral)' }}>
              <Swords size={18} />
            </div>
            <h4>2. Avoid Duplicate Clashes</h4>
            <p>
              If two people bid $1.50, both clash and lose uniqueness! The crown goes to the <strong>lowest unique bid</strong>.
            </p>
          </div>

          <div className="how-card">
            <div className="how-card-icon" style={{ background: 'var(--accent-emerald-bg)', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={18} />
            </div>
            <h4>3. Instant Traffic & Clicks</h4>
            <p>
              Payments are verified instantly via Dodo Payments. Your link goes live with real-time visitor click tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div>
          <strong>lowestbid.lol</strong> &mdash; The anti-outbid pay-to-rank game.
        </div>
        <div className="footer-links">
          <Link href="/terms" className="footer-link">Terms & Rules</Link>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <a
            href="https://twitter.com/intent/tweet?text=Check%20out%20lowestbid.lol%20-%20the%20pay-to-rank%20billboard%20where%20the%20lowest%20unique%20bid%20wins!&url=https://lowestbid.lol"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Share2 size={13} /> Share on X
          </a>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
            <ShieldCheck size={14} /> Dodo Payments
          </span>
        </div>
      </footer>

      {/* Floating Action Bar for Mobile */}
      <div className="mobile-sticky-cta">
        <button
          onClick={() => handleOpenModal(quickAmount, quickUrl)}
          className="btn-checkout-primary"
        >
          <PlusCircle size={17} /> Place a Bid (${parseFloat(quickAmount || '1.50').toFixed(2)})
        </button>
      </div>

      {/* Bid Modal - Outbid.lol Style Dead-Simple Onboarding */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => !submitting && setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <span className="modal-badge">
                <Crown size={12} /> Claim Spotlight
              </span>
              <h3 className="modal-title">Place Your Bid</h3>
              <p className="modal-desc">
                Min $1.50 (multiples of $1.50). Lowest unique bid takes the #1 throne. Live immediately with zero sign up.
              </p>
            </div>

            <form onSubmit={handleBidSubmit}>
              {/* Step 1: Destination Link or @handle */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Your Link or @Handle</label>
                  {fetchingMeta && (
                    <span className="meta-fetch-status-badge">
                      <Loader2 size={11} className="animate-spin" /> Auto-filling...
                    </span>
                  )}
                  {!fetchingMeta && metaStatus && (
                    <span className="meta-fetch-status-badge success">
                      <CheckCircle2 size={11} /> {metaStatus}
                    </span>
                  )}
                </div>

                <div className="input-icon-wrap">
                  <Globe size={16} className="input-icon-left" />
                  <input
                    type="text"
                    className="form-input has-left-icon"
                    placeholder="example.com or @yourhandle"
                    value={formUrl}
                    onChange={(e) => {
                      setFormUrl(e.target.value);
                      if (!formTitle && e.target.value.startsWith('@')) {
                        setFormTitle(e.target.value);
                      }
                    }}
                    onBlur={() => handleFetchMeta()}
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Step 2: Bid Amount */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Your Bid Amount ($ USD)</label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Multiples of $1.50 (min $1.50)</span>
                </div>

                <div className="input-icon-wrap">
                  <span className="input-amount-prefix">$</span>
                  <input
                    type="number"
                    step="1.50"
                    min="1.50"
                    max="9999999"
                    className="form-input form-input-amount"
                    placeholder="1.50"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="quick-chips-row" style={{ marginTop: '8px', justifyContent: 'flex-start' }}>
                  {quickChips.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      className={`quick-chip ${formAmount === chip ? 'active' : ''}`}
                      onClick={() => setFormAmount(chip)}
                    >
                      ${chip}
                    </button>
                  ))}
                </div>
                <p className="quick-chip-hint" style={{ marginTop: '6px' }}>
                  💡 Tip: Multiples like $4.50 or $7.50 help dodge duplicate clashes!
                </p>
              </div>

              {/* Live Board Preview Card (Outbid.lol trademark) */}
              <div className="preview-card">
                <div className="preview-tag-row">
                  <span className="preview-tag">Live Board Preview</span>
                  <span className="bid-status-pill pill-unique" style={{ fontSize: '0.65rem' }}>
                    Preview
                  </span>
                </div>

                <div className="preview-content">
                  <div className="preview-main-info">
                    <div className="preview-title-line">
                      {formFavicon ? (
                        <img
                          src={formFavicon}
                          alt=""
                          className="preview-favicon-img"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="preview-favicon-fallback">
                          <Globe size={10} />
                        </div>
                      )}
                      <span className="preview-title-text">
                        {formTitle || (formUrl ? formUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : 'Your Project Name')}
                      </span>
                    </div>

                    <div className="preview-domain-text">
                      {formUrl
                        ? formUrl.startsWith('@')
                          ? `x.com/${formUrl.replace(/^@+/, '')}`
                          : formUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        : 'yourdomain.com'}
                    </div>

                    <div className="preview-desc-text">
                      &ldquo;{formMessage || 'Holding the lowest unique bid on lowestbid.lol!'}&rdquo;
                    </div>
                  </div>

                  <div className="preview-bid-col">
                    <div className="preview-bid-price">
                      ${parseFloat(formAmount || '1.50').toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      Unique Bid
                    </span>
                  </div>
                </div>
              </div>

              {/* Progressive Disclosure - Optional Details */}
              <div className="customize-accordion">
                <button
                  type="button"
                  className="customize-toggle-btn"
                  onClick={() => setShowCustomize(!showCustomize)}
                >
                  <SlidersHorizontal size={13} />
                  {showCustomize ? 'Hide custom details' : '+ Customize title, pitch, or Twitter (optional)'}
                  {showCustomize ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {showCustomize && (
                  <div className="customize-panel">
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>
                        Custom Project Name / Title
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        className="form-input"
                        placeholder="e.g. Acme SaaS"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <div className="form-label-row">
                        <label className="form-label">Short Pitch / Tagline</label>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {formMessage.length}/140
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={140}
                        className="form-input"
                        placeholder="The simplest way to ship products..."
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>
                        Twitter / X Handle
                      </label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-input"
                        placeholder="@username"
                        value={formTwitter}
                        onChange={(e) => setFormTwitter(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--accent-coral-bg)',
                    border: '1px solid var(--accent-coral-border)',
                    color: 'var(--accent-coral)',
                    fontSize: '0.82rem',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <AlertCircle size={15} /> {errorMessage}
                </div>
              )}

              {/* High-Impact Checkout Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-checkout-primary"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Redirecting to Secure Checkout...
                  </>
                ) : (
                  <>
                    <DollarSign size={16} /> Pay ${parseFloat(formAmount || '1.50').toFixed(2)} with Dodo Payments &rarr;
                  </>
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <ShieldCheck size={13} style={{ color: 'var(--accent-emerald)' }} />
                Instant activation &bull; Powered by Dodo Payments &bull; No account needed
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
