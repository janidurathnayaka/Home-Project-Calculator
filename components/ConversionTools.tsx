'use client';
import {useState} from 'react';
import {ArrowLeftRight} from 'lucide-react';
const factors:{[key:string]:{label:string;metric:string;factor:number}}={ft:{label:'Feet',metric:'Meters',factor:.3048},in:{label:'Inches',metric:'Centimeters',factor:2.54},'sq ft':{label:'Square feet',metric:'Square meters',factor:.09290304},'cu ft':{label:'Cubic feet',metric:'Cubic meters',factor:.0283168466},mi:{label:'Miles',metric:'Kilometers',factor:1.609344}};
export default function ConversionTools(){
 const [unit,setUnit]=useState('ft');const [input,setInput]=useState('0');const [reverse,setReverse]=useState(false);
 const [amount,setAmount]=useState('0');const [rate,setRate]=useState('0');const [from,setFrom]=useState('USD');const [to,setTo]=useState('GBP');
 const validRate=Number(rate)>0 && Number.isFinite(Number(rate));const validAmount=Number.isFinite(Number(amount))&&Number(amount)>=0;
 const rateResult=validRate&&validAmount?Number(amount)*Number(rate):null;
 return <div className="conversion-grid">
  <section className="conversion-card"><h2>Measurement conversion</h2><p>Convert between US customary and metric units.</p><label>Measurement<select value={unit} onChange={e=>setUnit(e.target.value)}>{Object.entries(factors).map(([key,obj])=><option value={key} key={key}>{obj.label} ↔ {obj.metric}</option>)}</select></label>
   <button className="text-btn" type="button" onClick={()=>setReverse(x=>!x)}><ArrowLeftRight size={16}/> Reverse conversion</button>
   <label>{reverse?factors[unit].metric:factors[unit].label}<input type="number" min="0" step="any" value={input} onFocus={e=>e.currentTarget.select()} onChange={e=>setInput(e.target.value)}/></label>
   <div className="conversion-output"><small>{reverse?factors[unit].label:factors[unit].metric}</small><strong>{Number.isFinite(Number(input))&&Number(input)>=0? (reverse?Number(input)/factors[unit].factor:Number(input)*factors[unit].factor).toLocaleString('en-US',{maximumFractionDigits:5}):'Enter a valid number'}</strong></div>
  </section>
  <section className="conversion-card"><h2>Currency conversion</h2><p>Enter an exchange rate yourself, based on a current and trusted source. This site does <strong>not</strong> retrieve live rates.</p>
   <div className="conversion-two"><label>From<select value={from} onChange={e=>setFrom(e.target.value)}>{['USD','GBP','CAD'].map(x=><option key={x}>{x}</option>)}</select></label><label>To<select value={to} onChange={e=>setTo(e.target.value)}>{['USD','GBP','CAD'].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <label>Amount ({from})<input type="number" value={amount} min="0" step="any" onChange={e=>setAmount(e.target.value)}/></label>
   <label>Rate: 1 {from} equals how many {to}?<input type="number" value={rate} min="0" step="any" onFocus={e=>e.currentTarget.select()} onChange={e=>setRate(e.target.value)}/></label>
   <div className="conversion-output"><small>Converted amount ({to})</small><strong>{rateResult===null?'Enter a positive exchange rate':new Intl.NumberFormat('en-US',{style:'currency',currency:to}).format(rateResult)}</strong></div>
   <small>Rates fluctuate. This is arithmetic based only on the rate you provide; no forex advice is implied.</small>
  </section>
 </div>;
}
