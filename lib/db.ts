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
    status: bid.status,
    payment_id: bid.paymentId || null,
    clicks: bid.clicks || 0,
    created_at: bid.createdAt || new Date().toISOString(),
  };
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
  if (globalForBids.bidsCache && globalForBids.bidsCache.length > 0) {
    return globalForBids.bidsCache;
  }

  ensureDataFile();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw) as Bid[];
      globalForBids.bidsCache = parsed;
      return parsed;
    }
    if (fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf8');
      const parsed = JSON.parse(raw) as Bid[];
      globalForBids.bidsCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading bids DB:', err);
  }

  return globalForBids.bidsCache || [];
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
        const { error } = await supabase.from('bids').upsert(toDbRow(bid));
        if (error) {
          console.error('Failed to upsert bid in Supabase:', error.message);
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

// Compute leaderboard logic from any list of bids
export function computeLeaderboard(allBids: Bid[]) {
  const verified = allBids.filter(b => b.status === 'verified');

  // Count occurrences of each amount (formatted to 2 decimal places)
  const amountCounts: Record<string, number> = {};
  verified.forEach(b => {
    const key = b.amount.toFixed(2);
    amountCounts[key] = (amountCounts[key] || 0) + 1;
  });

  // Attach uniqueness flag
  const bidsWithUniqueness: (Bid & { isUnique: boolean; clashCount: number })[] = verified.map(b => {
    const key = b.amount.toFixed(2);
    const count = amountCounts[key] || 0;
    return {
      ...b,
      isUnique: count === 1,
      clashCount: count,
    };
  });

  // Unique bids sorted ascending by amount (Lowest Unique Bids)
  const uniqueBids = bidsWithUniqueness
    .filter(b => b.isUnique)
    .sort(
      (a, b) =>
        a.amount - b.amount ||
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // Clashed bids (amounts chosen by 2 or more people)
  const clashedBids = bidsWithUniqueness
    .filter(b => !b.isUnique)
    .sort(
      (a, b) =>
        a.amount - b.amount ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Reigning champion is the #1 lowest unique bid
  const reigningChampion = uniqueBids.length > 0 ? uniqueBids[0] : null;

  // High Rollers: sorted descending by amount (Whales flexing big bids)
  const highRollers = [...bidsWithUniqueness].sort(
    (a, b) =>
      b.amount - a.amount ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Live Chronological Feed
  const recentFeed = [...bidsWithUniqueness].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate overall platform stats
  const totalVolume = verified.reduce((sum, b) => sum + b.amount, 0);
  const totalBids = verified.length;
  const currentLowestUniqueBid = reigningChampion ? reigningChampion.amount : null;
  const highestBid = highRollers.length > 0 ? highRollers[0].amount : null;

  const stats: LeaderboardStats = {
    totalVolume: Math.round(totalVolume * 100) / 100,
    totalBids,
    currentLowestUniqueBid,
    clashedCount: clashedBids.length,
    highestBid,
    uniqueBidsCount: uniqueBids.length,
  };

  return {
    reigningChampion,
    uniqueBids,
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
