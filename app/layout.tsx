import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lowestbid.lol'),
  title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
  description: 'Outsmart the whales without breaking the piggy bank. Pick your lucky multiple of $1.50, dodge the duplicate drama, and claim the internet’s most unhinged #1 throne.',
  keywords: ['lowestbid', 'outbid', 'leaderboard', 'pay to rank', 'dodo payments', 'indie hacker', 'viral bidding'],
  icons: {
    icon: [
      { url: '/monogram.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/monogram.png',
    apple: '/monogram.png',
  },
  openGraph: {
    title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
    description: 'Outsmart the whales without breaking the piggy bank. Pick your lucky multiple of $1.50, dodge the duplicate drama, and claim the internet’s most unhinged #1 throne.',
    url: 'https://lowestbid.lol',
    siteName: 'lowestbid.lol',
    images: [
      {
        url: '/icon.png',
        width: 192,
        height: 192,
        alt: 'lowestbid.lol monogram logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
    description: 'Bid as low as $1 to claim the #1 spotlight. Powered by Dodo Payments.',
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/monogram.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/monogram.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('lowestbid_theme');
                  var theme = saved || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <div className="bg-pattern" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
