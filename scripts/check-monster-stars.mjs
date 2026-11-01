import assert from 'node:assert/strict';
import fs from 'node:fs';
import {catalog} from '../src/wiki/catalog.ts';
import {wikiMessages} from '../src/wiki/messages.ts';
const monsters=catalog.filter(e=>e.category==='monsters');
const profiles=JSON.parse(fs.readFileSync('../Monster Auto Battler2/Docs/GameDesign/Roster/skill_scaling_v1.json','utf8')).profiles;
const kernel=fs.readFileSync('../Monster Auto Battler2/Assets/UdonSharp/EnginePort/BattleKernelU.cs','utf8');
const get=(id,star)=>monsters.find(m=>m.id===id).stars[star-1];
assert.equal(monsters.length,55);
for(const m of monsters){
 assert.equal(m.stars.length,3);assert.equal(m.skillName.length,4);m.skillName.forEach(v=>assert.ok(v.trim()));
 const reference=kernel.match(new RegExp(`if\\(id=="${m.id}"\\)return field==0\\?([\\d.]+):field==1\\?([\\d.]+):field==2\\?([\\d.]+):field==3\\?([\\d.]+):([\\d.]+);`));
 assert.ok(reference,`Missing runtime reference ${m.id}`);
 assert.equal(Number(reference[1]),profiles[m.id].attack);assert.equal(Number(reference[2]),profiles[m.id].health);
 assert.deepEqual(reference.slice(4).map(Number),profiles[m.id].stars.slice(1));
 for(const [i,s] of m.stars.entries()){
  assert.equal(s.star,i+1);assert.equal(s.stats.length,12);
  assert.equal(Number(s.stats[0].value),Math.trunc(profiles[m.id].health*[1,1.8,3][i]));
  assert.equal(Number(s.stats[1].value),Math.trunc(profiles[m.id].attack*[1,1.8,3][i]));
  for(const [j,f] of s.stats.entries()){
   assert.ok(wikiMessages[f.label],`Missing stat translation: ${f.label}`);
   assert.ok(Number.isFinite(Number(f.value.replace('%',''))));
   if(j>=2)assert.equal(f.value,m.stars[0].stats[j].value);
  }
  assert.equal(s.description.length,4);
  for(const [l,text] of s.description.entries()){
   assert.ok(text.trim());assert.ok(!/[{}§]|数值成长|三星五费|一\/二\/三星/.test(text),`${m.id}/${s.star}/${l}: unresolved content`);
   if(l===1||l===3)assert.ok(!/[\u3400-\u9fff]/.test(text));
  }
 }
}
// Compare every foreign tier to the current game's independently authored template.
for(const [i,lang] of ['en','ja','ko'].entries()){
 const locale=JSON.parse(fs.readFileSync(`../Monster Auto Battler2/Assets/Localization/Monsters/${lang}.json`,'utf8'));
 for(const m of monsters)for(const s of m.stars){
  const expected=locale[`monster.${m.id}.skill.star${s.star}`].replace(/\{([AH])([\d.]+)\}/g,(_,kind,n)=>{
   const base=profiles[m.id][kind==='H'?'health':'attack'], actual=Math.trunc(base*[1,1.8,3][s.star-1]);
   return String(Math.round(Number(n)*(.55+.45*actual/base/[1,1.8,3][s.star-1])*100)/100);
  });
  assert.equal(s.description[i+1],expected,`${m.id}/${s.star}/${lang}`);
 }
}
assert.equal(get('M002',2).stats[1].value,'104');
console.log('PASS: 55 runtime profiles, 165 star entries, 12 stats each; 495 foreign descriptions match current game templates and runtime preview rounding.');
