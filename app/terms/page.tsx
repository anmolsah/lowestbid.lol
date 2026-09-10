import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ShieldAlert,
  Crown,
  TrendingUp,
  DollarSign,
  Ban,
  RefreshCw,
  FileText,
  MousePointerClick,
  Layers,
  Sparkles,
  ExternalLink,
  Lightbulb,
  Bot,
  Search,
  Megaphone,
  BarChart3,
  Coins,
  Code2,
  Scale,
  ShieldCheck,
  Heart,
  Share2,
  Trophy,
  Briefcase,
  GraduationCap,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Bidding Rules — lowestbid.lol',
  description: 'Official bidding rules, highest-bid ranking mechanics, category guidelines, payment terms, and content policies for lowestbid.lol.',
};

const OFFICIAL_CATEGORIES = [
  { name: 'AI Agents & Infrastructure', icon: Bot },
  { name: 'SEO & AI Visibility', icon: Search },
  { name: 'Marketing & Advertising', icon: Megaphone },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Crypto, Web3 & Investing', icon: Coins },
  { name: 'Developer Tools', icon: Code2 },
  { name: 'Business, Finance & Legal', icon: Scale },
  { name: 'Security, Privacy & Compliance', icon: ShieldCheck },
  { name: 'Health, Fitness & Wellness', icon: Heart },
  { name: 'Social Media & Creator Tools', icon: Share2 },
  { name: 'Leaderboards & Attention Markets', icon: Trophy },
  { name: 'Hiring, Jobs & Careers', icon: Briefcase },
  { name: 'Education & Learning', icon: GraduationCap },
  { name: 'Agencies, Studios & Services', icon: Building2 },
];

export default function TermsPage() {
  return (
    <div className="legal-page-wrapper">
      {/* Top Navigation Bar */}
      <nav className="legal-nav-bar">
        <Link href="/" className="legal-brand-link">
          <div className="legal-brand-monogram">
            <Crown size={16} strokeWidth={2.5} />
          </div>
          <span>lowestbid<span style={{ color: 'var(--accent-primary)' }}>.lol</span></span>
        </Link>

        <div className="legal-tabs-nav">
          <Link href="/" className="legal-tab-item">
            <ArrowLeft size={14} />
            Leaderboard
          </Link>
          <Link href="/terms" className="legal-tab-item active">
            <FileText size={14} />
            Terms of Service
          </Link>
          <Link href="/privacy" className="legal-tab-item">
            <ShieldAlert size={14} />
            Privacy Policy
          </Link>
        </div>
      </nav>

      <main className="legal-container">
        <Link href="/" className="legal-back-nav">
          <ArrowLeft size={16} /> Back to Live Leaderboard
        </Link>

        <div className="legal-header">
          <div className="legal-badge">
            <Sparkles size={14} /> Official Guidelines & Rules
          </div>
          <h1 className="legal-title">Terms of Service & Game Rules</h1>
          <div className="legal-last-updated">
            Last updated: September 2026 &bull; Effective immediately upon placing a bid
          </div>
        </div>

        <div className="legal-card">
          {/* Section 1 */}
          <section className="legal-section">
            <h3>
              <Crown size={20} style={{ color: 'var(--accent-primary)' }} /> 1. What is lowestbid.lol?
            </h3>
            <p>
              <strong>lowestbid.lol</strong> is a public, competitive pay-to-rank advertising billboard and link leaderboard. 
              Makers, founders, creators, and brands place monetary bids to feature their website, product, or tool in the prestigious 
              <strong>#1 Crown Spotlight</strong> and throughout the public category rankings.
            </p>
            <p>
              By accessing the website, placing a bid, or submitting a URL, you agree to be bound by these Terms of Service and Bidding Rules in full.
            </p>
          </section>

          {/* Section 2 */}
          <section className="legal-section">
            <h3>
              <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} /> 2. Ranking Mechanics: Highest Bidder Takes #1
            </h3>
            <p>
              The billboard ranks entries dynamically in real time based on active monetary bid volume:
            </p>
            <ul>
              <li>
                <strong>The #1 Crown Throne:</strong> The verified entry with the <em>highest dollar amount</em> holds the #1 Crown spot on the billboard, prominently featured at the top of the leaderboard and hero spotlight.
              </li>
              <li>
                <strong>Descending Order of Bids:</strong> All other verified entries are organized sequentially in descending order of their bid amount (e.g., $3.00 is #1, $1.50 is #2, etc.).
              </li>
              <li>
                <strong>Live Outbidding:</strong> Anyone can outbid any position at any time. When an entry is outbid by a higher bid, the new highest bidder instantly ascends to the #1 throne.
              </li>
              <li>
                <strong>One Listing Per Website (Highest Bid Retention):</strong> Each website domain or project is represented by only <em>one active card</em> on the leaderboard—its highest verified bid. If you place a new, higher bid on your website, your existing listing automatically updates and moves up without creating duplicate clutter.
              </li>
            </ul>

            <div className="legal-highlight-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Lightbulb size={16} style={{ color: 'var(--accent-primary)' }} />
                <strong>Pro Tip</strong>
              </div>
              <div>
                Keep an eye on the #1 spot. To dethrone the current leader, simply place a bid higher than their active amount. The throne transfer executes instantaneously.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="legal-section">
            <h3>
              <DollarSign size={20} style={{ color: '#10B981' }} /> 3. Bidding Rules, Increments & Limits
            </h3>
            <p>
              All bids submitted on lowestbid.lol must satisfy the following criteria:
            </p>
            <ul>
              <li>
                <strong>Minimum Bid:</strong> The lowest possible bid on the platform is <strong>$1.50 USD</strong>. Bids below $1.50 are rejected by the checkout engine.
              </li>
              <li>
                <strong>Bid Increments:</strong> Bids are placed in multiples of <strong>$1.50 USD</strong> (e.g., $1.50, $3.00, $4.50, $6.00, $7.50, $9.00, etc.) or through the custom outbid increment selector.
              </li>
              <li>
                <strong>Maximum Bid:</strong> The maximum allowable bid per transaction is <strong>$9,999,999.00 USD</strong>.
              </li>
              <li>
                <strong>Currency:</strong> All bids are processed and billed in United States Dollars ($ USD).
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="legal-section">
            <h3>
              <Layers size={20} style={{ color: '#6366F1' }} /> 4. Category Classification
            </h3>
            <p>
              Every entry is categorized into one of our 14 official categories:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '8px',
                marginTop: '14px',
                marginBottom: '14px',
              }}
            >
              {OFFICIAL_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      fontWeight: 500,
                    }}
                  >
                    <IconComponent size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{cat.name}</span>
                  </div>
                );
              })}
            </div>
            <p>
              Submissions must be assigned to the most relevant category. We reserve the right to reclassify entries to appropriate categories if miscategorized.
            </p>
          </section>

          {/* Section 5 */}
          <section className="legal-section">
            <h3>
              <MousePointerClick size={20} style={{ color: '#3B82F6' }} /> 5. Real Click Tracking & Traffic
            </h3>
            <p>
              lowestbid.lol provides live click tracking on all leaderboard entries:
            </p>
            <ul>
              <li>
                <strong>Unique Clicks:</strong> Every time a real visitor clicks on your listing's outbound link, your click tally increments.
              </li>
              <li>
                <strong>Bot & Fraud Protection:</strong> Automated bot clicks, web crawlers, and artificial rapid clicking are filtered out to ensure authentic referral metrics.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="legal-section">
            <h3>
              <ShieldAlert size={20} style={{ color: '#F59E0B' }} /> 6. Payments, Dodo Payments & Strict No-Refund Policy
            </h3>
            <p>
              Payments are securely processed through <strong>Dodo Payments</strong>, our authorized Merchant of Record.
            </p>
            <ul>
              <li>
                <strong>Instant Digital Fulfillment:</strong> Fulfillment occurs immediately upon payment confirmation by broadcasting your project live to the billboard and leaderboard.
              </li>
              <li>
                <strong>All Sales are Final:</strong> Because public visibility, ranking recalculations, and SEO distribution are instantaneous, <strong>ALL BIDS AND PAYMENTS ARE STRICTLY NON-REFUNDABLE</strong> under any circumstances.
              </li>
              <li>
                <strong>No Chargebacks:</strong> Initiating an unwarranted chargeback or payment dispute will result in permanent blacklisting of your URL, domain, Twitter handle, and IP address.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="legal-section">
            <h3>
              <Ban size={20} style={{ color: '#EF4444' }} /> 7. Content Policy & Prohibited Submissions
            </h3>
            <p>
              You are solely responsible for the links, copy, and images you submit. The following are strictly forbidden:
            </p>
            <ul>
              <li>Phishing, malware, viruses, trojans, ransomware, or deceptive download links.</li>
              <li>Pornography, sexually explicit content, or adult services.</li>
              <li>Hate speech, harassment, defamation, threats, or illegal goods/weapons.</li>
              <li>Fraudulent crypto rug pulls, Ponzi schemes, or deceptive investment scams.</li>
            </ul>
            <p>
              Violating entries will be removed immediately without warning and without refund.
            </p>
          </section>

          {/* Section 8 */}
          <section className="legal-section">
            <h3>
              <RefreshCw size={20} style={{ color: '#8B5CF6' }} /> 8. Disclaimer of Warranties
            </h3>
            <p>
              lowestbid.lol is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no guarantees regarding:
            </p>
            <ul>
              <li>The exact volume of clicks, impressions, or conversions your destination link will generate.</li>
              <li>The duration of time your bid will retain the #1 Crown throne before being outbid by another user.</li>
              <li>100% uninterrupted website uptime.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="legal-section">
            <h3>9. Inquiries & Support</h3>
            <p>
              For support inquiries, domain transfers, or legal notices, contact the lowestbid.lol team:
            </p>
            <p>
              Email: <strong>support@lowestbid.lol</strong>
              <br />
              Twitter / X:{' '}
              <a
                href="https://x.com/anni_i29"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                @anni_i29 <ExternalLink size={12} />
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div><strong>lowestbid.lol</strong> &mdash; The high-stakes pay-to-rank billboard.</div>
        <div className="footer-links" style={{ marginTop: '12px' }}>
          <Link href="/" className="footer-link">Leaderboard</Link>
          <Link href="/terms" className="footer-link" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Terms</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <a href="https://twitter.com/intent/tweet?text=Check%20out%20lowestbid.lol" target="_blank" rel="noopener noreferrer" className="footer-link">
            Share on X
          </a>
        </div>
        <div style={{ marginTop: '16px', fontSize: '0.85rem' }}>
          Built by{' '}
          <a
            href="https://x.com/anni_i29"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{ fontWeight: 600, color: 'var(--text-main)' }}
          >
            @anni_i29
          </a>
        </div>
      </footer>
    </div>
  );
}
