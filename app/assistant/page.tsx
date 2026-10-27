import type { Metadata } from 'next';
import ProjectAssistant from '@/components/ProjectAssistant';
export const metadata:Metadata={title:'Project Planning Assistant',description:'Get project-planning checklists and optional AI-based guidance for home improvement.' ,alternates:{canonical:'/assistant'}};
export default function AssistantPage(){return <div className="container page-shell narrow-page"><div className="page-hero compact"><span className="eyebrow">BEFORE YOU BUY</span><h1>Project planning assistant</h1><p>Start with a simple checklist and ask general questions about measurement, materials and budgets.</p></div><ProjectAssistant/></div>}
