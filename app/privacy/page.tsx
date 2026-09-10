import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  Lock,
  Eye,
  Database,
  ShieldCheck,
  UserCheck,
  Mail,
  FileText,
  MousePointerClick,
  ExternalLink,
  Crown,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — lowestbid.lol',
  description: 'How lowestbid.lol collects, uses, and safeguards user data, category selections, and payment information via Dodo Payments.',
};

export default function PrivacyPage() {
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
          <Link href="/terms" className="legal-tab-item">
            <FileText size={14} />
            Terms of Service
          </Link>
          <Link href="/privacy" className="legal-tab-item active">
            <Lock size={14} />
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
            <Lock size={14} /> Data & Security
          </div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-last-updated">
            Last updated: September 2026 &bull; Transparent, privacy-first, and lightweight
          </div>
        </div>

        <div className="legal-card">
          {/* Section 1 */}
          <section className="legal-section">
            <h3>
              <Eye size={20} style={{ color: 'var(--accent-primary)' }} /> 1. Information You Provide to Us
            </h3>
            <p>
              When you submit a bid on <strong>lowestbid.lol</strong>, you deliberately submit public advertising information to be displayed on our billboard. This includes:
            </p>
            <ul>
              <li><strong>Project or Brand Name:</strong> The public title of your product or tool.</li>
              <li><strong>Destination URL:</strong> The website or link you wish visitors to visit.</li>
              <li><strong>Category:</strong> The chosen category from our 14 curated categories (e.g. AI Agents, Dev Tools, SaaS).</li>
              <li><strong>Pitch / Tagline:</strong> A short description displayed on your leaderboard card.</li>
              <li><strong>Twitter / X Handle:</strong> An optional handle displayed for maker attribution.</li>
              <li><strong>Bid Amount:</strong> The monetary amount paid, publicly shown on the leaderboard.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="legal-section">
            <h3>
              <ShieldCheck size={20} style={{ color: '#10B981' }} /> 2. Payment & Financial Data Security
            </h3>
            <p>
              All payment transactions on lowestbid.lol are processed securely by <strong>Dodo Payments</strong>, our authorized Merchant of Record.
            </p>
            <div className="legal-highlight-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ShieldCheck size={16} style={{ color: '#10B981' }} />
                <strong>Zero Card Storage</strong>
              </div>
              <div>
                We do NOT collect, process, or store your credit card numbers, debit card numbers, CVV codes, or banking information on lowestbid.lol servers. All financial transactions are handled directly through Dodo Payments&rsquo; PCI-DSS compliant checkout infrastructure.
              </div>
            </div>
            <p>
              Dodo Payments provides us only with non-sensitive transaction confirmation metadata (such as transaction IDs, payment status, and the paid bid amount) so we can activate your entry on the public leaderboard.
            </p>
          </section>

          {/* Section 3 */}
          <section className="legal-section">
            <h3>
              <MousePointerClick size={20} style={{ color: '#3B82F6' }} /> 3. Real Click Tracking & Privacy
            </h3>
            <p>
              To provide authentic traffic stats to makers, we track unique outbound clicks to submitted URLs:
            </p>
            <ul>
              <li>Click tracking counts legitimate unique visits using privacy-preserving session tokens and one-way hashes.</li>
              <li>We do <strong>not</strong> build user tracking profiles, sell click history, or track your browsing activity across other websites.</li>
              <li>Automated bots, scrapers, and malicious scripts are automatically filtered and discarded.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="legal-section">
            <h3>
              <Database size={20} style={{ color: '#8B5CF6' }} /> 4. Technical Logs & Local Storage
            </h3>
            <p>
              When you browse the website, standard technical logs may be generated for operational uptime, fraud detection, and performance:
            </p>
            <ul>
              <li>Standard server request logs (IP addresses and browser user-agent strings) for DDoS mitigation and bot defense.</li>
              <li>Local browser storage keys (e.g., <code>lowestbid_theme</code>) to preserve your visual theme preferences between visits.</li>
            </ul>
            <p>
              We do <strong>NOT</strong> sell, rent, or trade your personal data to third-party data brokers, marketers, or advertisers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="legal-section">
            <h3>
              <UserCheck size={20} style={{ color: '#F59E0B' }} /> 5. How We Use Information
            </h3>
            <p>We use information solely to:</p>
            <ul>
              <li>Display your entry in the public leaderboard rankings, hero spotlight, and category filters.</li>
              <li>Re-rank listings in real time based on active bid amounts.</li>
              <li>Validate payment webhook signatures to prevent unauthorized submissions.</li>
              <li>Ensure compliance with our Terms of Service and Content Policy.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="legal-section">
            <h3>
              <Mail size={20} style={{ color: 'var(--accent-primary)' }} /> 6. Data Updates, Removal & Contact
            </h3>
            <p>
              If you wish to update a destination link, correct your tagline, or request the removal of a listing, please reach out with your transaction ID or domain verification:
            </p>
            <p>
              Email: <strong>privacy@lowestbid.lol</strong>
              <br />
              Founder & Creator:{' '}
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
          <Link href="/terms" className="footer-link">Terms</Link>
          <Link href="/privacy" className="footer-link" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Privacy</Link>
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
