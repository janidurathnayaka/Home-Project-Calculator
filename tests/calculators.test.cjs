const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Minimal TypeScript loader for independent calculator unit tests; no extra dependency.
require.extensions['.ts'] = (module, filename) => {
 const source = fs.readFileSync(filename, 'utf8');
 const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 module._compile(js,filename);
};
const { calculators } = require('../lib/calculators.ts');
const { validateInputs, amountFromResult, displayMeasuredResult } = require('../lib/project-tools.ts');

test('15 unique calculators have all numeric defaults set to zero',()=>{
 assert.equal(calculators.length,15);
 const ids=calculators.map(c=>c.slug);assert.equal(new Set(ids).size,15);
 for(const calc of calculators){for(const f of calc.fields.filter(f=>f.type==='number'))assert.equal(f.defaultValue,0,`${calc.slug}: ${f.key}`);}
});
test('all calculators handle zero-filled and positive input without NaN or Infinity',()=>{
 for(const calc of calculators){
  const values=Object.fromEntries(calc.fields.map(f=>[f.key,f.defaultValue]));
  const zero=calc.calculate(values);
  assert.ok(zero.length>0,calc.slug);
  assert.ok(zero.every(r=>!/(?:NaN|Infinity|undefined)/.test(r.value)),calc.slug+' with zeros');
  const positive=Object.fromEntries(calc.fields.map(f=>[f.key,f.type==='select'?f.defaultValue:Math.max(f.min||1,1)]));
  const results=calc.calculate(positive);
  assert.ok(results.every(r=>!/(?:NaN|Infinity|undefined)/.test(r.value)),calc.slug+' with values');
 }
});
test('tile box purchasing rounds up accurately',()=>{
 const calc=calculators.find(c=>c.slug==='tile-calculator');
 const result=calc.calculate({length:10,width:8,waste:12,boxCoverage:15.5,boxPrice:42});
 assert.equal(result.find(r=>r.label==='Boxes to buy').value,'6');
 assert.equal(result.find(r=>r.label==='Estimated tile cost').value,'$252');
});
test('paint, drywall and paver material quantities',()=>{
 const paint=calculators.find(c=>c.slug==='paint-calculator').calculate({length:14,width:12,height:8,doors:1,windows:2,coats:2,coverage:350,waste:10,price:45});
 assert.equal(paint.find(r=>r.label==='Buy').value,'3 gallons');
 const drywall=calculators.find(c=>c.slug==='drywall-calculator').calculate({wallLength:20,wallHeight:8,doors:0,windows:0,sheetArea:32,waste:10,sheetPrice:15});
 assert.equal(drywall.find(r=>r.label==='Sheets to buy').value,'6');
 const pavers=calculators.find(c=>c.slug==='paver-calculator').calculate({length:10,width:10,paverLength:12,paverWidth:12,waste:10,price:2});
 assert.equal(pavers.find(r=>r.label==='Pavers to buy').value,'110');
});
test('reject invalid negative, overmax, and missing input',()=>{
 const calc=calculators.find(c=>c.slug==='tile-calculator');
 const vals={length:'-2',width:'',waste:'90',boxCoverage:'1',boxPrice:'10'};
 const errors=validateInputs(calc,vals);
 assert.ok(errors.length);assert.ok(errors.width);assert.ok(errors.waste);
});
test('currency and metric result formatting',()=>{
 assert.equal(amountFromResult([{label:'Estimated tile cost',value:'$252'}]),252);
 assert.equal(displayMeasuredResult('100 sq ft','USD','metric'),'9.29 m²');
 assert.equal(displayMeasuredResult('$1,250','GBP','imperial'),'£1,250');
});
