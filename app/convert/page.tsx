import type {Metadata} from 'next';
import ConversionTools from '@/components/ConversionTools';
export const metadata:Metadata={title:'Measurement and Currency Converter',description:'Convert feet and meters or estimate a currency conversion with your own exchange rate.',alternates:{canonical:'/convert'}};
export default function ConvertPage(){return <div className="page-shell container"><div className="page-hero compact"><span className="eyebrow">HANDY UTILITIES</span><h1>Units & currency converter</h1><p>Change measurements or convert a budget using the exchange rate you enter.</p></div><ConversionTools/></div>}
