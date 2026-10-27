import Link from 'next/link';
export default function NotFound(){return <div className="empty-state standalone"><h1>404</h1><h2>That page wandered off the jobsite.</h2><p>Try the calculator library instead.</p><Link href="/calculators" className="primary-btn">Browse calculators</Link></div>}
