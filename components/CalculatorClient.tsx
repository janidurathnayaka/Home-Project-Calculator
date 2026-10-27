'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Check, Copy, Printer, RotateCcw, ShieldCheck, Share2, FileDown, Ruler, AlertCircle, Pencil, Save, Info } from 'lucide-react';
import { calculators } from '@/lib/calculators';
import type { CalculatorDefinition, SavedEstimate } from '@/lib/types';
import { amountFromResult, convertInput, displayMeasuredResult, hasPartialMeasurements, moneyInCurrency, safeReadEstimates, saveEstimates, unitLabel, validateInputs } from '@/lib/project-tools';
import type { CurrencyCode, UnitSystem } from '@/lib/project-tools';

const defaultsFor = (calculator: CalculatorDefinition): Record<string,string> =>
  Object.fromEntries(calculator.fields.map(field => [field.key, field.type === 'number' ? '0' : String(field.defaultValue)]));

export default function CalculatorClient({ calculatorSlug }: { calculatorSlug: string }) {
  const calculator = calculators.find(c => c.slug === calculatorSlug);
  if (!calculator) return <div className="calculator-form-card">Calculator not found. <Link href="/calculators">Browse tools</Link></div>;
  return <CalculatorPanel calculator={calculator} />;
}

function CalculatorPanel({calculator}: {calculator: CalculatorDefinition}) {
  const defaults = useMemo(() => defaultsFor(calculator), [calculator]);
  const [values, setValues] = useState<Record<string,string>>(defaults);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [projectName, setProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [labor, setLabor] = useState('0');
  const [delivery, setDelivery] = useState('0');
  const [tax, setTax] = useState('0');
  const [contingency, setContingency] = useState('0');
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(false);
  const [showMath, setShowMath] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit');
    if (!edit) return;
    const item = safeReadEstimates().find(x => x.id === edit && x.calculatorSlug === calculator.slug);
    if (!item) { setNotice('Saved estimate not found on this device.'); return; }
    setValues(Object.fromEntries(calculator.fields.map(f => [f.key, String(item.values[f.key] ?? defaults[f.key])])));
    setProjectName(item.name ?? '');
    setCurrency(item.currency ?? 'USD');
    setUnitSystem(item.unitSystem ?? 'imperial');
    setLabor(String(item.labor ?? 0));
    setDelivery(String(item.delivery ?? 0));
    setTax(String(item.taxPercent ?? 0));
    setContingency(String(item.contingencyPercent ?? 0));
    setEditingId(item.id);
  }, [calculator, defaults]);

  const errors = useMemo(() => validateInputs(calculator, values, unitSystem), [calculator, values, unitSystem]);
  const extraErrors = useMemo(() => {
    const result: string[] = [];
    for (const [name, raw, max] of [['Labor',labor,Infinity],['Delivery',delivery,Infinity],['Tax',tax,100],['Contingency',contingency,100]] as const) {
      if (raw.trim() === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0 || Number(raw) > max) result.push(`${name} must be between 0 and ${max === Infinity ? 'a positive number' : max + '%'}.`);
    }
    return result;
  }, [labor,delivery,tax,contingency]);
  const hasErrors = Object.keys(errors).length > 0 || extraErrors.length > 0;
  const canonical = useMemo(() => Object.fromEntries(calculator.fields.map(f => {
    const v = values[f.key] ?? '';
    const amount = Number(v);
    return [f.key, f.type === 'select' ? v : (Number.isFinite(amount) && v !== '' ? convertInput(amount, f.unit, unitSystem, 'imperial') : 0)];
  })) as Record<string, number|string>, [calculator,values,unitSystem]);
  const partial = useMemo(() => hasPartialMeasurements(calculator, canonical), [calculator,canonical]);
  const ready = !hasErrors && !partial;
  const results = useMemo(() => ready ? calculator.calculate(canonical) : [], [calculator,canonical,ready]);
  const base = ready ? amountFromResult(results) : 0;
  const direct = Number(labor || 0) + Number(delivery || 0);
  const taxAmount = (base + direct) * Number(tax || 0) / 100;
  const contingencyAmount = (base + direct + taxAmount) * Number(contingency || 0) / 100;
  const finalCost = base + direct + taxAmount + contingencyAmount;

  function changeField(key: string, next: string) { setValues(old => ({...old, [key]:next}));setSaved(false);setNotice(''); }
  function switchUnits(next: UnitSystem) {
    if (next === unitSystem) return;
    setValues(old => Object.fromEntries(calculator.fields.map(f => {
      const raw = old[f.key];
      if (f.type !== 'number' || !raw || !Number.isFinite(Number(raw))) return [f.key, raw];
      const converted = convertInput(Number(raw), f.unit, unitSystem, next);
      return [f.key, String(Number(converted.toFixed(5)))];
    })));
    setUnitSystem(next);setSaved(false);
  }
  function resetValues() {
    setValues(defaults);setUnitSystem('imperial');setCurrency('USD');setLabor('0');setDelivery('0');setTax('0');setContingency('0');setProjectName('');setEditingId(null);setSaved(false);setNotice('');
    window.history.replaceState({}, '', window.location.pathname);
  }
  function saveEstimate() {
    if (!ready) {setNotice('Correct the highlighted fields before saving.');return;}
    const items = safeReadEstimates();
    const now = new Date().toISOString();
    const item: SavedEstimate = { id: editingId ?? `${Date.now()}-${calculator.slug}`, calculatorSlug:calculator.slug, calculatorTitle:calculator.title, createdAt:now,
      values, results: [...results,{label:'Total project estimate',value:moneyInCurrency(finalCost,currency),emphasis:true}],name: projectName.trim() || `${calculator.shortTitle} project`, currency,unitSystem,
      labor:Number(labor),delivery:Number(delivery),taxPercent:Number(tax),contingencyPercent:Number(contingency) };
    if (!saveEstimates([item,...items.filter(x => x.id !== item.id)])) {setNotice('Browser storage is full or disabled. Please export your estimate.');return;}
    setEditingId(item.id);setSaved(true);setNotice('Estimate saved on this device.');
  }
  const summary = [projectName || calculator.title, ...calculator.fields.map(f => `${f.label}: ${values[f.key]} ${unitLabel(f.unit, unitSystem, currency)}`),
    ...results.map(r => `${r.label}: ${displayMeasuredResult(r.value,currency,unitSystem)}`), `Labor: ${moneyInCurrency(Number(labor),currency)}`, `Delivery: ${moneyInCurrency(Number(delivery),currency)}`,
    `Tax: ${tax}%`, `Contingency: ${contingency}%`, `Project total: ${moneyInCurrency(finalCost,currency)}`, 'Planning estimate only; confirm current local prices.'].join('\n');
  async function copyResult() {if(!ready)return;try{await navigator.clipboard.writeText(summary);setNotice('Estimate copied to clipboard.');}catch{setNotice('Clipboard is unavailable. Try Print / PDF.');}}
  async function shareResult() {if(!ready)return;try{if(navigator.share)await navigator.share({title:projectName||calculator.title,text:summary});else{await navigator.clipboard.writeText(summary);setNotice('Estimate copied — paste it into WhatsApp or email.');}}catch{setNotice('Sharing was cancelled or unavailable.');}}
  function exportCsv() {
    if (!ready)return;
    const rows = [['Project',projectName||calculator.title],['Calculator',calculator.title],['Currency',currency],['Units',unitSystem], ...calculator.fields.map(f => [f.label,`${values[f.key]} ${unitLabel(f.unit,unitSystem,currency)}`]), ...results.map(r=>[r.label,displayMeasuredResult(r.value,currency,unitSystem)]),['Labor',String(labor)],['Delivery',String(delivery)],['Tax percentage',String(tax)],['Contingency percentage',String(contingency)],['Final total',moneyInCurrency(finalCost,currency)]];
    const csv = rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`${calculator.slug}-estimate.csv`;link.click();URL.revokeObjectURL(url);
  }

  const dimension = calculator.fields.filter(f=>f.type==='number' && ['ft','in','sq ft'].includes(f.unit??'') && /(length|width|height)/i.test(f.key));
  const dimA=Number(values[dimension[0]?.key] || 0); const dimB=Number(values[dimension[1]?.key] || 0);
  return <div className="calculator-shell enhanced-calculator">
    <section className="calculator-form-card">
      <div className="calc-card-head"><div><span className="eyebrow">PROJECT INPUTS</span><h2>Build your estimate</h2></div><button type="button" className="text-btn" onClick={resetValues}><RotateCcw size={15}/> Reset</button></div>
      <div className="project-settings">
        <label className="settings-wide">Project name<input value={projectName} onChange={e=>{setProjectName(e.target.value);setSaved(false);}} placeholder="e.g. Kitchen renovation" maxLength={80}/></label>
        <label>Measurements<select value={unitSystem} onChange={e=>switchUnits(e.target.value as UnitSystem)}><option value="imperial">Imperial (ft / in)</option><option value="metric">Metric (m / cm)</option></select></label>
        <label>Local currency<select value={currency} onChange={e=>{setCurrency(e.target.value as CurrencyCode);setSaved(false);}}><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option><option value="CAD">CAD (CA$)</option></select></label>
      </div>
      <p className="settings-hint"><Info size={14}/> Enter supplier prices in the selected currency. Currency selection changes the label, not exchange rates. Converted metric values are approximate.</p>
      <div className="field-grid">
        {calculator.fields.map(field => <label className="field" key={field.key}>
          <span className="field-label">{field.label}</span>
          <div className={`input-wrap ${errors[field.key]?'field-invalid':''}`}>
            {field.type==='select' ? <select value={values[field.key]??''} onChange={e=>changeField(field.key,e.target.value)}>{field.options?.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select>
              : <input type="number" inputMode="decimal" value={values[field.key]??'0'} min="0" max={field.max} step="any" onFocus={e=>e.currentTarget.select()} onChange={e=>changeField(field.key,e.target.value)} aria-invalid={Boolean(errors[field.key])}/>}
            {field.unit&&<span className="unit">{unitLabel(field.unit,unitSystem,currency)}</span>}
          </div>
          {errors[field.key]?<small className="field-error">{errors[field.key]}</small>:field.help&&<small>{field.help}</small>}
        </label>)}
      </div>
      {dimension.length>=2 && <div className="room-preview"><div className="room-preview-title"><Ruler size={16}/><strong>2D area preview</strong><span>Diagram only · not to scale</span></div><div className="room-diagram" style={{width:`${Math.max(110, Math.min(280,dimA>0 && dimB>0 ? 210*Math.sqrt(dimA/Math.max(dimB,.01)):160))}px`,aspectRatio:`${Math.max(0.5,Math.min(2.3,dimA>0&&dimB>0?dimA/dimB:1.5))}`}}><span>{dimA||0} {unitLabel(dimension[0]?.unit,unitSystem,currency)} × {dimB||0} {unitLabel(dimension[1]?.unit,unitSystem,currency)}</span></div></div>}
    </section>
    <aside className="results-card" id="estimate-report">
      <span className="eyebrow light">LIVE ESTIMATE</span><h2>{projectName || 'Your project snapshot'}</h2>
      {!ready ? <div className="validation-panel"><AlertCircle size={19}/><p>{hasErrors?'Correct the highlighted values to calculate safely.':'Enter all required measurements to see your result.'}</p>{extraErrors.map(x=><small key={x}>{x}</small>)}</div>:
        <><div className="result-list">{results.map(r=><div className={`result-row ${r.emphasis?'emphasis':''}`} key={r.label}><span>{r.label}</span><strong>{displayMeasuredResult(r.value,currency,unitSystem)}</strong></div>)}</div>
        <button type="button" className="explainer-toggle" onClick={()=>setShowMath(v=>!v)} aria-expanded={showMath}><Info size={15}/> {showMath?'Hide':'Show'} calculation explanation</button>
        {showMath&&<div className="formula-note"><p>{calculator.intro}</p><p>Measurements are converted to the calculator&apos;s base units before the formula runs. Material quantity includes the allowances listed below.</p><ul>{calculator.assumptions.slice(0,3).map(a=><li key={a}>{a}</li>)}</ul></div>}</>}
      <div className="cost-breakdown"><h3>Advanced cost breakdown</h3><p className="light-caption">Base cost comes from the calculator. Add your local labor, delivery, tax, and contingency.</p>
        <div className="cost-field-grid">
          {[{label:'Labor',val:labor,set:setLabor},{label:'Delivery / extras',val:delivery,set:setDelivery},{label:'Tax (%)',val:tax,set:setTax},{label:'Contingency (%)',val:contingency,set:setContingency}].map(x=><label key={x.label}>{x.label}<input type="number" value={x.val} min="0" step="any" onFocus={e=>e.currentTarget.select()} onChange={e=>{x.set(e.target.value);setSaved(false);}}/></label>)}
        </div>
        <div className="cost-line"><span>Base material / budget</span><strong>{ready?moneyInCurrency(base,currency):'—'}</strong></div>
        <div className="cost-line"><span>Tax</span><strong>{ready?moneyInCurrency(taxAmount,currency):'—'}</strong></div>
        <div className="cost-line"><span>Extra contingency</span><strong>{ready?moneyInCurrency(contingencyAmount,currency):'—'}</strong></div>
        <div className="cost-total"><span>Estimated project total</span><strong>{ready?moneyInCurrency(finalCost,currency):'—'}</strong></div>
        <div className="cost-bar" aria-hidden="true"><span style={{width:`${finalCost>0?100*base/finalCost:0}%`}}/><i style={{width:`${finalCost>0?100*direct/finalCost:0}%`}}/><b style={{width:`${finalCost>0?100*(taxAmount+contingencyAmount)/finalCost:0}%`}}/></div>
      </div>
      <div className="result-actions report-actions">
        <button type="button" className="primary-dark" disabled={!ready} onClick={saveEstimate}>{saved?<Check size={17}/>:editingId?<Save size={17}/>:<Bookmark size={17}/>} {saved?'Saved':editingId?'Update saved':'Save estimate'}</button>
        <button type="button" className="icon-action" disabled={!ready} onClick={()=>window.print()} title="Save to PDF via browser print"><Printer size={17}/> <span>PDF / Print</span></button>
        <button type="button" className="icon-action" disabled={!ready} onClick={copyResult} title="Copy estimate"><Copy size={17}/></button>
        <button type="button" className="icon-action" disabled={!ready} onClick={shareResult} title="Share estimate"><Share2 size={17}/></button>
        <button type="button" className="icon-action" disabled={!ready} onClick={exportCsv} title="Export CSV"><FileDown size={17}/></button>
      </div>
      <p className="settings-hint on-dark">PDF: select <strong>Save as PDF</strong> in the browser Print dialog. Estimates remain private on this browser unless you share them.</p>
      {notice&&<p className="calculator-notice" role="status">{notice}</p>}
      {editingId&&<Link href="/saved" className="saved-return"><Pencil size={14}/> View saved projects</Link>}
      <div className="trust-note"><ShieldCheck size={17}/><span><strong>Planning estimate only.</strong> Verify dimensions, contractor quotes, product labels, local code, and supplier pricing before purchase. This is not a structural design.</span></div>
    </aside>
  </div>;
}
