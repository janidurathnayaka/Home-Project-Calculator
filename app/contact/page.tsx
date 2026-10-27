import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
export const metadata:Metadata={title:'Contact',description:'Contact Home Project Calculator.'};
export default function ContactPage(){return <div className="page-shell container narrow-page"><div className="page-hero compact"><span className="eyebrow">CONTACT</span><h1>Found a better way to calculate it?</h1><p>Send feedback, corrections, partnership inquiries, or a calculator request.</p></div><ContactForm/></div>}
