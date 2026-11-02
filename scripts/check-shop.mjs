import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.argv[2]||'http://127.0.0.1:8876/';
 const ids=['scene_elven','scene_celestial','wand_elven','wand_celestial','bundle_elven','bundle_celestial','dragon_blessing'];
 for(const [i,id] of ids.entries()){
  await page.goto(base+'#shop/'+id);await page.locator('.shop-detail').waitFor();
  if(i<6)await expect(page.locator('.shop-detail .shop-price')).toHaveText(i<2?'$9 USD / ¥60 CNY':i<4?'$4 USD / ¥27 CNY':'$11 USD / ¥73 CNY');
  assert.equal(await page.locator('.archive-hero').count(),0);
  assert.equal(await page.locator('.shop-detail .payment-links a').count(),2);
  for(const lang of ['zh','en','ja','ko']){await page.locator('.language-select select').selectOption(lang);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 }
 await page.reload();await page.locator('.shop-detail').waitFor();
 await page.locator('.portal-tabs a[href="#feedback"]').click();await page.locator('.feedback-link').waitFor();
 await page.locator('.portal-tabs a[href="#wiki"]').click();await page.locator('.wiki-sections').waitFor();
 await page.locator('.portal-tabs a[href="#support"]').click();await page.locator('.archive-hero').waitFor();
 assert.equal(await page.locator('.shop-page .support-grid article').count(),7);assert.deepEqual(errors,[]);
 console.log('PASS: 7 deep links, prices, refresh, mobile 4 languages, feedback/wiki navigation.');
}finally{await browser.close();}
