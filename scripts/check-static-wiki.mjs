import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '@playwright/test';
const root=path.resolve('dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 // Static asset/layout checks use read-only API fixtures. Full backend behavior
 // is verified separately by check-feedback-flow.mjs against the real service.
 if(pathname==='/api/feedback/progress'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({items:[]}));return;}
 if(pathname==='/api/feedback/config'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({rules:{scores:{low:10,medium:30,high:80,critical:150},titles:[]}}));return;}
 if(!pathname.startsWith('/test-wiki/')){res.writeHead(404).end();return;}
 const file=path.resolve(root,pathname.slice('/test-wiki/'.length)||'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(`http://127.0.0.1:${server.address().port}/test-wiki/`);
 await page.locator('.hero-dragon').evaluate(img=>img.decode());
 assert.equal(await page.locator('svg.tavern-scene').count(),1);
 assert.equal(await page.locator('img.tavern-scene').count(),0);
 assert.equal(await page.title(),'Monster Auto Battle | Wiki');
 assert.equal(await page.locator('.wiki-card').count(),12);
 assert.equal(await page.locator('canvas').count(),0);
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
 await page.screenshot({path:'wiki-static-desktop-preview.png',fullPage:true});
 await page.locator('#wiki-M001').click();assert.equal(await page.locator('.wiki-star-table tbody tr').count(),12);
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const language of ['zh','en','ja','ko']){
   await page.locator('.language-select select').selectOption(language);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}/${language}`);
   await page.locator('.feedback-link').click();assert.ok(await page.locator('dialog').isVisible());
 assert.equal(await page.locator('dialog input[name=username]').count(),1);
 assert.equal(await page.locator('dialog textarea[name=description]').count(),1);
 assert.equal(await page.locator('dialog input[name=attachments]').count(),1);
   await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);
  }
 }
 await page.locator('.language-select select').selectOption('zh');await page.locator('.wiki-sections>button').nth(2).click();
 await page.locator('.trait-expansion img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
 await page.locator('.wiki-sections>button').nth(3).click();
 let sigilCount=0;
 for(let i=0;i<6;i++){
  const icons=page.locator('.wiki-card-heading img');
  sigilCount+=await icons.count();
  await icons.evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
  if(i===0)await page.screenshot({path:'wiki-sigil-gallery-preview.png',fullPage:true});
  if(i<5)await page.locator('.wiki-pagination button').last().click();
 }
 assert.equal(sigilCount,64);
 await page.locator('.wiki-card').first().click();
 await page.locator('.wiki-detail-header img').evaluate(img=>img.decode());
 assert.ok(await page.locator('.wiki-stat-icon').count()>0);
 await page.locator('.wiki-sections>button').nth(1).click();await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'wiki-static-mobile-preview.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: built wiki at /test-wiki/; assets, 4 languages, 3 viewports, monster stats, trait frames, sigil atlas, feedback modal, Escape.');
}finally{await browser.close();server.close();}
