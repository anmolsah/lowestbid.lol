import fs from 'fs';
import path from 'path';
import os from 'os';

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
// Use os.tmpdir() on Vercel, and process.cwd()/data in local development.
const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel
  ? path.join(os.tmpdir(), 'lowestbid-data')
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bids.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'bids.json');

// Optional Upstash / Vercel KV persistence if configured
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function syncToKV(bids: Bid[]) {
  if (!kvUrl || !kvToken) return;
  try {
    await fetch(`${kvUrl}/set/lowestbid_bids`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(bids)),
    });
  } catch (err) {
    console.error('Failed to sync bids to KV:', err);
  }
}

// Ensure data directory and initial database file exist
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      // Seed with initial bids from bundled data directory if available
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

// Write bids to JSON with atomic replace and memory cache
export function saveAllBids(bids: Bid[]): void {
  // Always update in-memory cache first so operations succeed immediately
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

  // If KV is configured, sync in background
  if (kvUrl && kvToken) {
    syncToKV(bids).catch(() => {});
  }
}

// Add or update a bid
export function upsertBid(bid: Bid): void {
  const bids = getAllBids();
  const existingIdx = bids.findIndex(b => b.id === bid.id || (bid.paymentId && b.paymentId === bid.paymentId));
  if (existingIdx >= 0) {
    bids[existingIdx] = { ...bids[existingIdx], ...bid };
  } else {
    bids.push(bid);
  }
  saveAllBids(bids);
}

// Increment click count for a bid
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

// Mark a bid as verified by paymentId or bidId
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

// Compute full leaderboard state with game mechanics
export function getLeaderboardData() {
  const allBids = getAllBids();
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
    .sort((a, b) => a.amount - b.amount || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Clashed bids (amounts chosen by 2 or more people)
  const clashedBids = bidsWithUniqueness
    .filter(b => !b.isUnique)
    .sort((a, b) => a.amount - b.amount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Reigning champion is the #1 lowest unique bid
  const reigningChampion = uniqueBids.length > 0 ? uniqueBids[0] : null;

  // High Rollers: sorted descending by amount (Whales flexing big bids)
  const highRollers = [...bidsWithUniqueness].sort((a, b) => b.amount - a.amount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Live Chronological Feed
  const recentFeed = [...bidsWithUniqueness].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
