import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();
 const response=await page.goto(process.argv[2]||'https://www.pikachuw.site/',{waitUntil:'domcontentloaded',timeout:60000});
 assert.equal(response.status(),200);
 await page.locator('.feedback-link').click();
 assert.equal(await page.locator('dialog input[name=username]').count(),1);
 assert.equal(await page.locator('dialog textarea[name=description]').count(),1);
 assert.equal(await page.locator('dialog input[name=attachments]').count(),1);
 assert.equal(await page.locator('dialog input[name=attachments]').count(),1);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog').count(),0);
 console.log('PASS: website and native feedback form checks.');
}finally{await browser.close();}
