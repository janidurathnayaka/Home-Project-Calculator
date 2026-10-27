import type { Metadata } from 'next';
import GuideCard from '@/components/GuideCard';
import { guides } from '@/lib/guides';

export const metadata: Metadata = { title: 'Home Project Cost Guides', description: 'Practical measurement, quantity, waste, and renovation-budget guides for homeowners and DIY project planning.' };

export default function GuidesPage() { return <div className="page-shell container"><div className="page-hero"><span className="eyebrow">PRACTICAL GUIDES</span><h1>Understand what changes the number</h1><p>Short, useful explainers for quantities, waste, local pricing, contingencies, and better project estimates.</p></div><div className="guide-grid all-guides">{guides.map(g=><GuideCard key={g.slug} guide={g}/>)}</div></div>; }
