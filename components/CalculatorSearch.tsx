'use client';
import { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
export default function CalculatorSearch(){
  const [term,setTerm]=useState('');
  const found=calculators.filter(c=>`${c.title} ${c.description} ${c.category}`.toLowerCase().includes(term.toLowerCase().trim()));
  return <section className="search-calculators"><label className="search-box"><Search size={20}/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Search calculators (paint, drywall, solar...)" aria-label="Search calculators" /></label>
    {term.trim()&&<><p>{found.length} calculator{found.length===1?'':'s'} found</p><div className="directory-grid">{found.map((c,i)=><CalculatorCard calculator={c} key={c.slug} index={i}/>)}</div>{!found.length&&<p>No matches. Try another project keyword.</p>}</>}
  </section>;
}
