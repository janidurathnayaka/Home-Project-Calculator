import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { guideBySlug, guides } from '@/lib/guides';

export function generateStaticParams(){ return guides.map(g=>({slug:g.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const g=guideBySlug(slug);return g?{title:g.title,description:g.excerpt,alternates:{canonical:`/guides/${g.slug}`}}:{};}

export default async function GuidePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guideBySlug(slug);if(!g)notFound();return <div className="article-shell container"><Link href="/guides" className="back-link"><ArrowLeft size={15}/> All guides</Link><header className="article-header"><span className="eyebrow">{g.category.toUpperCase()} GUIDE</span><h1>{g.title}</h1><p>{g.excerpt}</p><div className="article-meta"><span><Clock size={15}/>{g.readTime}</span><span>Updated {g.updated}</span></div></header>{g.calculatorSlug&&<Link href={`/calculators/${g.calculatorSlug}`} className="article-tool-cta">Open the matching calculator <ArrowRight size={17}/></Link>}<article className="article-body">{g.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}{s.bullets&&<ul>{s.bullets.map(b=><li key={b}>{b}</li>)}</ul>}</section>)}<div className="editorial-note"><strong>Planning note</strong><p>Prices and requirements vary by location, supplier, scope, code, and site conditions. Use current local quotes and qualified professional advice where the project requires it.</p></div></article></div>}
