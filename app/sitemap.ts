import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';
import { calculators } from '@/lib/calculators';
import { guides } from '@/lib/guides';
export default function sitemap():MetadataRoute.Sitemap{const base=brand.siteUrl;const staticRoutes=['','/calculators','/guides','/about','/contact','/assistant','/convert','/privacy','/terms','/affiliate-disclosure'];return [...staticRoutes.map(r=>({url:`${base}${r}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:r===''?1:.7})),...calculators.map(c=>({url:`${base}/calculators/${c.slug}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:.9})),...guides.map(g=>({url:`${base}/guides/${g.slug}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:.75}))]}
