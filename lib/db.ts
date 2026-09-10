import fs from 'fs';
import path from 'path';
import os from 'os';
import { getSupabase, isSupabaseConfigured } from './supabase';

export interface Bid {
  id: string;
  amount: number; // e.g. 1.05
  amountCents: number; // e.g. 105
  title: string;
  url: string;
  message: string;
  twitter?: string;
  category?: string;
  createdAt: string;
  status: 'pending' | 'verified';
  paymentId?: string;
  isUnique?: boolean;
  clicks?: number;
}

export interface LeaderboardStats {
  totalVolume: number;
  totalBids: number;
  currentLowestUniqueBid: number | null;
  clashedCount: number;
  highestBid: number | null;
  uniqueBidsCount: number;
}

// Global in-memory cache for serverless execution context
const globalForBids = globalThis as unknown as {
  bidsCache?: Bid[];
};

// On Vercel serverless / AWS Lambda, process.cwd() is read-only.
const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel
  ? path.join(os.tmpdir(), 'lowestbid-data')
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bids.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'bids.json');

// Convert between TypeScript Bid interface and Supabase DB Row
function toDbRow(bid: Bid) {
  return {
    id: bid.id,
    amount: bid.amount,
    amount_cents: bid.amountCents || Math.round(bid.amount * 100),
    title: bid.title,
    url: bid.url,
    message: bid.message || '',
    twitter: bid.twitter || null,
    category: bid.category || 'Other',
    status: bid.status,
    payment_id: bid.paymentId || null,
    clicks: bid.clicks || 0,
    created_at: bid.createdAt || new Date().toISOString(),
  };
}

export function inferCategory(url: string = '', title: string = '', rawCategory?: string): string {
  if (rawCategory && rawCategory !== 'Other' && rawCategory.trim().length > 0) {
    if (rawCategory === 'AI Tools') return 'AI Agents & Infrastructure';
    return rawCategory;
  }
  const text = (url + ' ' + title).toLowerCase();
  if (text.includes('thumbgen') || text.includes('agent') || text.includes('ai') || text.includes('gpt') || text.includes('bot')) {
    return 'AI Agents & Infrastructure';
  }
  if (text.includes('seo') || text.includes('visibility') || text.includes('rank')) {
    return 'SEO & AI Visibility';
  }
  if (text.includes('marketing') || text.includes('ad') || text.includes('campaign')) {
    return 'Marketing & Advertising';
  }
  if (text.includes('analytics') || text.includes('stats') || text.includes('metrics')) {
    return 'Analytics';
  }
  if (text.includes('crypto') || text.includes('web3') || text.includes('sol') || text.includes('btc') || text.includes('eth')) {
    return 'Crypto, Web3 & Investing';
  }
  if (text.includes('firstissue') || text.includes('dev') || text.includes('code') || text.includes('git') || text.includes('open source')) {
    return 'Developer Tools';
  }
  if (text.includes('legal') || text.includes('finance') || text.includes('tax')) {
    return 'Business, Finance & Legal';
  }
  if (text.includes('security') || text.includes('privacy') || text.includes('auth')) {
    return 'Security, Privacy & Compliance';
  }
  if (text.includes('health') || text.includes('fitness') || text.includes('gym')) {
    return 'Health, Fitness & Wellness';
  }
  if (text.includes('social') || text.includes('creator') || text.includes('x.com') || text.includes('twitter')) {
    return 'Social Media & Creator Tools';
  }
  return rawCategory || 'Other';
}

function fromDbRow(row: any): Bid {
  return {
    id: row.id,
    amount: Number(row.amount),
    amountCents: row.amount_cents ?? Math.round(Number(row.amount) * 100),
    title: row.title,
    url: row.url,
    message: row.message || '',
    twitter: row.twitter || undefined,
    category: inferCategory(row.url, row.title, row.category),
    status: row.status,
    paymentId: row.payment_id || undefined,
    clicks: row.clicks || 0,
    createdAt: row.created_at,
  };
}

// Ensure data directory and initial database file exist (for file fallback)
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      let initialData = '[]';
      if (fs.existsSync(SEED_FILE)) {
        try {
          initialData = fs.readFileSync(SEED_FILE, 'utf8');
        } catch {}
      }
      fs.writeFileSync(DB_FILE, initialData, 'utf8');
    }
  } catch (err) {
    console.warn('Filesystem access limited, using in-memory store:', err);
  }
}

// Read raw bids from JSON with in-memory fallback
export function getAllBids(): Bid[] {
  ensureDataFile();
  try {
    let parsed: Bid[] = [];
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      parsed = JSON.parse(raw) as Bid[];
    } else if (fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf8');
      parsed = JSON.parse(raw) as Bid[];
    }
    const withInferred = parsed.map(b => ({
      ...b,
      category: inferCategory(b.url, b.title, b.category),
    }));
    globalForBids.bidsCache = withInferred;
    return withInferred;
  } catch (err) {
    console.error('Error reading bids DB:', err);
  }

  return (globalForBids.bidsCache || []).map(b => ({
    ...b,
    category: inferCategory(b.url, b.title, b.category),
  }));
}

// Asynchronously read bids from Supabase if configured, with local fallback
export async function getAllBidsAsync(): Promise<Bid[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('bids').select('*');
        if (!error && data) {
          const mapped = data.map(fromDbRow);
          globalForBids.bidsCache = mapped;
          return mapped;
        } else if (error) {
          console.warn('Supabase fetch error, falling back to local:', error.message);
        }
      } catch (err) {
        console.warn('Supabase connection failed, falling back to local:', err);
      }
    }
  }

  return getAllBids();
}

// Write bids to JSON with atomic replace and memory cache
export function saveAllBids(bids: Bid[]): void {
  globalForBids.bidsCache = bids;

  ensureDataFile();
  try {
    const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(bids, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(bids, null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('Could not persist to disk (serverless ephemeral environment):', writeErr);
    }
  }
}

// Add or update a bid (synchronous file + cache)
export function upsertBid(bid: Bid): void {
  const bids = getAllBids();
  const existingIdx = bids.findIndex(
    b => b.id === bid.id || (bid.paymentId && b.paymentId === bid.paymentId)
  );
  if (existingIdx >= 0) {
    bids[existingIdx] = { ...bids[existingIdx], ...bid };
  } else {
    bids.push(bid);
  }
  saveAllBids(bids);
}

// Add or update a bid in Supabase (with synchronous fallback)
export async function upsertBidAsync(bid: Bid): Promise<void> {
  upsertBid(bid);

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbRow = toDbRow(bid);
        const { error } = await supabase.from('bids').upsert(dbRow);
        if (error) {
          console.error('Failed to upsert bid in Supabase:', error.message);
          if (error.message && error.message.includes('category')) {
            const { category: _cat, ...rowWithoutCat } = dbRow;
            await supabase.from('bids').upsert(rowWithoutCat);
          }
        }
      } catch (err) {
        console.error('Error connecting to Supabase during upsert:', err);
      }
    }
  }
}

// Increment click count for a bid (sync)
export function incrementBidClicks(bidId: string): number {
  const bids = getAllBids();
  const bid = bids.find(b => b.id === bidId);
  if (bid) {
    bid.clicks = (bid.clicks || 0) + 1;
    saveAllBids(bids);
    return bid.clicks;
  }
  return 0;
}

// Increment click count for a bid in Supabase (async)
export async function incrementBidClicksAsync(bidId: string): Promise<number> {
  const newClicks = incrementBidClicks(bidId);

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('bids').update({ clicks: newClicks }).eq('id', bidId);
      } catch (err) {
        console.error('Failed to update clicks in Supabase:', err);
      }
    }
  }

  return newClicks;
}

// Mark a bid as verified by paymentId or bidId (sync)
export function verifyBid(paymentIdOrBidId: string): Bid | null {
  const bids = getAllBids();
  const bid = bids.find(b => b.id === paymentIdOrBidId || b.paymentId === paymentIdOrBidId);
  if (bid) {
    bid.status = 'verified';
    saveAllBids(bids);
    return bid;
  }
  return null;
}

// Mark a bid as verified in Supabase (async)
export async function verifyBidAsync(paymentIdOrBidId: string): Promise<Bid | null> {
  const verified = verifyBid(paymentIdOrBidId);

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('bids')
          .update({ status: 'verified' })
          .or(`id.eq.${paymentIdOrBidId},payment_id.eq.${paymentIdOrBidId}`);
      } catch (err) {
        console.error('Failed to update verified status in Supabase:', err);
      }
    }
  }

  return verified;
}

// Helper to normalize website URLs or Twitter handles into a canonical website key
export function normalizeWebsiteKey(url: string): string {
  if (!url) return '';
  const trimmed = url.trim().toLowerCase();

  // If Twitter / X handle
  if (trimmed.startsWith('@')) {
    return trimmed.replace(/^@+/, '@');
  }

  // If x.com or twitter.com URL (e.g. https://x.com/username)
  const twitterMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-z0-9_]+)(?:\/.*)?$/i);
  if (twitterMatch && twitterMatch[1]) {
    return `@${twitterMatch[1].toLowerCase()}`;
  }

  // General website URL
  try {
    const withProto = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    // For platforms hosting individual user channels or profiles, preserve pathname
    if (['github.com', 'gitlab.com', 'youtube.com', 'substack.com', 'medium.com', 'linktr.ee'].includes(host)) {
      const cleanPath = parsed.pathname.replace(/\/+$/, '').toLowerCase();
      return `${host}${cleanPath}`;
    }
    return host;
  } catch {
    return trimmed.replace(/^(?:https?:\/\/)?(?:www\.)?/, '').replace(/\/+$/, '');
  }
}

// Compute leaderboard logic from any list of bids
export function computeLeaderboard(allBids: Bid[]) {
  const verified = allBids.filter(b => b.status === 'verified');

  // Group verified bids by canonical website key.
  // Exactly like outbid.lol: A single website has only 1 active listing on the billboard (its highest bid).
  const websiteGroups: Record<string, Bid[]> = {};
  verified.forEach(b => {
    const key = normalizeWebsiteKey(b.url);
    if (!websiteGroups[key]) {
      websiteGroups[key] = [];
    }
    websiteGroups[key].push(b);
  });

  // For each website, select the highest bid as its active billboard entry,
  // accumulating total clicks and adopting the latest updated title/message/twitter.
  const activeWebsiteBids: Bid[] = Object.values(websiteGroups).map(bids => {
    // Highest bid first; if tied, latest createdAt first
    const sortedByAmount = [...bids].sort(
      (a, b) =>
        b.amount - a.amount ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const highestBid = sortedByAmount[0];

    // Latest bid provides any newer title, pitch, or twitter details
    const latestBid = [...bids].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    // Sum all clicks accumulated across all bids for this website
    const totalClicks = bids.reduce((sum, b) => sum + (b.clicks || 0), 0);

    return {
      ...highestBid,
      title: latestBid.title || highestBid.title,
      message: latestBid.message !== undefined ? latestBid.message : highestBid.message,
      twitter: latestBid.twitter || highestBid.twitter,
      category: inferCategory(highestBid.url, highestBid.title, latestBid.category || highestBid.category),
      url: latestBid.url || highestBid.url,
      clicks: totalClicks,
    };
  });

  // Count occurrences of each amount across ACTIVE website listings only
  // (Prevents ghost clashes with old lower bids from the same website)
  const amountCounts: Record<string, number> = {};
  activeWebsiteBids.forEach(b => {
    const key = b.amount.toFixed(2);
    amountCounts[key] = (amountCounts[key] || 0) + 1;
  });

  // Attach uniqueness flag to active website listings
  const bidsWithUniqueness: (Bid & { isUnique: boolean; clashCount: number })[] = activeWebsiteBids.map(b => {
    const key = b.amount.toFixed(2);
    const count = amountCounts[key] || 0;
    return {
      ...b,
      isUnique: count === 1,
      clashCount: count,
    };
  });

  // Leaderboard ranking: sorted descending by amount (Highest Bidder is Rank #1)
  const rankedBids = [...bidsWithUniqueness].sort(
    (a, b) =>
      b.amount - a.amount ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Reigning champion is the #1 highest bidder
  const reigningChampion = rankedBids.length > 0 ? rankedBids[0] : null;

  // Clashed bids (amounts chosen by 2 or more different websites)
  const clashedBids = bidsWithUniqueness
    .filter(b => !b.isUnique)
    .sort(
      (a, b) =>
        b.amount - a.amount ||
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // High Rollers: sorted descending by amount (1 entry per website)
  const highRollers = [...rankedBids];

  // Live Chronological Feed: all verified bid events logged chronologically
  const recentFeed = [...verified].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Platform statistics
  const totalVolume = verified.reduce((sum, b) => sum + b.amount, 0);
  const totalBids = verified.length;
  const currentLowestUniqueBid = reigningChampion ? reigningChampion.amount : null;
  const highestBid = highRollers.length > 0 ? highRollers[0].amount : null;

  const stats: LeaderboardStats = {
    totalVolume: Math.round(totalVolume * 100) / 100,
    totalBids,
    currentLowestUniqueBid: reigningChampion ? reigningChampion.amount : null,
    clashedCount: clashedBids.length,
    highestBid,
    uniqueBidsCount: rankedBids.length,
  };

  return {
    reigningChampion,
    uniqueBids: rankedBids,
    clashedBids,
    highRollers,
    recentFeed,
    stats,
  };
}

// Synchronous leaderboard computation
export function getLeaderboardData() {
  const allBids = getAllBids();
  return computeLeaderboard(allBids);
}

// Asynchronous leaderboard computation (reads from Supabase if configured)
export async function getLeaderboardDataAsync() {
  const allBids = await getAllBidsAsync();
  return computeLeaderboard(allBids);
}
