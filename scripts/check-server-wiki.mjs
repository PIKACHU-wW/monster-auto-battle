import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.argv[2]||'http://124.156.175.129/';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base,{waitUntil:'networkidle',timeout:60000});
 assert.equal(response.status(),200);
 await page.locator('.hero-art img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));});
 for(const lang of ['zh','en','ja','ko']){
  await page.locator('.language-select select').selectOption(lang);
  for(let i=0;i<4;i++){
   await page.locator('.wiki-sections>button').nth(i).click();
   assert.ok(await page.locator('.wiki-card').count()>0);
  }
 }
 await page.locator('.feedback-link').click();
 assert.equal(await page.locator('dialog textarea[name=description]').count(),1);
 assert.equal(await page.locator('dialog input[name=attachments]').count(),1);
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);
 console.log('PASS: website and native feedback form checks.');
} finally {await browser.close();}
