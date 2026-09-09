import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lowestbid.lol';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sandbox-checkout', '/success'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
