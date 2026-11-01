import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {catalog} from '../src/wiki/catalog.ts';
const source=JSON.parse(fs.readFileSync('../Monster Auto Battler2/Docs/GameDesign/Roster/traits.json','utf8'));
const traits=catalog.filter(e=>e.category==='traits');
assert.deepEqual(traits.map(e=>e.id).sort(),Object.keys(source.traits).sort());
assert.ok(!catalog.some(e=>e.id==='TR_dragonline'||e.related.includes('TR_dragonline')));
const roster=JSON.parse(fs.readFileSync('../Monster Auto Battler2/Docs/GameDesign/TraitDensityReview_20261028/v2/proposal.json','utf8')).members;
const monsters=catalog.filter(e=>e.category==='monsters');
assert.equal(monsters.length,55);
assert.equal(monsters.reduce((n,e)=>n+e.related.length,0),139);
for(const monster of monsters){
 assert.deepEqual([...monster.related].sort(),[...roster[monster.id]].sort(),monster.id);
 assert.ok(monster.related.length>=2&&monster.related.length<=3);
}
for(const trait of traits)assert.deepEqual([...trait.related].sort(),monsters.filter(m=>m.related.includes(trait.id)).map(m=>m.id).sort(),trait.id);
for(const entry of traits){
 assert.deepEqual(entry.traitTiers.map(t=>t.count),source.traits[entry.id].tiers);
 for(const tier of entry.traitTiers)for(const text of tier.description){assert.ok(text.trim());assert.ok(!/\{\w+\}/.test(text));}
}
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1366,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 const sections=page.locator('.wiki-sections>button'),languages=page.locator('.language-select select');
 for(const [i,language] of ['zh','en','ja','ko'].entries()){
  await languages.selectOption(language);await sections.nth(2).click();
  assert.equal(await page.locator('.trait-expansion-card').count(),9);
  for(const card of await page.locator('.trait-expansion-card').all()){
   const id='TR_'+await card.getAttribute('data-expansion-trait');const entry=catalog.find(e=>e.id===id);
   const buttons=card.locator('.trait-count-options button');
   for(let j=0;j<await buttons.count();j++){
    await buttons.nth(j).click();assert.equal(await buttons.nth(j).getAttribute('aria-pressed'),'true');
    const grade=j===0?'inactive':j===entry.traitTiers.length?'gold':'bronze';
    assert.equal(await card.locator('[data-frame]').getAttribute('data-frame'),grade);
    if(j)assert.equal(await card.locator('.trait-selected-effect>p').last().innerText(),entry.traitTiers[j-1].description[i]);
   }
   await card.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>img.decode()));});
  }
  const solitary=page.locator('[data-expansion-trait=solitary]');await solitary.locator('.trait-detail-link').click();
  assert.equal(await page.locator('.wiki-article h2').innerText(),catalog.find(e=>e.id==='TR_solitary').title[i]);
  assert.equal(await page.locator('.wiki-related button').count(),5);assert.equal(await page.locator('.wiki-trait-tiers .wiki-star-skill').count(),2);
  await sections.nth(1).click();assert.equal(await page.locator('.wiki-trait-chip[data-trait]').count(),23);
  await page.locator('[data-trait=TR_sylvan]').click();assert.equal(await page.locator('.wiki-card').count(),5);
  await page.locator('[data-trait=TR_solitary]').click();assert.equal(await page.locator('.wiki-card').count(),0);
  await page.locator('[data-trait=TR_sylvan]').click();
  await page.locator('[data-trait=TR_deep]').click();assert.equal(await page.locator('.wiki-card').count(),1);assert.equal(await page.locator('.wiki-card').getAttribute('id'),'wiki-M009');
 }
 await languages.selectOption('zh');await sections.nth(2).click();
 await page.locator('.trait-expansion').screenshot({path:'wiki-current-traits-preview.png'});
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});
  for(const language of ['zh','en','ja','ko']){await languages.selectOption(language);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: current trait IDs/tiers/members; 9 featured traits and 25 states in four languages; tier effects, frames, images, detail links, AND filters and mobile layout.');
}finally{await browser.close();}
