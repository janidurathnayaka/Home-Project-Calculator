import type { Metadata } from 'next';
import SavedEstimates from '@/components/SavedEstimates';
export const metadata:Metadata={title:'Saved Estimates',description:'Your saved Home Project Calculator project estimates.'};
export default function SavedPage(){return <div className="page-shell container"><div className="page-hero compact"><span className="eyebrow">YOUR DEVICE</span><h1>Saved estimates</h1><p>Project snapshots are stored locally in your browser — no account required.</p></div><SavedEstimates/></div>}
