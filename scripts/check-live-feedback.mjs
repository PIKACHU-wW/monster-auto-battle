import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();
 const response=await page.goto('https://pikachu-ww.github.io/monster-auto-battle/',{waitUntil:'domcontentloaded',timeout:60000});
 assert.equal(response.status(),200);
 await page.locator('.feedback-link').click();
 assert.equal(await page.locator('.feedback-github').getAttribute('href'),'https://github.com/PIKACHU-wW/monster-auto-battle/issues/new/choose');
 assert.equal(await page.locator('.feedback-gitee').getAttribute('href'),'https://gitee.com/wanheiqiyihu/monster-auto-battle/issues/new');
 assert.equal(await page.locator('.security-contact').count(),1);
 assert.equal(await page.locator('a[href^="mailto:"]').count(),1);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog').count(),0);
 console.log('PASS: live GitHub + Gitee feedback links, high-priority email pending, Escape.');
}finally{await browser.close();}
