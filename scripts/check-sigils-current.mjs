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
 if(source.effects[0]?.kind==='combat_sigil'){
  redesigned++;assert.equal(loot[e.id].enabled,true);assert.equal(loot[e.id].unlock_round,8);
  assert.ok(e.sigilEffects);assert.notDeepEqual(e.sigilEffects.normal,e.sigilEffects.awakened);
  for(const text of [...e.sigilEffects.normal,...e.sigilEffects.awakened])assert.ok(text&&!/[{}]|undefined|NaN/.test(text));
 }
}
assert.equal(redesigned,16);
assert.match(entries.find(e=>e.id==='SIG_reinforcehunter').sigilEffects.normal[0],/4次.*20%/);
assert.match(entries.find(e=>e.id==='SIG_reinforcehunter').sigilEffects.awakened[0],/3次.*30%/);
assert.match(entries.find(e=>e.id==='SIG_vanguard').sigilEffects.normal[0],/15%.*6秒/);
assert.match(entries.find(e=>e.id==='SIG_vanguard').sigilEffects.awakened[0],/22%.*8秒/);
assert.match(entries.find(e=>e.id==='SIG_blockade').sigilEffects.normal[0],/封路3秒/);
console.log('PASS: 64 base-stat sets match v2 CSV and runtime JSON; 40/16/8 categories; 16 redesigned normal/awakened effects; no reinforcement copy.');
