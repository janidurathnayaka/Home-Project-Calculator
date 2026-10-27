'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{const stored=localStorage.getItem('hpc-theme');const active=stored==='dark'||(!stored&&window.matchMedia('(prefers-color-scheme: dark)').matches);setDark(active);document.documentElement.dataset.theme=active?'dark':'light';},[]);
 function toggle(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?'dark':'light';try{localStorage.setItem('hpc-theme',next?'dark':'light');}catch{}}
 return <button type="button" className="theme-toggle" title={dark?'Switch to light mode':'Switch to dark mode'} aria-label={dark?'Switch to light mode':'Switch to dark mode'} onClick={toggle}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button>;
}
