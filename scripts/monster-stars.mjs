import assert from 'node:assert/strict';
import {skillTemplates} from './monster-skill-copy.mjs';
const n=value=>String(Math.round((value+Number.EPSILON)*100)/100);

// Mirrors PlaytestFixesBuilder.StarText and MonsterDetailsU.LiveSkillText.
// Inputs are the game's localized descriptions, never a blanket multiplier.
export function chineseStarText(source,star,m,profile){
 let text=source.split(/【数值成长】|【三星五费】/)[0];
 // BattleKernelU.IsOpeningHidden currently protects M017/M038 from direct
 // targeting for 4s too. The older M038 locale explicitly contradicts this.
 if(m.id==='M017')text=text.replace('开战后进入暗影4秒，','开战后进入暗影4秒，期间无法被敌人直接锁定，但仍会受到范围伤害；');
 if(m.id==='M038')text=text.replace('此效果不会让敌人失去对自身的锁定；','期间无法被敌人直接锁定，但仍会受到范围伤害；');
 if(text.includes('三星复活时'))text=star<3?text.split('三星复活时')[0]:text.replace('三星复活时','复活时');
 if(star===3&&source.includes('【三星五费】')){
  const extra=source.split('【三星五费】')[1];
  const replacements=[
   ['在全场敌人最密集的一处半径2格区域撕开地狱裂口，人数相同时优先较远的可锁定目标。','在最多3名不同敌人处分别撕开半径2格的地狱裂口，依次间隔0.2秒；敌人不足时只生成对应数量。'],
   ['锁定方向引导2秒龙息','持续朝向目标引导3秒龙息'],['前方3格直线路径','前方6格直线路径'],['共4次；期间','共6次；期间'],['眩晕、沉默、被迫位移或死亡会中断','免疫推拉位移；眩晕、沉默或死亡会中断'],
   ['命中后目标生命低于15%','命中后目标生命低于25%'],['扑咬2格内','扑咬4格内'],['最多咬3次','最多咬5次'],
   ['对最近敌人造成210','对最近的最多3名不同敌人依次造成210'],['获得自身最大生命25%的护盾，自身及周围两格内的存活友军增加15护甲和15魔抗','为全体存活友军提供施法者最大生命25%的护盾，增加15护甲和15魔抗'],
   ['当前生命值最低的敌人','生命比例最低的最多3名不同敌人'],['长4格、宽约1格','延伸至棋盘边界、宽约1格'],['放下250生命的诱饵箱','放下最多3个各250生命的诱饵箱'],['最多同时存在1个诱饵','最多同时存在3个诱饵']
  ];
  for(const [a,b] of replacements)text=text.replaceAll(a,b);
  if(m.id==='M029')text+='目标死亡、隐身或离开射程后，转向射程内最近的可选中敌人；没有目标则结束。';
  if(m.id==='M041')text+='各次落牙间隔0.3秒，不打击已死亡目标。';
  for(const prefix of ['在保护期间','每击杀一名目标','随后向最多3名'])if(extra.includes(prefix))text+=extra.slice(extra.indexOf(prefix)).replace('，并保留原本的自身护盾','');
  if(m.id==='M055')text+='仅占用自身周围合法空位；空位或召唤容量不足时，只生成能够放下的数量。';
 }
 const power=source.match(/主要数值提升至([\d.]+)\/([\d.]+)倍/);
 const scale=star===1||!power?1:Number(power[star-1]);
 const live=(value,health=false)=>{
  const reference=Number(health?m.hp:m.atk),body=[1,1.8,3][star-1];
  return n(Number(value)*scale*(.55+.45*Math.trunc(reference*body)/(reference*body)));
 };
 // Keep placeholders until other stat replacements finish, to avoid double scaling.
 const values=[];const token=(v,health)=>{values.push(live(v,health));return `§${String.fromCharCode(65+values.length-1)}§`;};
 text=text.replace(/([\d.]+)(点)?基础(物理伤害|法术伤害|真实伤害|法伤|伤害|生命|护盾)/g,(_,v,point,kind)=>token(v,kind==='护盾'&&!source.includes('吞蚀'))+(point??'')+kind);
 if(source.includes('召唤物攻击随')){
  text=text.replace(/(\d+)(生命|攻击)(?!力)/g,(_,v,kind)=>token(v,kind==='生命')+kind);
  text=text.replace(/攻击增加(\d+)/g,(_,v)=>'攻击增加'+token(v,false));
 }
 text=text.replace(/([\d.]+%?)\/([\d.]+%?)\/([\d.]+%?)/g,(_,a,b,c)=>[a,b,c][star-1]);
 const utility=source.match(/普通属性增减.*?1\/([\d.]+)\/([\d.]+)倍/);
 if(utility&&star>1){
  const factor=Number(utility[star-1]);
  text=text.replace(/(\d+(?:\.\d+)?)(?=%攻速|%伤害|%移速|点攻击力|护甲|魔抗)/g,v=>n(Number(v)*factor));
  text=text.replace(/(攻速提高|伤害提高|护甲提高|护甲降低|魔抗降低)(\d+(?:\.\d+)?)/g,(_,prefix,v)=>prefix+n(Number(v)*factor));
  text=text.replace(/共(\d+)%/g,(_,v)=>'共'+n(Number(v)*factor)+'%');
 }
 const ratio=source.match(/自身属性加成系数.*?1\/([\d.]+)\/([\d.]+)倍/);
 if(ratio&&star>1)text=text.replace(/((?:自身|施法者)最大生命)(\d+(?:\.\d+)?)%(的护盾)/g,(_,prefix,v,suffix)=>prefix+n(Number(v)*profile.stars[star-1]/[1,1.8,3][star-1])+'%'+suffix);
 // Lethal-hit rescue is a fixed recipient-HP ratio, not the caster shield formula.
 if(m.id==='M044'&&star===3)text=text.replace('并获得自身最大生命30%的护盾','并获得自身最大生命20%的护盾');
 text=text.replace(/§([A-Z])§/g,(_,key)=>values[key.charCodeAt(0)-65]);
 for(const phrase of ['（一/二/三星）','一/二/三星','（随星级成长）','伤害数值为一星基础值。','伤害随星级提升，','追加伤害随星级提升。'])text=text.replaceAll(phrase,'');
 return text.trim();
}

export function monsterStars(m,source,profile){
 assert.ok(profile&&skillTemplates[m.id],`Missing star source: ${m.id}`);
 return [1,2,3].map(star=>{
  const body=[1,1.8,3][star-1],power=profile.stars[star-1],utility=star===1?1:power>3||profile.stars[2]>3?[1,1.2,1.4][star-1]:[1,1.15,1.3][star-1];
  const render=template=>template.replace(/\{([phurv]):([^}]+)\}/g,(_,kind,v)=>{
   if(kind==='v')return v.split('/')[star-1];
   if(kind==='u')return n(Number(v)*utility);
   if(kind==='r')return n(Number(v)*power/body);
   const ref=Number(kind==='h'?m.hp:m.atk);
   return n(Number(v)*power*(.55+.45*Math.trunc(ref*body)/(ref*body)));
  });
  const descriptions=skillTemplates[m.id].map(template=>render(typeof template==='function'?template(star):template));
  return {star,stats:[['生命值',Math.trunc(Number(m.hp)*body)],['攻击力',Math.trunc(Number(m.atk)*body)],['攻击速度',m.aspd],['攻击距离',m.range],['护甲',m.armor],['魔法抗性',m.mr],['能量上限',m.energy_max],['暴击率',n(Number(m.crit_rate)*100)+'%'],['暴击伤害',n(Number(m.crit_dmg)*100)+'%'],['闪避率',n(Number(m.dodge)*100)+'%'],['移动速度',m.ms],['每秒能量回复',m.energy_regen]].map(([label,value])=>({label,value:String(value)})),description:[chineseStarText(source,star,m,profile),...descriptions]};
 });
}
