import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1366,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');await page.locator('nav button').nth(1).click();
 const pick=async(field,value)=>page.locator(`input[name="risk-${field}"][value="${value}"]`).check();
 const grade=()=>page.locator('.risk-fields .risk-grade').getAttribute('data-severity');
 assert.equal(await page.locator('.risk-fields fieldset').count(),4);assert.equal(await page.locator('.risk-fields input:checked').count(),0);assert.equal(await page.locator('.risk-grade').count(),0);
 await page.locator('input[autocomplete=off]').fill('Risk_Tester');await page.locator('input[minlength="5"]').fill('分级标签测试标题');await page.locator('textarea').first().fill('这是一段用于检查表单分级逻辑的问题描述。');await page.locator('input[type=checkbox]').check();
 await page.locator('button[type=submit]').click();assert.equal(await page.locator('.receipt').count(),0);assert.match(await page.locator('.notice').innerText(),/4/);
 await pick('experience','cosmetic');await pick('data','none');await pick('others','no');await pick('difficulty','easy');assert.equal(await grade(),'low');
 await pick('experience','impaired');assert.equal(await grade(),'medium');await pick('experience','blocked');assert.equal(await grade(),'high');await pick('difficulty','hard');assert.equal(await grade(),'medium');
 await pick('data','destroyed');assert.equal(await grade(),'high');await pick('experience','none');await pick('data','none');await pick('others','yes');assert.equal(await grade(),'high');
 await page.locator('button[type=submit]').click();assert.equal(await page.locator('.receipt .risk-grade').getAttribute('data-severity'),'high');assert.equal(await page.locator('.receipt .risk-tags-summary>div').count(),4);
 await pick('others','no');assert.equal(await grade(),'low');assert.equal(await page.locator('.receipt .risk-grade').getAttribute('data-severity'),'high','Receipt must preserve the submitted snapshot');
 await pick('data','unknown');assert.equal(await grade(),'medium');assert.ok(await page.locator('.risk-fields .risk-review').isVisible());
 for(const width of [1366,390]){await page.setViewportSize({width,height:900});for(const language of ['en','ja','ko','zh']){await page.locator('.language-select select').selectOption(language);assert.equal(await grade(),'medium');assert.ok(await page.locator('input[name=risk-data][value=unknown]').isChecked());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));if(language==='en'||language==='ko')assert.ok(!/[\u3400-\u9fff]/.test(await page.locator('.risk-fields').innerText()));}}
 await page.locator('.risk-fields').screenshot({path:'risk-mobile-preview.png'});await page.setViewportSize({width:1366,height:1000});await page.locator('.risk-fields').screenshot({path:'risk-desktop-preview.png'});
 assert.deepEqual(errors,[]);console.log('PASS: four required tags, live grades, unknowns, immutable receipt snapshot, language preservation and responsive layout.');
}finally{await browser.close();}
