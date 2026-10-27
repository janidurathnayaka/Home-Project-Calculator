import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
// No email collection until a real provider and consent flow are configured.
export default function Newsletter(){return <section className="newsletter"><div><span className="eyebrow">PROJECT NOTES</span><h2>Tips for your next home project.</h2><p>Browse free planning guides, measurements and budgeting checklists. No email required.</p></div><Link href="/guides" className="primary-btn">Explore guides <ArrowRight size={17}/></Link></section>}
