import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
const baseUrl = 'https://kunal-vaghani-portfolio.vercel.app';
  return [
    { url: baseUrl, lastModified: new Date('2026-09-01'), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/kunalos`, lastModified: new Date('2026-09-01'), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
