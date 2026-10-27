'use client';
import {useState} from 'react';
import {Send} from 'lucide-react';
export default function ContactForm(){
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [error,setError]=useState('');
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setStatus('sending');setError('');
    const formElement=event.currentTarget;
    const payload=Object.fromEntries(new FormData(formElement).entries());
    try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok){const result=await response.json().catch(()=>({error:'Could not send.'}));setError(result.error||'Unable to send right now.');setStatus('error');return;}
      setStatus('success');formElement.reset();
    }catch{setError('Network error. Try again later.');setStatus('error');}
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="two-col"><label>Name<input name="name" required minLength={2} maxLength={100}/></label><label>Email<input name="email" type="email" required maxLength={254}/></label></div>
    <label>Subject<input name="subject" minLength={3} maxLength={150} required/></label>
    <label>Message<textarea name="message" rows={7} minLength={10} maxLength={5000} required/></label>
    <div className="honeypot-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="primary-btn" disabled={status==='sending'}>{status==='sending'?'Sending…':<>Send message <Send size={16}/></>}</button>
    {status==='success'&&<p className="form-success" role="status">Message sent successfully. Thanks!</p>}
    {status==='error'&&<p className="form-error" role="alert">{error}</p>}
  </form>;
}
