import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Health output is operational detail, not content worth indexing.
      disallow: '/api/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
