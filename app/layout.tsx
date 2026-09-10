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
  title: 'lowestbid.lol — Claim the #1 Spot on the Internet',
  description: 'The viral pay-to-rank link leaderboard. Highest bidder takes the #1 throne, drives real traffic, and outbids the competition in real time.',
  keywords: [
    'lowestbid',
    'lowestbid lol',
    'outbid alternative',
    'pay to rank leaderboard',
    'link billboard',
    'indie hacker promotion',
    'viral billboard game',
    'dodo payments',
    'website traffic billboard',
    'micro advertising game',
  ],
  authors: [{ name: '@anni_i29' }],
  creator: '@anni_i29',
  publisher: 'lowestbid.lol',
  alternates: {
    canonical: 'https://lowestbid.lol',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/monogram.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/monogram.png',
    apple: '/monogram.png',
  },
  openGraph: {
    title: 'lowestbid.lol — Claim the #1 Spot on the Internet',
    description: 'The viral pay-to-rank link leaderboard. Highest bidder takes the #1 throne, drives real traffic, and outbids the competition in real time.',
    url: 'https://lowestbid.lol',
    siteName: 'lowestbid.lol',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lowestbid.lol — Claim the #1 Spot on the Internet',
    description: 'The viral pay-to-rank link leaderboard. Highest bidder takes the #1 throne, drives real traffic, and outbids the competition in real time.',
    creator: '@anni_i29',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://lowestbid.lol/#website',
      'url': 'https://lowestbid.lol',
      'name': 'lowestbid.lol',
      'description': 'Outsmart the whales without breaking the piggy bank. The pay-to-rank billboard where the lowest unique bid claims the #1 spotlight.',
      'inLanguage': 'en-US',
      'publisher': {
        '@type': 'Organization',
        'name': 'lowestbid.lol',
        'url': 'https://lowestbid.lol',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://lowestbid.lol/monogram.png',
        },
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://lowestbid.lol/#webapp',
      'name': 'lowestbid.lol',
      'applicationCategory': 'GameApplication, AdvertisingApplication',
      'operatingSystem': 'All',
      'url': 'https://lowestbid.lol',
      'offers': {
        '@type': 'Offer',
        'price': '1.50',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://lowestbid.lol/#faq',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How does lowest unique bidding work on lowestbid.lol?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Participants place bids in multiples of $1.50 ($1.50, $3.00, $4.50, etc.). The entry with the lowest numeric bid that no other user has placed holds the #1 Crown Spotlight.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What happens if two people bid the exact same amount?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'When two or more users place the exact same bid, both entries clash and forfeit their uniqueness. The throne automatically passes to the next lowest bid that remains unique.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the minimum bid?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The minimum bid is $1.50 USD. Bids are placed in multiples of $1.50 with instant activation upon payment.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How are payments verified?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Payments are securely processed in real-time by Dodo Payments. Once verified, your website and pitch are published to the leaderboard immediately with live click tracking.',
          },
        },
      ],
    },
  ],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
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
