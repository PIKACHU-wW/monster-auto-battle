import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const url='https://pikachu-ww.github.io/monster-auto-battle/';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(url))errors.push(`${r.status()} ${r.url()}`)});
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
 assert.equal(response.status(),200);
 assert.equal(await page.title(),'Monster Auto Battle | Wiki');
 await page.locator('.wiki-card').first().waitFor();
 await page.locator('.tavern-scene').waitFor();
 assert.equal(await page.locator('.tavern-plaque').count(),1);
 await page.locator('.hero-dragon').evaluate(i=>i.decode());
 await page.locator('.feedback-link').click();
 assert.equal(await page.locator('dialog a.hero-cta').getAttribute('href'),'https://github.com/PIKACHU-wW/monster-auto-battle/issues/new/choose');
 await page.keyboard.press('Escape');
 for(const lang of ['en','ja','ko','zh']) await page.locator('.language-select select').selectOption(lang);
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);
 console.log('PASS: live HTTPS wiki, title, JS/CSS, hero image, cards, feedback link, four languages, mobile layout.');
}finally{await browser.close();}
