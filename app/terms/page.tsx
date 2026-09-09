import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ShieldAlert, Crown, Swords, DollarSign, Ban, RefreshCw, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Official Game Rules — lowestbid.lol',
  description: 'Official bidding rules, lowest unique bid mechanics, payment terms, and content policies for lowestbid.lol.',
};

export default function TermsPage() {
  return (
    <div className="legal-container">
      <Link href="/" className="legal-back-nav">
        <ArrowLeft size={16} /> Back to Live Leaderboard
      </Link>

      <div className="legal-header">
        <div className="legal-badge">
          <FileText size={14} /> Official Guidelines
        </div>
        <h1 className="legal-title">Terms of Service & Game Rules</h1>
        <div className="legal-last-updated">
          Last updated: September 2026 &bull; Effective immediately upon placing a bid
        </div>
      </div>

      <div className="legal-card">
        {/* Section 1 */}
        <div className="legal-section">
          <h3>
            <Crown size={18} style={{ color: 'var(--accent-gold)' }} /> 1. What is lowestbid.lol?
          </h3>
          <p>
            <strong>lowestbid.lol</strong> is a public, competitive pay-to-rank advertising billboard and strategic leaderboard. 
            Participants place monetary bids to feature their website, brand, product, or personal profile in the coveted 
            <strong>#1 Crown Spotlight</strong>, on the <strong>Lowest Unique Bids</strong> leaderboard, and on the <strong>Whales / High Rollers</strong> wall.
          </p>
          <p>
            By accessing the website, placing a bid, or submitting a URL, you agree to be bound by these Terms of Service and Game Rules in full.
          </p>
        </div>

        {/* Section 2 */}
        <div className="legal-section">
          <h3>
            <DollarSign size={18} style={{ color: '#10b981' }} /> 2. Official Bidding Rules & Limits
          </h3>
          <p>
            All bids submitted on lowestbid.lol must adhere to the following financial constraints:
          </p>
          <ul>
            <li>
              <strong>Minimum Bid:</strong> The lowest bid any user can submit is exactly <strong>$1.50 USD</strong>. Bids below $1.50 are rejected by the validation engine.
            </li>
            <li>
              <strong>Multiples of $1.50:</strong> All bids must be exact multiples of <strong>$1.50 USD</strong> (e.g., $1.50, $3.00, $4.50, $6.00, $7.50, $9.00, $15.00, etc.). Non-multiples (such as arbitrary decimal points or cents) are strictly rejected.
            </li>
            <li>
              <strong>Maximum Bid:</strong> The highest bid any user can submit is <strong>$9,999,999.00 USD</strong>.
            </li>
            <li>
              <strong>Currency:</strong> All bids and payments are denominated and billed in United States Dollars ($ USD).
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="legal-section">
          <h3>
            <Swords size={18} style={{ color: 'var(--accent-rose)' }} /> 3. The Lowest Unique Bid (LUB) Mechanics
          </h3>
          <p>
            To prevent gridlock where a single user pays $1.50 and occupies the throne forever, lowestbid.lol operates under the 
            <strong>Lowest Unique Bid</strong> auction model:
          </p>
          <ul>
            <li>
              <strong>The #1 Crown Spotlight:</strong> The reigning champion featured at the top of the website is the verified entry with the <em>lowest numeric bid amount that is completely unique</em> (i.e., no other participant has bid that exact numerical amount).
            </li>
            <li>
              <strong>The Duplicate Clash Rule:</strong> If two or more users place a bid for the exact same amount (for example, if Alice bids $1.50 and Bob bids $1.50), both bids immediately <strong>clash</strong>. Clashed bids lose their uniqueness and are disqualified from holding the #1 Crown.
            </li>
            <li>
              <strong>Throne Succession:</strong> When a clash occurs, the #1 Crown Spotlight immediately falls to the next lowest bid that remains unique.
            </li>
            <li>
              <strong>Whales / High Rollers Board:</strong> Regardless of whether a bid is unique or clashed, every verified bid is simultaneously ranked by total dollar amount paid on the <em>Whales</em> tab, honoring major spenders.
            </li>
            <li>
              <strong>Duration:</strong> A bid holds the spotlight until a lower unique bid is placed or another user clashes with the reigning amount.
            </li>
          </ul>

          <div className="legal-highlight-box">
            <strong>Strategy Tip:</strong> Bidding $1.50 is common and frequently clashed. Strategic participants often bid higher uncrowded multiples (e.g. $4.50, $7.50, $10.50) to find un-clashed spots and claim the throne!
          </div>
        </div>

        {/* Section 4 */}
        <div className="legal-section">
          <h3>
            <ShieldAlert size={18} style={{ color: '#f59e0b' }} /> 4. Payments, Dodo Payments & Strict No-Refund Policy
          </h3>
          <p>
            Payments are securely processed through <strong>Dodo Payments</strong>, our Merchant of Record and authorized payment gateway.
          </p>
          <ul>
            <li>
              <strong>Instant Digital Fulfillment:</strong> The service provided by lowestbid.lol is immediate public digital placement on the leaderboard, live feed, and potential hero spotlight upon payment confirmation.
            </li>
            <li>
              <strong>All Sales are Final:</strong> Because public visibility and leaderboard recalculations are executed instantaneously upon payment, <strong>ALL BIDS AND PAYMENTS ARE STRICTLY NON-REFUNDABLE</strong> under any circumstances.
            </li>
            <li>
              <strong>No Chargebacks:</strong> Initiating a payment dispute or fraudulent chargeback will result in immediate permanent blacklisting of your URL, domain, Twitter handle, and IP address from all future participation.
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="legal-section">
          <h3>
            <Ban size={18} style={{ color: '#fb7185' }} /> 5. Content Policy & Prohibited Submissions
          </h3>
          <p>
            You are solely responsible for the links, text, and social handles you submit. We strictly prohibit the submission of:
          </p>
          <ul>
            <li>Phishing, malware, trojans, ransomware, or malicious download links.</li>
            <li>Illegal drugs, weapons, counterfeit items, or regulated goods.</li>
            <li>Pornography, adult/NSFW content, or sexually explicit material.</li>
            <li>Hate speech, harassment, defamation, threats, or incitement of violence.</li>
            <li>Deceptive pyramid schemes, fraudulent crypto rug pulls, or verified scams.</li>
          </ul>
          <p>
            We reserve the right, at our sole discretion, to remove, edit, or redact any URL or tagline that violates these guidelines without notice and without refund.
          </p>
        </div>

        {/* Section 6 */}
        <div className="legal-section">
          <h3>
            <RefreshCw size={18} style={{ color: '#38bdf8' }} /> 6. Disclaimer of Warranties & Limitation of Liability
          </h3>
          <p>
            <strong>lowestbid.lol</strong> is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no guarantees or warranties regarding:
          </p>
          <ul>
            <li>The number of clicks, impressions, website traffic, or sales your submitted link will receive.</li>
            <li>The duration for which your bid will retain the #1 Crown Spotlight before being underbid or clashed by another participant.</li>
            <li>Uninterrupted or error-free website uptime.</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div className="legal-section">
          <h3>7. Contact & Inquiries</h3>
          <p>
            For support inquiries, legal requests, or takedown notices, contact the lowestbid.lol administration at:
            <br />
            <strong>support@lowestbid.lol</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
