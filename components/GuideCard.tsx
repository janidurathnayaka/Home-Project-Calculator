import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Guide } from '@/lib/guides';

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="guide-card">
      <div className="guide-meta"><span>{guide.category}</span><span><Clock size={14} /> {guide.readTime}</span></div>
      <h3>{guide.title}</h3>
      <p>{guide.excerpt}</p>
      <span className="card-link">Read guide <ArrowRight size={16} /></span>
    </Link>
  );
}
