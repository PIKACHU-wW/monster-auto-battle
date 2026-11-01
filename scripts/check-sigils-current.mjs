import assert from 'node:assert/strict';
import fs from 'node:fs';
import {catalog} from '../src/wiki/catalog.ts';
const root='../Monster Auto Battler2/Docs/GameDesign/Roster/';
const sigils=JSON.parse(fs.readFileSync(root+'sigils.json','utf8')).sigils;
const loot=JSON.parse(fs.readFileSync(root+'sigil_loot.json','utf8')).sigils;
const rows=fs.readFileSync(root+'sigil_base_stats_v2.csv','utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/).slice(1).map(line=>line.split(','));
const entries=catalog.filter(e=>e.category==='equipment');
assert.equal(entries.length,64);assert.equal(rows.length,64);
assert.deepEqual(entries.reduce((a,e)=>(a[e.group[0]]=(a[e.group[0]]??0)+1,a),{}),{'战斗契印':40,'禁忌契印':8,'生态契印':16});
let redesigned=0;
for(const e of entries){
 const source=sigils[e.id],row=rows.find(r=>r[0]===e.id);
 assert.equal(e.baseStats.length,source.base_stats.length);
 for(const [i,s] of source.base_stats.entries()){
  assert.equal(s.notes,row[3+i*2]);assert.equal(s.base,Number(row[4+i*2]));
  const displayed=e.baseStats[i].value;
  for(const v of typeof displayed==='string'?[displayed]:displayed)assert.equal(parseFloat(v),s.base);
 }
 assert.equal(Number(e.facts.find(f=>f.label==='解锁回合').value),loot[e.id].unlock_round);
 assert.ok(!/援军|reinforcement|援軍|지원군/i.test(JSON.stringify(e)));
 for(const [i,lang] of ['zh','en','ja','ko'].entries()){
  const locale=JSON.parse(fs.readFileSync(`../Monster Auto Battler2/Assets/Localization/Monsters/${lang}.json`,'utf8'));
  const original=locale[`sigil.${e.id}.desc`].replace(/<[^>]+>/g,'');
  assert.equal(e.title[i],locale[`sigil.${e.id}.name`]);
  assert.ok(original.includes(e.description[i]));
  assert.ok(e.description[i].trim().length>0);
  assert.ok(!/[{}]|undefined|NaN/.test(e.description[i]));
  assert.ok(!e.description[i].includes(original.split('\n')[0]),`${e.id}/${lang}: duplicate base stats`);
 }
 assert.ok(fs.existsSync('public/'+e.image.replace(/^\.\//,'')));
}
console.log('PASS: 64 base-stat sets match CSV and runtime JSON; 256 current localized effects; categories and icons.');
