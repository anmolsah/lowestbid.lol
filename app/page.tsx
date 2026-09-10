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
  category?: string;
  createdAt: string;
  status: 'pending' | 'verified';
  isUnique?: boolean;
  clashCount?: number;
  clicks?: number;
}

const CATEGORIES = [
  'All',
  'AI Tools',
  'Developer Tools',
  'Marketing',
  'Design',
  'Productivity',
  'Crypto & Web3',
  'Other',
] as const;

interface LeaderboardStats {
  totalVolume: number;
  totalBids: number;
  currentLowestUniqueBid: number | null;
  clashedCount: number;
  highestBid: number | null;
  uniqueBidsCount: number;
}

// Client-side domain normalizer for unique click tracking
function normalizeDomain(url: string): string {
  if (!url) return '';
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('@')) return trimmed;
  
  const twitterMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-z0-9_]+)(?:\/.*)?$/i);
  if (twitterMatch && twitterMatch[1]) return `@${twitterMatch[1].toLowerCase()}`;

  try {
    const withProto = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProto);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return trimmed.replace(/^(?:https?:\/\/)?(?:www\.)?/, '').replace(/\/+$/, '');
  }
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
  const [quickCategory, setQuickCategory] = useState<string>('AI Tools');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal Form State
  const [formAmount, setFormAmount] = useState('1.50');
  const [formCategory, setFormCategory] = useState<string>('AI Tools');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formTwitter, setFormTwitter] = useState('');
  const [formFavicon, setFormFavicon] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaStatus, setMetaStatus] = useState('');

  // Sync initial theme
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

  // Track clicks with client-side deduplication per website
  const handleTrackClick = (bidId: string, url: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const domainKey = `clicked_${normalizeDomain(url)}`;
    
    // Add UTM source for value to bidders
    const targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (!url.startsWith('@')) {
      targetUrl.searchParams.set('utm_source', 'lowestbid.lol');
      e.currentTarget.href = targetUrl.toString();
    }

    try {
      if (!localStorage.getItem(domainKey)) {
        localStorage.setItem(domainKey, '1');
        
        // Optimistic UI update
        const updateClicks = (item: BidItem) =>
          item.id === bidId ? { ...item, clicks: (item.clicks || 0) + 1 } : item;

        setReigningChampion((prev) =>
          prev && prev.id === bidId ? { ...prev, clicks: (prev.clicks || 0) + 1 } : prev
        );
        setUniqueBids((prev) => prev.map(updateClicks));
        setClashedBids((prev) => prev.map(updateClicks));
        setHighRollers((prev) => prev.map(updateClicks));
        setRecentFeed((prev) => prev.map(updateClicks));

        fetch('/api/bid/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bidId }),
          keepalive: true,
        }).catch((err) => console.error('Error tracking click:', err));
      }
    } catch (err) {
      // Ignore localStorage errors (e.g. private browsing)
    }
  };

  const handleFetchMeta = async (customUrl?: string) => {
    const raw = (customUrl !== undefined ? customUrl : formUrl).trim();
    if (!raw) return;

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
    setMetaStatus('Auto-filling...');

    try {
      const res = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.description) setFormMessage(data.description);
        if (data.title) setFormTitle(data.title);
        if (data.favicon) setFormFavicon(data.favicon);
        if (data.twitter) setFormTwitter(data.twitter);
        if (data.url && raw.startsWith('@')) setFormUrl(data.url);
        setMetaStatus('Details fetched!');
      } else {
        setMetaStatus('');
      }
    } catch (err) {
      setMetaStatus('');
    } finally {
      setFetchingMeta(false);
      setTimeout(() => setMetaStatus(''), 4000);
    }
  };

  const handleOpenModal = (presetAmount?: string, presetUrl?: string, presetCategory?: string) => {
    if (presetAmount) {
      setFormAmount(presetAmount);
      setQuickAmount(presetAmount);
    }
    if (presetCategory) {
      setFormCategory(presetCategory);
    } else if (quickCategory) {
      setFormCategory(quickCategory);
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

  const handleQuickBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenModal(quickAmount, quickUrl, quickCategory);
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const numericAmount = parseFloat(formAmount);
    const amountCents = Math.round(numericAmount * 100);
    if (isNaN(numericAmount) || numericAmount < 1.5 || numericAmount > 9999999 || amountCents % 150 !== 0) {
      setErrorMessage('Bid must be a multiple of $1.50 (e.g. $1.50, $3.00, $4.50)');
      setSubmitting(false);
      return;
    }

    const targetUrl = formUrl.trim();
    if (!targetUrl) {
      setErrorMessage('Please enter your website URL or @handle.');
      setSubmitting(false);
      return;
    }

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
          category: formCategory,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to initialize checkout');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with payment server');
      setSubmitting(false);
    }
  };

  const getFaviconUrl = (urlStr: string) => {
    if (!urlStr) return '';
    try {
      const trimmed = urlStr.trim();
      if (trimmed.startsWith('@')) return `https://unavatar.io/x/${trimmed.replace(/^@+/, '')}`;
      const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const parsed = new URL(normalized);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
      return '';
    }
  };

  const quickChips = ['1.50', '3.00', '4.50', '6.00', '7.50'];

  return (
    <main className="container">
      {/* Header */}
      <header className="nav-header">
        <Link href="/" className="nav-brand">
          <img src="/monogram.png" alt="lowestbid" className="nav-brand-monogram" width={36} height={36} />
          <span className="nav-brand-title">lowestbid.lol</span>
        </Link>
        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Claim the <span className="hero-title-highlight">#1 Spot</span> on the Internet
        </h1>
        <p className="hero-description">
          The public billboard where the <strong>highest bid</strong> claims the spotlight. Outbid the leader to claim the #1 rank.
        </p>

        <div className="quick-bid-card">
          <form onSubmit={handleQuickBidSubmit} className="quick-bid-form">
            <input
              id="quick-bid-url"
              type="text"
              className="quick-bid-url-input"
              placeholder="Your website URL or @handle..."
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              required
            />
            <select
              className="quick-bid-category-select"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button type="submit" className="quick-bid-submit-btn">
              Claim Spot <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">Top Bid</div>
          <div className="stat-val stat-val-coral">
            ${stats.highestBid ? stats.highestBid.toFixed(2) : (reigningChampion ? reigningChampion.amount.toFixed(2) : (uniqueBids[0]?.amount?.toFixed(2) || '1.50'))}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Total Volume</div>
          <div className="stat-val">
            ${stats.totalVolume ? stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Active Spots</div>
          <div className="stat-val">{stats.uniqueBidsCount}</div>
        </div>
      </div>

      {/* Leaderboard */}
      <section className="leaderboard-section">
        <div className="tabs-header">
          <div className="tabs-group">
            <button className={`tab-btn ${activeTab === 'unique' ? 'active' : ''}`} onClick={() => setActiveTab('unique')}>
              <Crown size={16} />
              Leaderboard
              <span className="tab-count">{uniqueBids.length}</span>
            </button>
            <button className={`tab-btn ${activeTab === 'clashed' ? 'active' : ''}`} onClick={() => setActiveTab('clashed')}>
              <Swords size={16} />
              Duplicates
              <span className="tab-count">{clashedBids.length}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar (like outbid.lol) */}
        <div className="category-filter-wrap">
          <div className="category-pills-bar">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? uniqueBids.length
                  : uniqueBids.filter((b) => (b.category || 'Other') === cat).length;
              return (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                  <span style={{ opacity: 0.7, fontSize: '0.78rem' }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab: Leaderboard */}
        {activeTab === 'unique' && (
          <div className="leaderboard-list">
            {(() => {
              const filteredList =
                selectedCategory === 'All'
                  ? uniqueBids
                  : uniqueBids.filter((b) => (b.category || 'Other') === selectedCategory);

              if (filteredList.length === 0) {
                return (
                  <div className="empty-state-box">
                    <Crown size={40} className="empty-state-icon" />
                    <h3 className="empty-state-title">No Listings in {selectedCategory}</h3>
                    <p className="empty-state-desc">Be the first to claim #1 in {selectedCategory}!</p>
                    <button
                      onClick={() => handleOpenModal('1.50', undefined, selectedCategory !== 'All' ? selectedCategory : 'AI Tools')}
                      className="btn-nav-primary"
                    >
                      Claim Spot for $1.50
                    </button>
                  </div>
                );
              }

              return filteredList.map((bid, index) => {
                const isWinner = index === 0 && selectedCategory === 'All';
                const nextOutbidAmount = (bid.amount + 1.50).toFixed(2);
                return (
                  <div key={bid.id} className={`bid-card-row ${isWinner ? 'is-winner' : ''}`}>
                    <div className="bid-left-col">
                      <div className={`bid-rank-badge ${isWinner ? 'rank-1' : ''}`}>
                        {isWinner ? '👑' : `#${index + 1}`}
                      </div>
                      <div className="bid-info">
                        <div className="bid-header-line">
                          {bid.url && (
                            <img
                              src={getFaviconUrl(bid.url)}
                              alt=""
                              className="preview-favicon-img"
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
                            onClick={(e) => handleTrackClick(bid.id, bid.url, e)}
                          >
                            {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            <ArrowUpRight size={12} />
                          </a>
                          {bid.category && (
                            <span className="bid-category-badge">{bid.category}</span>
                          )}
                          <span className="bid-clicks-tag">
                            <MousePointerClick size={12} /> {(bid.clicks || 0).toLocaleString()}
                          </span>
                        </div>
                        {bid.message && <p className="bid-pitch-text">{bid.message}</p>}
                      </div>
                    </div>
                    <div className="bid-right-col">
                      <div className={`bid-price-num ${isWinner ? 'gold' : ''}`}>
                        ${bid.amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleOpenModal(nextOutbidAmount, undefined, bid.category)}
                        className="bid-row-action-btn"
                        title={`Outbid with $${nextOutbidAmount}`}
                      >
                        Outbid
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Tab: Clashed Duplicates */}
        {activeTab === 'clashed' && (
          <div className="leaderboard-list">
            {clashedBids.length === 0 ? (
              <div className="empty-state-box">
                <Swords size={40} className="empty-state-icon" />
                <h3 className="empty-state-title">No Duplicates</h3>
                <p className="empty-state-desc">All bids are unique. Clashed bids appear here.</p>
              </div>
            ) : (
              clashedBids.map((bid) => (
                <div key={bid.id} className="bid-card-row is-clashed">
                  <div className="bid-left-col">
                    <div className="bid-rank-badge"><Swords size={20} /></div>
                    <div className="bid-info">
                      <div className="bid-header-line">
                        {bid.url && <img src={getFaviconUrl(bid.url)} alt="" className="preview-favicon-img" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />}
                        <span className="bid-title">{bid.title}</span>
                        <a
                          href={bid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bid-domain-link"
                          onClick={(e) => handleTrackClick(bid.id, bid.url, e)}
                        >
                          {bid.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={12} />
                        </a>
                      </div>
                      <span className="bid-status-pill pill-clashed">Duplicate ({bid.clashCount} bids)</span>
                    </div>
                  </div>
                  <div className="bid-right-col">
                    <div className="bid-price-num coral">${bid.amount.toFixed(2)}</div>
                    <button onClick={() => handleOpenModal((bid.amount + 1.50).toFixed(2))} className="bid-row-action-btn">
                      Dodge Clash
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Rules Section */}
      <section className="how-section">
        <h3 className="how-section-title">How It Works</h3>
        <div className="how-steps-container">
          <div className="how-step">
            <div className="how-step-num">1</div>
            <div className="how-step-content">
              <h4>Highest Bid Claims #1</h4>
              <p>Place your bid in multiples of $1.50. The highest active bid holds the #1 crown on the billboard.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="how-step-num">2</div>
            <div className="how-step-content">
              <h4>Targeted Categories</h4>
              <p>Categorize your website or product to get discovered by visitors browsing specific niche categories.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="how-step-num">3</div>
            <div className="how-step-content">
              <h4>Instant Live Traffic</h4>
              <p>Checkout securely with Dodo Payments. Your link goes live immediately with real-time unique click tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div><strong>lowestbid.lol</strong> &mdash; The minimalist pay-to-rank board.</div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px', fontSize: '0.85rem' }}>
          <span>Total Products Added: <strong>{uniqueBids.length + clashedBids.length}</strong></span>
          <span>&bull;</span>
          <span>Total Revenue: <strong>${stats.totalVolume ? stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</strong></span>
        </div>

        <div className="footer-links" style={{ marginTop: '12px' }}>
          <Link href="/terms" className="footer-link">Terms</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <a href="https://twitter.com/intent/tweet?text=Check%20out%20lowestbid.lol" target="_blank" rel="noopener noreferrer" className="footer-link">
            Share on X
          </a>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.85rem' }}>
          Built by <a href="https://x.com/anni_i29" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontWeight: 600, color: 'var(--text-main)' }}>@anni_i29</a>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => !submitting && setIsModalOpen(false)}>
              <X size={18} />
            </button>
            <div className="modal-header">
              <h3 className="modal-title">Checkout</h3>
              <p className="modal-desc">Secure your spot on the leaderboard instantly.</p>
            </div>
            <form onSubmit={handleBidSubmit}>
              <div className="form-group">
                <label className="form-label">Link or @handle</label>
                <div className="input-icon-wrap">
                  <Globe size={16} className="input-icon-left" />
                  <input
                    type="text"
                    className="form-input has-left-icon"
                    placeholder="example.com"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    onBlur={() => handleFetchMeta()}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bid Amount</label>
                <div className="input-icon-wrap">
                  <span className="input-amount-prefix">$</span>
                  <input
                    type="number"
                    step="1.50"
                    min="1.50"
                    className="form-input form-input-amount"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="quick-chips-row">
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
              </div>

              <div className="customize-accordion">
                <button type="button" className="customize-toggle-btn" onClick={() => setShowCustomize(!showCustomize)}>
                  <span>{showCustomize ? 'Hide custom details' : 'Add custom title & pitch'}</span>
                  {showCustomize ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showCustomize && (
                  <div className="customize-panel">
                    <div className="form-group">
                      <label className="form-label">Project Name</label>
                      <input type="text" className="form-input" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Pitch / Tagline</label>
                      <input type="text" className="form-input" value={formMessage} onChange={(e) => setFormMessage(e.target.value)} maxLength={140} />
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-checkout-primary">
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <>Pay ${parseFloat(formAmount || '1.50').toFixed(2)} with Dodo <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
