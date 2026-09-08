import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Lock, Eye, Database, ShieldCheck, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — lowestbid.lol',
  description: 'How lowestbid.lol collects, uses, and safeguards user data and payment information via Dodo Payments.',
};

export default function PrivacyPage() {
  return (
    <div className="legal-container">
      <Link href="/" className="legal-back-nav">
        <ArrowLeft size={16} /> Back to Live Leaderboard
      </Link>

      <div className="legal-header">
        <div className="legal-badge">
          <Lock size={14} /> Data & Security
        </div>
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="legal-last-updated">
          Last updated: September 2026 &bull; Transparent and privacy-conscious
        </div>
      </div>

      <div className="legal-card">
        {/* Section 1 */}
        <div className="legal-section">
          <h3>
            <Eye size={18} style={{ color: '#38bdf8' }} /> 1. Information You Provide to Us
          </h3>
          <p>
            When you place a bid on <strong>lowestbid.lol</strong>, you intentionally submit information for public display on the internet. This includes:
          </p>
          <ul>
            <li><strong>Project or Brand Name:</strong> The public title or persona for your entry.</li>
            <li><strong>Destination URL:</strong> The website, social profile, or product link you want visitors to click.</li>
            <li><strong>Pitch / Tagline:</strong> A short message or description displayed alongside your entry.</li>
            <li><strong>Twitter / X Handle:</strong> An optional handle displayed for attribution.</li>
            <li><strong>Bid Amount:</strong> The monetary amount paid, which is publicly recorded on the leaderboard.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="legal-section">
          <h3>
            <ShieldCheck size={18} style={{ color: '#10b981' }} /> 2. Payment & Financial Data Security
          </h3>
          <p>
            All payment transactions on lowestbid.lol are securely processed by <strong>Dodo Payments</strong>, our authorized Merchant of Record.
          </p>
          <div className="legal-highlight-box">
            <strong>Zero Card Storage:</strong> We do NOT collect, process, or store your credit card numbers, debit card numbers, CVV codes, or banking credentials on lowestbid.lol servers. All payment transactions are handled directly through Dodo Payments&rsquo; PCI-DSS compliant checkout infrastructure.
          </div>
          <p>
            Dodo Payments provides us with non-sensitive transaction confirmation metadata (such as transaction IDs, payment status, and the paid bid amount) so we can activate your entry on the public leaderboard.
          </p>
        </div>

        {/* Section 3 */}
        <div className="legal-section">
          <h3>
            <Database size={18} style={{ color: 'var(--accent-purple)' }} /> 3. Technical & Usage Information
          </h3>
          <p>
            When you browse or interact with the website, our servers automatically log standard technical data for operational security and fraud prevention:
          </p>
          <ul>
            <li>IP addresses and browser user-agent strings (to prevent automated bot spam and DDoS attacks).</li>
            <li>Timestamp of requests and referral sources.</li>
            <li>Transient local storage keys for interface preferences.</li>
          </ul>
          <p>
            We do NOT sell, rent, or monetize your personal data to third-party data brokers or advertising networks.
          </p>
        </div>

        {/* Section 4 */}
        <div className="legal-section">
          <h3>
            <UserCheck size={18} style={{ color: 'var(--accent-gold)' }} /> 4. How We Use Your Information
          </h3>
          <p>We use the collected information strictly for:</p>
          <ul>
            <li>Displaying your entry on the public rankings, Hero Crown Spotlight, and live activity ticker.</li>
            <li>Calculating game mechanics (detecting uniqueness, identifying duplicate bid clashes, and ranking high rollers).</li>
            <li>Validating payment webhook signatures to prevent unauthorized or counterfeit submissions.</li>
            <li>Complying with applicable legal obligations and enforcing our Terms of Service.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="legal-section">
          <h3>5. Cookies and Tracking</h3>
          <p>
            <strong>lowestbid.lol</strong> does not use invasive third-party tracking cookies or advertising retargeting pixels. We believe in a fast, lightweight, and transparent user experience.
          </p>
        </div>

        {/* Section 6 */}
        <div className="legal-section">
          <h3>
            <Mail size={18} style={{ color: '#38bdf8' }} /> 6. Data Removal & Contact
          </h3>
          <p>
            If you wish to update a destination URL or request the removal of an entry you submitted, please contact us with proof of ownership or the transaction ID at:
            <br />
            <strong>privacy@lowestbid.lol</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
