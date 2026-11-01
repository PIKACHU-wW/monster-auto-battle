import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {catalog} from '../src/wiki/catalog.ts';
const counts={quests:12,monsters:55,traits:23,equipment:64};
for(const [category,count]of Object.entries(counts))assert.equal(catalog.filter(e=>e.category===category).length,count);
for(const e of catalog){
 for(const field of ['title','summary','description','group']){assert.equal(e[field].length,4);e[field].forEach(s=>assert.ok(s.trim()));for(const i of [1,3])assert.ok(!/[\u3400-\u9fff]/.test(e[field][i]),`Untranslated ${e.id} ${field}`);}
 if(e.image)assert.ok(fs.existsSync(`public/${e.image.replace(/^\.\//, "")}`));
 for(const id of e.related){const target=catalog.find(a=>a.id===id);assert.ok(target);if(e.category==='traits')assert.ok(target.related.includes(e.id));}
}
assert.equal(catalog.find(e=>e.id==='quest-1').facts.find(f=>f.label==='首次金币').value,'100');
assert.equal(catalog.find(e=>e.id==='TR_trio_rabbit').related.length,3);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1366,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 const languages=page.locator('.language-select select'),sections=page.locator('.wiki-sections>button');
 assert.equal(await sections.count(),4);
 for(const lang of ['zh','en','ja','ko']){
  await languages.selectOption(lang);
  for(let c=0;c<4;c++){
   await sections.nth(c).click();assert.equal(await page.locator('.wiki-card').count(),12);
   await page.locator('.wiki-guide summary').click();
   if(lang==='en'||lang==='ko')assert.ok(!/[\u3400-\u9fff]/.test(await page.locator('main').innerText()));
   await page.locator('.wiki-card').first().click();assert.ok(await page.locator('.wiki-facts').first().isVisible());
   if(lang==='en'||lang==='ko')assert.ok(!/[\u3400-\u9fff]/.test(await page.locator('.wiki-article').innerText()));
  }
 }
 await languages.selectOption('zh');await sections.nth(1).click();
 await page.locator('input[type=search]').fill('跃足虫');assert.equal(await page.locator('.wiki-card').count(),1);
 await page.locator('.wiki-card').click();assert.match(await page.locator('.wiki-article').innerText(),/跳跃|跃向/);
 await languages.selectOption('en');assert.match(await page.locator('.wiki-article h2').innerText(),/Leaping Bug/);
 await page.locator('.wiki-related button').first().click();assert.match(await page.locator('.wiki-article h2').innerText(),/Swarm/);
 assert.ok(await page.locator('.wiki-related button').count()>1);
 await sections.nth(1).click();await page.locator('.wiki-pagination button').last().click();assert.match(await page.locator('.wiki-pagination span').innerText(),/2 \/ 5/);
 await page.locator('input[type=search]').fill('does-not-exist-999');assert.equal(await page.locator('.wiki-card').count(),0);await page.locator('.empty button').click();assert.equal(await page.locator('.wiki-card').count(),12);
 await sections.nth(2).click();await languages.selectOption('zh');await page.locator('.wiki-library-tools select').selectOption('特殊羁绊');assert.equal(await page.locator('.wiki-card').count(),2);
 await page.locator('.wiki-card').first().click();assert.equal(await page.locator('.wiki-related button').count(),3);
 await page.screenshot({path:'wiki-detail-preview.png',fullPage:true});
 await sections.nth(1).click();await page.screenshot({path:'wiki-desktop-preview.png',fullPage:true});
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});
  for(const lang of ['en','ja','ko','zh']){await languages.selectOption(lang);for(let c=0;c<4;c++){await sections.nth(c).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.wiki-card').first().click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}}
 }
 await page.setViewportSize({width:390,height:844});await sections.nth(0).click();await page.screenshot({path:'wiki-mobile-preview.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: 154 entries, 142 icons, four-language content, member links, rewards, filtering, pagination, language preservation, and responsive detail views.');
}finally{await browser.close();}
