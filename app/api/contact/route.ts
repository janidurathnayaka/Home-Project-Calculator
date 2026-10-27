import { NextResponse } from 'next/server';

const WINDOW_MS=60_000;
const buckets=new Map<string,{count:number;until:number}>();
export async function POST(request:Request){
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'anonymous';
  const now=Date.now();const bucket=buckets.get(ip);
  if(bucket&&bucket.until>now&&bucket.count>=4)return NextResponse.json({error:'Please try again later.'},{status:429});
  buckets.set(ip,{count:bucket&&bucket.until>now?bucket.count+1:1,until:bucket&&bucket.until>now?bucket.until:now+WINDOW_MS});
  try{
    if(Number(request.headers.get('content-length')||'0')>12000)return NextResponse.json({error:'Request too large.'},{status:413});
    const payload:unknown=await request.json();if(!payload||typeof payload!=='object'||Array.isArray(payload))return NextResponse.json({error:'Invalid form.'},{status:400});
    const form=payload as Record<string,unknown>;
    if(typeof form.website==='string'&&form.website.trim())return NextResponse.json({ok:true}); // honeypot
    const name=typeof form.name==='string'?form.name.trim():'';
    const email=typeof form.email==='string'?form.email.trim():'';
    const subject=typeof form.subject==='string'?form.subject.trim():'';
    const message=typeof form.message==='string'?form.message.trim():'';
    if(name.length<2||name.length>100||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||email.length>254||subject.length<3||subject.length>150||message.length<10||message.length>5000)
      return NextResponse.json({error:'Please check your name, email, subject and message.'},{status:400});
    const key=process.env.RESEND_API_KEY;const to=process.env.CONTACT_TO_EMAIL;const from=process.env.CONTACT_FROM_EMAIL;
    if(!key||!to||!from)return NextResponse.json({error:'Email service not configured.'},{status:503});
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({from,to:[to],reply_to:email,subject:`Home Project Calculator: ${subject}`,text:`From: ${name} <${email}>\n\n${message}`})});
    if(!response.ok)return NextResponse.json({error:'Mail provider error.'},{status:502});
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Unexpected error.'},{status:500});}
}
