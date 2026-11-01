import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from '@babel/parser';
import {chromium} from '@playwright/test';
import {messages} from '../src/messages.ts';

// Check every source-language label, including data-driven options and articles.
for(const file of ['src/main.tsx','src/PortalPages.tsx','src/SponsorOverview.tsx','src/WikiPage.tsx','src/BugRiskFields.tsx']){
 const tree=parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['typescript','jsx']});
 function visit(n){
  if(!n||typeof n!=='object')return;
  if((n.type==='StringLiteral'||n.type==='JSXText')&&/[\u3400-\u9fff]/.test(n.value)){
   const key=n.value.trim();
   assert.ok(messages[key],`Missing translation: ${key}`);
   assert.equal(messages[key].length,3);
   for(const translated of messages[key])assert.ok(translated.trim(),`Empty translation: ${key}`);
   assert.notEqual(n.type,'JSXText',`Untranslated JSX text: ${key}`);
  }
  for(const [k,v]of Object.entries(n)){if(['loc','extra'].includes(k))continue;if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v);}
 }
 visit(tree);
}
const executablePath=process.env.BROWSER_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
try {
 await page.goto(url);
 const selector=page.locator('.language-select select');
 assert.equal(await selector.inputValue(),'zh');
 for(const width of [1366,390]){
  await page.setViewportSize({width,height:900});
  for(const language of ['zh','ja','ko','en']){
   await selector.selectOption(language);
   assert.equal(await page.locator('html').getAttribute('lang'),language==='zh'?'zh-CN':language);
   for(let tab=0;tab<4;tab++){
    await page.locator('nav button').nth(tab).click();
    assert.equal(await page.locator('nav button[aria-current="page"]').count(),1);
    assert.ok(await page.locator('main h1').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Horizontal overflow: ${language}, tab ${tab}, ${width}px`);
    if(language==='en'||language==='ko')assert.ok(!/[\u3400-\u9fff]/.test(await page.locator('main').innerText()),`Untranslated content: ${language}, ${tab}`);
    if(tab===2){
     await page.locator('.wiki-card').first().click();
     if(language==='en'||language==='ko')assert.ok(!/[\u3400-\u9fff]/.test(await page.locator('.wiki-article').innerText()));
    }
   }
  }
 }
 // Language switches preserve inputs, option values and selected files.
 await selector.selectOption('zh');
 await page.locator('nav button').nth(1).click();
 await page.locator('input[autocomplete="off"]').fill('旅人_Test');
 await page.locator('input[minlength="5"]').fill('测试反馈标题');
 await page.locator('textarea').first().fill('这里是需要保留的用户问题描述。');
 await page.locator('textarea').nth(1).fill('第一步：进入大厅');
 await page.locator('input[name=risk-experience][value=blocked]').check();
 await page.locator('input[name=risk-data][value=destroyed]').check();
 await page.locator('input[name=risk-others][value=no]').check();
 await page.locator('input[name=risk-difficulty][value=hard]').check();
 await page.locator('input[type="file"]').setInputFiles({name:'原始日志.txt',mimeType:'text/plain',buffer:Buffer.from('test log')});
 await page.locator('input[type="checkbox"]').check();
 await selector.selectOption('en');
 assert.equal(await page.locator('input[autocomplete="off"]').inputValue(),'旅人_Test');
 assert.equal(await page.locator('.risk-fields .risk-grade').getAttribute('data-severity'),'high');
 assert.ok(await page.locator('input[name=risk-data][value=destroyed]').isChecked());
 assert.match(await page.locator('.file-list').innerText(),/原始日志.txt/);
 await page.locator('button[type="submit"]').click();
 assert.match(await page.locator('.receipt').innerText(),/High/);
 assert.equal(await page.locator('select[name=category]').count(),0);
 assert.doesNotMatch(await page.locator('.receipt').innerText(),/Category:|Version:/);
 assert.match(await page.locator('.receipt').innerText(),/这里是需要保留的用户问题描述。/);
 await selector.selectOption('ja');
 assert.match(await page.locator('.receipt').innerText(),/想定重要度：高/);
 await page.reload();assert.equal(await selector.inputValue(),'ja');
 await selector.selectOption('en');await page.locator('nav button').nth(1).click();
 await page.locator('button[type="submit"]').click();
 assert.match(await page.locator('.notice').innerText(),/Enter and confirm/);
 await page.locator('input[type="file"]').setInputFiles({name:'bad.exe',mimeType:'application/octet-stream',buffer:Buffer.from('test')});
 assert.match(await page.locator('.error').innerText(),/Only PNG/);
 await selector.selectOption('ko');assert.match(await page.locator('.error').innerText(),/지원/);
 // Search uses the current language, and article selection survives switching.
 await selector.selectOption('en');await page.locator('nav button').nth(2).click();
 await page.locator('input[type="search"]').fill('TROUBLE AT THE STREAM');
 assert.equal(await page.locator('.wiki-card').count(),1);
 await page.locator('.wiki-card').click();await selector.selectOption('ja');
 assert.match(await page.locator('.wiki-article h2').innerText(),/1-1/);
 // A corrupt stored preference and unavailable storage must not break the page.
 await page.evaluate(()=>localStorage.setItem('mab.website.language','invalid'));
 await page.reload();assert.equal(await selector.inputValue(),'zh');
 const blocked=await browser.newContext();
 await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage unavailable');}});});
 const blockedPage=await blocked.newPage();await blockedPage.goto(url);
 await blockedPage.locator('.language-select select').selectOption('en');
 assert.equal(await blockedPage.locator('html').getAttribute('lang'),'en');
 await blocked.close();
 assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1366,height:1000});await selector.selectOption('en');
 await page.screenshot({path:'language-preview.png',fullPage:true});
 console.log(`PASS: ${Object.keys(messages).length} translations; four languages × four tabs × desktop/mobile; form preservation, file errors, wiki search, persistence and storage fallback.`);
} finally {await browser.close();}
