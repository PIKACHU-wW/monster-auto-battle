import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {catalog} from '../src/wiki/catalog.ts';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 const langs=['zh','en','ja','ko'];
 for(const width of [1366,390]){
  await page.setViewportSize({width,height:950});
  for(const [l,lang] of langs.entries()){
   await page.locator('.language-select select').selectOption(lang);
   for(const id of ['M002','M044','M055']){
    const m=catalog.find(e=>e.id===id);
    await page.locator('.wiki-sections>button').nth(1).click();
    await page.locator('input[type=search]').fill(m.skillName[l]);
    await page.locator(`#wiki-${id}`).click();
    assert.equal(await page.locator('.wiki-star-table tbody tr').count(),12);
    assert.equal(await page.locator('.wiki-star-table thead th').count(),4);
    assert.equal(await page.locator('.wiki-star-skill').count(),3);
    for(let i=0;i<3;i++)assert.equal((await page.locator('.wiki-star-skill').nth(i).locator('p').allTextContents()).join('\n'),m.stars[i].description[l].split('\n').filter(Boolean).join('\n'));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
  }
 }
 await page.locator('.language-select select').selectOption('zh');
 await page.screenshot({path:'wiki-stars-mobile-preview.png',fullPage:true});
 await page.setViewportSize({width:1366,height:1000});
 await page.screenshot({path:'wiki-stars-desktop-preview.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: star table, full three-star skills, skill-name search, four languages and desktop/mobile.');
}finally{await browser.close();}
