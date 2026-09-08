import { NextResponse } from 'next/server';
import { getLeaderboardDataAsync } from '@/lib/db';
import { isDodoConfigured } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getLeaderboardDataAsync();
    return NextResponse.json({
      success: true,
      data,
      isDodoConfigured: isDodoConfigured(),
    });
  } catch (error) {
    console.error('Failed to get leaderboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
