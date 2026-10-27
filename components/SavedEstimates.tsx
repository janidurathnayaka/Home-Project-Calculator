'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { SavedEstimate } from '@/lib/types';
import { safeReadEstimates, saveEstimates, displayMeasuredResult } from '@/lib/project-tools';
import { Trash2, ArrowUpRight, Bookmark, Pencil, Search, GitCompareArrows, Download } from 'lucide-react';

export default function SavedEstimates() {
  const [items, setItems] = useState<SavedEstimate[]>([]);
  const [search, setSearch] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const uploadRef=useRef<HTMLInputElement>(null);
  useEffect(()=>setItems(safeReadEstimates()),[]);
  function commit(next:SavedEstimate[]) {if(saveEstimates(next)){setItems(next);}else setMessage('Unable to update browser storage.');}
  function remove(id:string){if(!window.confirm('Delete this estimate?'))return;commit(items.filter(x=>x.id!==id));setChosen(prev=>prev.filter(x=>x!==id));}
  function clear(){if(!window.confirm('Delete ALL saved estimates on this browser?'))return;commit([]);setChosen([]);}
  function rename(item:SavedEstimate){const name=window.prompt('Project name',item.name||item.calculatorTitle);if(name!==null&&name.trim())commit(items.map(x=>x.id===item.id?{...x,name:name.trim().slice(0,80)}:x));}
  async function importSaved(file:File|undefined){
    if(!file)return;
    if(file.size>1024*1024){setMessage('Backup file too large (max 1 MB).');return;}
    try{
      const data:unknown=JSON.parse(await file.text());
      if(!Array.isArray(data))throw new Error('Not a project backup array.');
      const valid:SavedEstimate[]=data.filter((x):x is SavedEstimate=>Boolean(x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.calculatorSlug==='string'&&x.values&&typeof x.values==='object'&&!Array.isArray(x.values)&&Array.isArray(x.results))).slice(0,60);
      if(!valid.length)throw new Error('No valid estimates found.');
      if(!window.confirm(`Import ${valid.length} estimates? Entries with matching IDs will be replaced.`))return;
      const merged=[...valid,...items.filter(x=>!valid.some(y=>y.id===x.id))].slice(0,60);
      commit(merged);setMessage(`${valid.length} estimates imported.`);
    }catch{setMessage('Could not import: select a valid Home Project Calculator JSON backup.');}
    finally{if(uploadRef.current)uploadRef.current.value='';}
  }
  function exportSaved(){const blob=new Blob([JSON.stringify(items,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='home-project-estimates-backup.json';a.click();URL.revokeObjectURL(url);}
  const filtered=items.filter(x=>`${x.name||''} ${x.calculatorTitle}`.toLowerCase().includes(search.toLowerCase()));
  const comparison=chosen.map(id=>items.find(x=>x.id===id)).filter((x):x is SavedEstimate=>Boolean(x));
  return <div>
    <div className="saved-toolbar"><p>{items.length} saved estimate{items.length===1?'':'s'} on this device.</p><div className="saved-toolbar-actions"><button className="text-btn" onClick={exportSaved} disabled={!items.length}><Download size={15}/> Backup JSON</button><input ref={uploadRef} type="file" accept="application/json,.json" className="restore-input" aria-label="Restore estimates from JSON backup" onChange={e=>void importSaved(e.target.files?.[0])}/><button className="text-btn" onClick={()=>uploadRef.current?.click()}>Restore backup</button><button className="text-btn danger" onClick={clear} disabled={!items.length}><Trash2 size={15}/> Clear all</button></div></div>
    {message&&<p role="status" className="calculator-notice">{message}</p>}
    {items.length===0?<div className="empty-state"><Bookmark size={32}/><h2>No saved estimates yet</h2><p>Save any estimate to keep a snapshot privately in this browser.</p><Link className="primary-btn" href="/calculators">Browse calculators <ArrowUpRight size={17}/></Link></div>:<>
      <label className="saved-search"><Search size={18}/><input placeholder="Search saved projects" value={search} onChange={e=>setSearch(e.target.value)} /></label>
      <p className="settings-hint">Choose two estimates to compare their saved results. Open Edit to reload original inputs. Deleting browser data removes saved projects unless backed up.</p>
      <div className="saved-grid">{filtered.map(item=><article className="saved-card" key={item.id}>
        <div className="saved-card-head"><div><span className="category-chip">{item.currency??'USD'} · {item.unitSystem??'imperial'}</span><h3>{item.name||item.calculatorTitle}</h3><small>{item.calculatorTitle} · {new Date(item.createdAt).toLocaleString()}</small></div><button className="icon-action light-action" onClick={()=>remove(item.id)} aria-label={`Delete ${item.name||item.calculatorTitle}`}><Trash2 size={17}/></button></div>
        <div className="saved-results">{item.results.filter(r=>r.emphasis).map(r=><div key={r.label}><span>{r.label}</span><strong>{displayMeasuredResult(r.value,item.currency??'USD',item.unitSystem??'imperial')}</strong></div>)}</div>
        <label className="compare-option"><input type="checkbox" checked={chosen.includes(item.id)} onChange={e=>setChosen(prev=>e.target.checked?[...prev.slice(-1),item.id]:prev.filter(x=>x!==item.id))}/> Compare</label>
        <div className="saved-controls"><button type="button" className="text-btn" onClick={()=>rename(item)}><Pencil size={14}/> Rename</button><Link className="card-link" href={`/calculators/${item.calculatorSlug}?edit=${encodeURIComponent(item.id)}`}>Edit project <ArrowUpRight size={16}/></Link></div>
      </article>)}</div>
      {comparison.length===2&&<section className="comparison-card"><h2><GitCompareArrows size={20}/> Side-by-side comparison</h2><div className="comparison-grid">{comparison.map(item=><div key={item.id}><h3>{item.name||item.calculatorTitle}</h3>{item.results.filter(r=>r.emphasis).map(r=><p key={r.label}><small>{r.label}</small><strong>{displayMeasuredResult(r.value,item.currency??'USD',item.unitSystem??'imperial')}</strong></p>)}</div>)}</div><p>Estimates may use different currencies, units or scopes. Compare values only when the inputs are compatible.</p></section>}
    </>}
  </div>;
}
