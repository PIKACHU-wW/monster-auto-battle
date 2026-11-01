import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {monsterCopy,traitCopy,equipmentCopy} from './wiki-copy.mjs';
import {monsterStars} from './monster-stars.mjs';
import {skillNames} from './monster-skill-names.mjs';
import {baseStats,combatDescription,sigilGroups} from './sigil-current.mjs';
import {traitTiers} from './trait-tiers.mjs';
const root=path.resolve(process.argv[2]||'../Monster Auto Battler2');
const langs=['zh','en','ja','ko'];
const read=file=>fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,'');
const json=file=>JSON.parse(read(file));
const packs=Object.fromEntries(['Monsters','UI','Adventure'].map(kind=>[kind,Object.fromEntries(langs.map(l=>[l,json(`Assets/Localization/${kind}/${l}.json`)]))]));
function text(kind,key){return langs.map(l=>{const v=packs[kind][l][key];assert.ok(v,`Missing ${l} ${key}`);return v.replace(/<[^>]+>/g,'');});}
function csv(source){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value='';}else if(c==='\n'&&!quoted){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=c;}if(value||row.length){row.push(value.replace(/\r$/,''));rows.push(row);}const [keys,...rest]=rows;return rest.filter(r=>r.length>1).map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]])));}
const monsters=csv(read('Docs/GameDesign/Roster/monsters.csv'));
const profiles=json('Docs/GameDesign/Roster/skill_scaling_v1.json').profiles;
const traits=json('Docs/GameDesign/Roster/traits.json').traits;
const sigils=json('Docs/GameDesign/Roster/sigils.json').sigils;
const loot=json('Docs/GameDesign/Roster/sigil_loot.json').sigils;
const entries=[];
const domains={
 '原始荒野':['原始荒野','Primal Wilds','原始の荒野','원시 황야'],
 '幽冥灵境':['幽冥灵境','Spirit Realm','幽冥の霊境','망령의 영지'],
 '几何秘境':['几何秘境','Geometric Realm','幾何の秘境','기하학 비경'],
};
const matches=(m,t)=>t.units?t.units.includes(m.id):[...m.ecos.split(';'),...m.roles.split(';')].includes(t.tag);
function image(folder,id){let source=path.join(root,`Assets/Art/Icons/${folder}/${id}.png`);if(!fs.existsSync(source)&&folder==='Traits')source=path.join(root,`Assets/Art/Icons/Traits/ExpansionV1/${id}.png`);assert.ok(fs.existsSync(source),`Missing icon ${id}`);const dest=`public/images/wiki/${id}.png`;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);return `./images/wiki/${id}.png`;}
const career=read('Assets/UdonSharp/EnginePort/PlayerCareerU.cs');
const rewards=name=>{const match=career.match(new RegExp(`${name}=new int\\[\\]\\{([^}]+)\\}`));assert.ok(match);return match[1].split(',').map(Number);};
const gold=rewards('questGold'),xp=rewards('questExperience');
for(let i=0;i<12;i++){
 const chapter=Math.floor(i/3);entries.push({id:`quest-${i+1}`,category:'quests',title:text('Adventure',`career.quest.${i}`),summary:text('Adventure',`career.goal.${i}`),description:text('UI',`journal.background.${i}`),group:text('Adventure',`career.chapter.${chapter}`),facts:[{label:'任务目标',value:text('Adventure',`career.goal.${i}`)},{label:'首次金币',value:String(gold[i])},{label:'首次经验',value:String(xp[i])}],related:i<11?[`quest-${i+2}`]:[]});
}
for(const m of monsters){
 assert.ok(monsterCopy[m.id]);const description=[packs.Monsters.zh[`skill.${m.skill_id}.desc`],...monsterCopy[m.id]];assert.ok(description[0]);
 const related=Object.entries(traits).filter(([,t])=>matches(m,t)).map(([id])=>id);
 const stars=monsterStars(m,description[0],profiles[m.id]);
 const skillName=[packs.Monsters.zh[`skill.${m.skill_id}.name`],...skillNames[Number(m.id.slice(1))-1]];
 entries.push({id:m.id,category:'monsters',title:text('Monsters',`monster.${m.id}.name`),summary:description.map(s=>s.split('\n')[0]),description,group:domains[m.domain],image:image('Units',m.id),facts:[{label:'招募费用',value:m.cost}],skillName,stars,related});
}

const percentParams=new Set(['ratio','reduction','tenacity','shield','threshold','cap','ward','decay']);
function currentTraitTiers(t){
 return t.tiers.map(count=>({count,description:langs.map(lang=>t.effects.filter(e=>e.tier===count).map(e=>{
 const basic=e.kind==='warlock_relay'?'.'+e.tier:(e.kind==='expansion_deep'||e.kind==='expansion_sylvan')&&e.tier===2?'.basic':'';
 const template=packs.UI[lang]['effect.'+e.kind+basic];assert.ok(template,`Missing ${lang} ${e.kind}`);
 return template.replace(/\{(\w+)\}/g,(_,key)=>{assert.ok(Number.isFinite(e.params[key]));return String(Math.round(e.params[key]*(percentParams.has(key)?100:1)*100)/100);});
 }).join(' '))}));
}

for(const [id,t]of Object.entries(traits)){
 const fresh=t.effects.some(e=>e.kind.startsWith('expansion_')||e.kind==='solitary'||e.kind==='warlock_relay');
 const tiers=fresh?currentTraitTiers(t):traitTiers(t);
 if(!fresh)assert.ok(traitCopy[id]);const description=fresh?langs.map((_,i)=>tiers.map(t=>`${t.count}: ${t.description[i]}`).join('\n')):[t.desc,...traitCopy[id]];entries.push({id,category:'traits',title:text('UI',`trait.${id}`),summary:fresh?tiers[0].description:description,description,group:({eco:['生态羁绊','Ecology traits','生態特性','생태 특성'],role:['职能羁绊','Role traits','役割特性','역할 특성'],special:['特殊羁绊','Special traits','特殊特性','특수 특성']})[t.type],image:image('Traits',id),facts:[{label:'激活人数',value:t.tiers.join(' / ')}],traitTiers:tiers,related:monsters.filter(m=>matches(m,t)).map(m=>m.id)});
}
for(const [id,sigil] of Object.entries(sigils)){
 assert.ok(equipmentCopy[id],`Missing editorial description ${id}`);const [en,ja,ko,,enDesc,jaDesc,koDesc]=equipmentCopy[id];
 const title=id==='SIG_reinforcehunter'?[packs.Monsters.zh[`sigil.${id}.name`],'Target Hunter','標的の狩人','표적 사냥꾼']:[packs.Monsters.zh[`sigil.${id}.name`],en,ja,ko];
 const zhDesc=packs.Monsters.zh[`sigil.${id}.desc`].split('特殊效果：')[1];assert.ok(zhDesc,`Missing current sigil copy ${id}`);
 const sigilEffects=sigil.effects[0]?.kind==='combat_sigil'?{normal:combatDescription(sigil.effects[0]),awakened:combatDescription(sigil.awaken[0])}:undefined;
 const description=sigilEffects?sigilEffects.normal:[zhDesc,enDesc,jaDesc,koDesc];
 const requirement=loot[id].require_trait;const traitId=requirement?Object.keys(traits).find(t=>traits[t].tag===requirement.split(':')[0]):undefined;
 const group=sigilGroups[loot[id].group];assert.ok(group,`Unknown sigil group ${id}`);
 const facts=[{label:'契印槽位',value:'1'}];if(traitId)facts.push({label:'共鸣条件',value:text('UI',`trait.${traitId}`).map(s=>`${s} ≥ ${requirement.split(':')[1]}`)});
 facts.push({label:'解锁回合',value:String(loot[id].unlock_round)});
 entries.push({id,category:'equipment',title,summary:description,description,group,image:image('Sigils',id),facts,baseStats:baseStats(sigil),sigilEffects,related:traitId?[traitId]:[]});
}
assert.equal(entries.length,154);assert.equal(new Set(entries.map(e=>e.id)).size,154);
for(const e of entries){for(const f of ['title','summary','description','group']){assert.equal(e[f]?.length,4,`${e.id}.${f}`);e[f].forEach(v=>assert.ok(v?.trim(),`${e.id}.${f} empty`));}for(const id of e.related)assert.ok(entries.some(a=>a.id===id),`Broken reference ${id}`);}
fs.mkdirSync('src/wiki',{recursive:true});fs.writeFileSync('src/wiki/catalog.ts',`// Generated by scripts/import-wiki.mjs from the game's public content.\nimport type {WikiEntry} from './types';\nexport const catalog:WikiEntry[] = ${JSON.stringify(entries,null,1)};\n`);
fs.mkdirSync('public/images/wiki',{recursive:true});
fs.copyFileSync(path.join(root,'Assets/Art/Icons/UI/monster-stats-painted-atlas-v2.png'),'public/images/wiki/monster-stats-painted-atlas-v2.png');
fs.writeFileSync('src/wiki/SOURCES.txt',`Wiki source snapshot: ${new Date().toISOString().slice(0,10)}\n\nRead-only import from the sibling Unity project. No Unity assets or code were changed.\nSources:\nAssets/Localization/{Monsters,UI,Adventure}/{zh,en,ja,ko}.json\nDocs/GameDesign/Roster/{monsters.csv,traits.json,sigils.json,sigil_loot.json,skill_scaling_v1.json}\nAssets/Editor/PlaytestFixesBuilder.cs (star descriptions)\nAssets/UdonSharp/EnginePort/{RuntimeBattleBuilderU,BattleKernelU,MonsterDetailsU}.cs (growth and numeric preview)\nAssets/UdonSharp/EnginePort/PlayerCareerU.cs (first-clear rewards)\nAssets/Art/Icons/{Units,Traits,Sigils}/*.png (copied unchanged)\nDocs/GameDesign/19_Solo_Adventure/个人任务与局外成长接入.txt\nDocs/GameDesign/19_Solo_Adventure/开场试阵_代码接入交接.txt\nDocs/GameDesign/10C_Sigil_Loot_and_Storage.md\nDocs/GameDesign/Roster/{sigil_base_stats_v2.csv,sigil_base_stats_v2.txt,sigil_combat_redesign_v1.txt}\nDocs/Production/2026-10-27_Sigil_Combat_V2_Implementation.txt\n\nEditorial content: scripts/wiki-copy.mjs; source locale placeholders were not used as foreign translations. Sigil categories come from sigil_loot.json, never array positions: combat 40, ecosystem 16, forbidden 8. All 64 base_stats are imported from current sigils.json and checked against sigil_base_stats_v2.csv. All 16 combat_v2 effects and awakening use parameterized four-language copy in scripts/sigil-current.mjs. The other 48 Chinese effects use the current game locale; foreign descriptions remain mechanic summaries. Monster list summaries remain concise. Detailed monster entries include 1/2/3-star stats and full numeric skills in all four languages. Body HP/ATK use 1/1.8/3 with integer truncation, as RuntimeBattleBuilderU does; remaining base stats stay fixed. Skill values use skill_scaling_v1 profiles and BattleKernelU SkillFlat/SkillUtilityGrowth/SkillRatioGrowth; displayed values round to two decimals. Chinese star descriptions follow PlaytestFixesBuilder.StarText, with full-precision ratio growth and fixed 20% legendary rescue shield to match BattleKernelU. M017/M038 opening concealment follows BattleKernelU.IsOpeningHidden/CanDirectTarget; the old M038 locale says targeting is retained, which conflicts with current runtime. No gameplay code is changed. Foreign names and full skill templates: scripts/monster-skill-names.mjs and scripts/monster-skill-copy.mjs. Trait membership uses the source tag matching and explicit special-trait unit lists. Trait tiers use current traits.json parameters. Expansion, solitary and warlock effects use the game UI locale templates; other tiers use scripts/trait-tiers.mjs. Featured icons, tier frames and member links read the same generated catalog. Each tier retains independently unlocked effect kinds (including Guardian shield transfer at 4 and 6). Vague source notes are expanded using BattleKernelU TvCycles behavior; obsolete reinforcement wording is omitted.\nRegenerate: node scripts/import-wiki.mjs [Unity project path]\n`);
console.log('Imported 12 quests, 55 monsters, 23 traits, 64 equipment entries; copied 142 icons.');
