import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'lowestbid.lol — The Anti-Outbid Leaderboard',
    short_name: 'lowestbid.lol',
    description: 'Outsmart the whales without breaking the piggy bank. Pick your lucky multiple of $1.50, dodge the duplicate drama, and claim the internet’s most unhinged #1 throne.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a0f',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/monogram.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
