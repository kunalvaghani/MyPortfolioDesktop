import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://kunal-vaghani-portfolio.vercel.app/sitemap.xml',
    host: 'https://kunal-vaghani-portfolio.vercel.app',
  };
}
