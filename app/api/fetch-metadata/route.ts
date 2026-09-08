import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, ' ')
    .trim();
}

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1'
  ) {
    return true;
  }

  // Check IPv4 private ranges
  const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    let rawUrl = url.trim();

    // Check if input is a Twitter/X handle or URL
    if (rawUrl.startsWith('@')) {
      const handle = rawUrl.replace(/^@+/, '');
      return NextResponse.json({
        success: true,
        title: `@${handle}`,
        description: `Check out @${handle} on X`,
        favicon: `https://unavatar.io/x/${handle}`,
        url: `https://x.com/${handle}`,
        twitter: `@${handle}`,
        domain: 'x.com',
        isTwitter: true,
      });
    }

    const twitterMatch = rawUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,30})/i);
    if (twitterMatch && twitterMatch[1]) {
      const handle = twitterMatch[1];
      return NextResponse.json({
        success: true,
        title: `@${handle}`,
        description: `Check out @${handle} on X`,
        favicon: `https://unavatar.io/x/${handle}`,
        url: `https://x.com/${handle}`,
        twitter: `@${handle}`,
        domain: 'x.com',
        isTwitter: true,
      });
    }

    let targetUrl = rawUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, error: 'Only HTTP and HTTPS URLs are supported' }, { status: 400 });
    }

    if (isPrivateIpOrHost(parsedUrl.hostname)) {
      return NextResponse.json({ success: false, error: 'Private or local addresses are not permitted' }, { status: 403 });
    }

    // Fetch the target URL with a 5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let html = '';
    try {
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `Failed to fetch page: HTTP ${response.status}`,
        });
      }

      // Stream only up to first ~120KB (head tag is almost always in first 100KB)
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder('utf-8');
        let received = 0;
        while (received < 120 * 1024) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.length;
          html += decoder.decode(value, { stream: true });
          if (html.includes('</head>')) break;
        }
        reader.cancel();
      } else {
        html = await response.text();
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      return NextResponse.json({
        success: false,
        error: err.name === 'AbortError' ? 'Website fetch timed out' : 'Could not connect to website',
      });
    }

    // Extract Description (priority: og:description > meta[name=description] > twitter:description)
    let description = '';

    const ogDescMatch =
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i);

    if (ogDescMatch && ogDescMatch[1]?.trim()) {
      description = ogDescMatch[1].trim();
    } else {
      const standardDescMatch =
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);

      if (standardDescMatch && standardDescMatch[1]?.trim()) {
        description = standardDescMatch[1].trim();
      } else {
        const twitterDescMatch =
          html.match(/<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']*)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']twitter:description["']/i);

        if (twitterDescMatch && twitterDescMatch[1]?.trim()) {
          description = twitterDescMatch[1].trim();
        }
      }
    }

    // Extract Title (priority: og:title > <title>)
    let title = '';
    const ogTitleMatch =
      html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);

    if (ogTitleMatch && ogTitleMatch[1]?.trim()) {
      title = ogTitleMatch[1].trim();
    } else {
      const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleTagMatch && titleTagMatch[1]?.trim()) {
        title = titleTagMatch[1].trim();
      }
    }

    description = decodeHtmlEntities(description).slice(0, 150);
    title = decodeHtmlEntities(title).slice(0, 50);

    return NextResponse.json({
      success: true,
      description,
      title,
      favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
      domain: parsedUrl.hostname.replace(/^www\./, ''),
      url: targetUrl,
    });
  } catch (error: any) {
    console.error('Error fetching website metadata:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
