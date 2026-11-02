import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.argv[2]||'http://127.0.0.1:8876/';
 await page.goto(base,{waitUntil:'networkidle'});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(const lang of ['zh','en','ja','ko']){
   await page.locator('.language-select select').selectOption(lang);
   await page.locator('.portal-tabs a[href="#support"]').click();
   await expect(page.locator('.portal-tabs a[aria-current=page]')).toHaveAttribute('href','#support');
   assert.equal(await page.locator('.payment-links a').nth(0).getAttribute('href'),'https://afdian.com/a/pikachu123');
   assert.equal(await page.locator('.payment-links a').nth(1).getAttribute('href'),'https://ko-fi.com/pikachu42802');
   assert.equal(await page.locator('.support-grid article').count(),7);
   await page.locator('.portal-tabs a[href="#feedback"]').click();
   await page.locator('.feedback-link').click();await page.locator('dialog input[name=username]').waitFor({state:'visible'});
   await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);
   await page.locator('#repairs').waitFor();
   await page.locator('.portal-tabs a[href="#wiki"]').click();await page.locator('.wiki-sections button').first().waitFor();
   assert.equal(await page.locator('.wiki-sections button').count(),4);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
 }
 await page.reload();assert.equal(await page.locator('.portal-tabs a[aria-current=page]').getAttribute('href'),'#wiki');
 await page.goto(base);await expect(page.locator('.portal-tabs a[aria-current=page]')).toHaveAttribute('href','#support');
 await page.locator('.language-select select').selectOption('zh');
 await page.screenshot({path:'portal-preview.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS: default support, payment URLs, three pages, feedback form, wiki, 4 languages, mobile/desktop, hash reload.');
}finally{await browser.close();}
