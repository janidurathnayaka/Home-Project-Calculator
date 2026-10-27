'use client';
import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { calculators } from '@/lib/calculators';
export default function ProjectAssistant(){
  const [projectType,setProjectType]=useState(calculators[0].title);
  const [question,setQuestion]=useState('');
  const [answer,setAnswer]=useState('');
  const [mode,setMode]=useState('');
  const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setAnswer('');try{const response=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectType,question})});const result=await response.json();setAnswer(result.answer || result.error || 'No answer available.');setMode(result.mode||'');}catch{setAnswer('Could not reach the assistant.');}finally{setLoading(false);}}
  return <form className="assistant-panel" onSubmit={submit}><span className="eyebrow">PROJECT PLANNING ASSISTANT</span><h2><Sparkles size={26}/> Ask about your project</h2><p>Get a general checklist. Optional AI advice becomes available after a server API key is configured; otherwise this tool provides a transparent offline-style checklist.</p>
    <label>Project type<select value={projectType} onChange={e=>setProjectType(e.target.value)}>{calculators.map(c=><option key={c.slug} value={c.title}>{c.title}</option>)}</select></label>
    <label>Your planning question<textarea rows={4} maxLength={1000} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. What should I verify before buying tile for my kitchen?" required minLength={8}/></label>
    <button className="primary-btn" disabled={loading || question.trim().length<8}>{loading?'Checking…':<>Get planning advice <Send size={16}/></>}</button>
    {answer&&<div className="assistant-answer" aria-live="polite"><strong>{mode==='ai'?'AI-generated advice':'General planning checklist'}</strong><p>{answer}</p></div>}
    <small>Not a replacement for permits, engineering advice, or qualified contractor inspections.</small>
  </form>;
}
