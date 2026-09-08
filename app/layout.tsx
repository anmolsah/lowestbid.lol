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
  title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
  description: 'Bid as low as $1 to claim the #1 spotlight on the internet. The lowest unique bid owns the throne. Secured by Dodo Payments.',
  keywords: ['lowestbid', 'outbid', 'leaderboard', 'pay to rank', 'dodo payments', 'indie hacker', 'viral bidding'],
  openGraph: {
    title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
    description: 'Can you hold the crown with the lowest unique bid? Bid from $1 to $9,999,999.',
    url: 'https://lowestbid.lol',
    siteName: 'lowestbid.lol',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lowestbid.lol — The Anti-Outbid Leaderboard',
    description: 'Bid as low as $1 to claim the #1 spotlight. Powered by Dodo Payments.',
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
