import { Suspense } from 'react';
import { getLeaderboardDataAsync } from '@/lib/db';
import LeaderboardContent from '@/components/LeaderboardContent';

export const dynamic = 'force-dynamic';

async function LeaderboardPage() {
  const data = await getLeaderboardDataAsync();

  return (
    <LeaderboardContent
      initialData={{
        reigningChampion: data.reigningChampion,
        uniqueBids: data.uniqueBids,
        clashedBids: data.clashedBids,
        highRollers: data.highRollers,
        recentFeed: data.recentFeed,
        stats: data.stats,
      }}
    />
  );
}

export default function HomePage() {
  return (
    <main className="container">
      <Suspense>
        <LeaderboardPage />
      </Suspense>
    </main>
  );
}
