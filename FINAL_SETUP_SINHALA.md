# Home Project Calculator – Final Edition (සිංහල Setup Guide)

## 1. Requirements
- Windows 10/11 / macOS / Linux
- Node.js 22 LTS හෝ Next.js 16 සඳහා සහාය දෙන නවතම Node.js version එකක්
- VS Code / Terminal
- Internet (පළමු `npm install` සඳහා)

## 2. Open the correct folder
ZIP එක Extract කළ පසු `package.json` **ඇති** `home-project-calculator-final` folder එක VS Code වලින් Open කරන්න.

PowerShell:
```powershell
cd "C:\Users\janid\Desktop\home-project-calculator-final"
npm install
Copy-Item .env.example .env.local
npm run dev
```
`cd` path එක ඔයා Extract කළ තැනට ගැළපෙන ලෙස වෙනස් කරන්න.

Browser: http://localhost:3000

> `ENOENT package.json` error ආවොත් `Get-ChildItem -Name` Run කරලා `package.json` තියෙන folder එකට යන්න.

## 3. Test / Build
```powershell
npm run check
npm test
npm run build
npm run start
```

## 4. Included Working Features
- Calculators 15 (පරණ 12 + Drywall, Wallpaper, Pavers)
- සියලුම numeric fields මුලින් `0`
- Live results + Input Validation
- Advanced Cost Breakdown (labor, delivery, tax, extra contingency)
- Browser Print -> **Save as PDF**, CSV Export, Copy, Share
- Saved estimates: Save, Edit, Rename, Compare, Delete, JSON Backup/Restore
- Search Calculators
- Metric/Imperial input unit switch and common displayed-result conversions
- USD/GBP/CAD local price labels + **manual-rate** currency converter
- 2D rectangle preview (only relevant calculators; illustrative, not to scale)
- Light/Dark Mode
- Project Planning Assistant (checklist fallback; optional AI)
- Contact Form (requires email service setup)
- SEO metadata, sitemap, robots, structured data, analytics/ad placeholders
- Automated calculator tests (6 test groups)

## 5. Optional AI assistant
`.env.local`:
```dotenv
OPENAI_API_KEY=YOUR_KEY_HERE
OPENAI_MODEL=gpt-4.1-mini
```
Key එකක් නැත්නම් Assistant Page එකෙන් rule-based planning checklist පමණක් ලැබෙනවා.
API KEY එක කවදාවත් `NEXT_PUBLIC_` ලෙස සකස් කරන්න එපා. Cloud hosting එකේත් server-side secret ලෙස දාන්න.
AI API calls වියදම් ඇති විය හැක. Public launch එකකට පෙර server-side rate limiting / abuse protection වඩා ශක්තිමත් කරන්න.

## 6. Contact email (optional)
`.env.local`:
```dotenv
RESEND_API_KEY=YOUR_KEY_HERE
CONTACT_TO_EMAIL=your-inbox@example.com
CONTACT_FROM_EMAIL=Home Project Calculator <hello@your-verified-domain.com>
```
Resend හි verified sending domain එකක් අවශ්‍යයි. Config නොකළොත් Form එක Success කියලා ව්‍යාජ ලෙස පෙන්වන්නේ නැහැ.

## 7. Production domain
```dotenv
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
Vercel හෝ වෙනත් Node/Next.js Hosting එකක් භාවිත කරන්න. GitHub repo එකට `.env.local`, `.next`, `node_modules` Commit කරන්න එපා.

## 8. Important limitations / සැබෑ සීමාවන්
- **PDF:** Separate PDF package එකක් භාවිත නොකර, Browser Print dialog එකෙන් `Save as PDF` කළ යුතුයි.
- **Currency:** USD, GBP, CAD අතර Live FX API නැහැ. Calculator prices තෝරාගත් currency එකේම user ඇතුළත් කළ යුතුයි. Converter එකේ Rate එක User ඇතුළත් කරන එකක්.
- **Saved projects:** මේවා Browser localStorage වල තියෙන්නේ. වෙනත් device එකකට Sync වෙන්නේ නැහැ. Cloud accounts / MongoDB / Authentication තවම Implement කරලා නැහැ. JSON Backup එක Save කරගන්න.
- **Assistant:** API Key නැතිනම් සාමාන්‍ය Checklist පමණක්. AI configured නම් external provider integration එක active වෙනවා.
- **Ads and Analytics:** Google Analytics / AdSense credentials සහ approval අවශ්‍යයි.
- **Newsletter:** ව්‍යාජ signup success එක ඉවත් කරලා guides link එකක් දාලා තියෙනවා. Email collection service එකක් තවම නැහැ.
- **Estimate accuracy:** Planning purposes පමණයි. Prices, installation methods, permits, codes, structural work professional review අවශ්‍යයි.
- **Production build:** මෙම artifact සකස් කළ Linux environment එකට Next.js native SWC package Download කරන්න network access නැති වුණා. TypeScript check සහ calculation unit tests සාර්ථකයි; `npm run build` ඔයාගේ Windows PC එකේ run කරලා confirm කරන්න.

## 9. Technical security note
Contact form සහ assistant එකට basic in-memory rate limits තියෙනවා. Multi-instance serverless production deployment එකකදී Redis/KV backed rate limiter, bot challenge, domain verification සහ monitoring එකතු කළ යුතුයි.

## 10. How to change calculator code
- Calculator definitions/formulas: `lib/calculators.ts`
- Interactive calculation UI: `components/CalculatorClient.tsx`
- Validation / conversion / saving helpers: `lib/project-tools.ts`
- Site design & responsive: `app/globals.css`
- Saved projects UI: `components/SavedEstimates.tsx`
- Search: `components/CalculatorSearch.tsx`
- Assistant: `app/api/assistant/route.ts`, `components/ProjectAssistant.tsx`
- Environment setup: `.env.example` -> `.env.local`

හැම වෙනසකටම පසුව `npm run check`, `npm test`, `npm run dev` Run කරන්න.
