import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>console.log('ERROR',e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text())});
await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(4000);
await page.screenshot({path:'background-content-preview.png'});
await page.addStyleTag({content:'header,main,footer{visibility:hidden}body{min-height:5000px}'});
for(const [name,y] of [['forest',0],['passage',750],['palace',1550]]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(2500);console.log(name,await page.locator('.world-background').evaluate(e=>({...e.dataset})));await page.screenshot({path:`background-${name}-preview.png`});}
await browser.close();
