import {useState} from 'react';
import {useI18n} from '../i18n';
import {catalog} from './catalog';
import {localize,type Localized,type WikiEntry} from './types';
import './trait-expansion.css';

const assetRoot='./images/wiki/trait-expansion/';
type Frame='inactive'|'bronze'|'silver'|'gold'|'prismatic';
const frameNames:Record<Frame,Localized>={inactive:['未激活','Inactive','未発動','비활성'],bronze:['青铜','Bronze','ブロンズ','브론즈'],silver:['白银','Silver','シルバー','실버'],gold:['黄金','Gold','ゴールド','골드'],prismatic:['棱彩','Prismatic','プリズム','프리즘']};
// Only this selection is editorial. All content comes from the current game import.
const featured=new Set(['TR_deep','TR_wetland','TR_sylvan','TR_shadow','TR_stone','TR_decay','TR_combo','TR_control','TR_solitary']);
const items=catalog.filter(entry=>entry.category==='traits'&&featured.has(entry.id));
export function TraitExpansionPreview({onSelect}:{onSelect:(entry:WikiEntry)=>void}){
 const {language}=useI18n(),L=(v:Localized)=>localize(v,language);
 const [counts,setCounts]=useState<Record<string,number>>({});
 const people=(n:number)=>L([`${n} 人`,`${n} units`,`${n}体`,`${n}명`]);
 return <section className="trait-expansion panel" aria-labelledby="trait-expansion-title">
  <div className="trait-expansion-heading"><div><p className="eyebrow">MONSTER AUTO BATTLE · TRAITS</p><h2 id="trait-expansion-title">{L(['新增羁绊','New traits','新たな特性','신규 특성'])}</h2></div></div>
  <p className="trait-expansion-intro">{L(['选择人数，查看对应的羁绊效果与等级边框。打开详情可查看全部档位和组成怪物。','Select a unit count to see its effect and tier frame. Open the details for all tiers and members.','人数を選ぶと、その段階の効果とフレームを確認できます。詳細には全段階の効果と所属モンスターを掲載しています。','인원수를 선택하면 해당 단계의 효과와 테두리를 볼 수 있습니다. 상세 정보에서 모든 단계와 소속 몬스터를 확인하세요.'])}</p>
  <div className="trait-expansion-grid">{items.map(item=>{
   const tiers=item.traitTiers!;
   const count=counts[item.id]??tiers[tiers.length-1].count;
   const stage=tiers.filter(tier=>tier.count<=count).length;
   const grade:Frame=stage===0?'inactive':tiers.length<=2&&stage===tiers.length?'gold':(['bronze','silver','gold','prismatic'] as const)[Math.min(stage,4)-1];
   const effect=tiers[stage-1]?.description;
   return <article key={item.id} className="trait-expansion-card" data-expansion-trait={item.id.replace('TR_','')}>
    <div className={`trait-art-badge trait-art-${grade}`} data-frame={grade} role="img" aria-label={`${L(item.title)} · ${L(frameNames[grade])}`}>
     <img className="trait-art-frame" src={`${assetRoot}frame-${grade}.svg`} width="160" height="160" alt="" loading="lazy"/>
     <img className="trait-art-symbol" src={item.image} width="160" height="160" alt="" loading="lazy" decoding="async"/>
    </div>
    <h3>{L(item.title)}</h3>
    <div className="trait-count-options" role="group" aria-label={`${L(item.title)} · ${L(['人数档位','Unit thresholds','人数段階','인원 단계'])}`}>
     {[0,...tiers.map(tier=>tier.count)].map(n=><button key={n} type="button" aria-pressed={count===n} onClick={()=>setCounts(old=>({...old,[item.id]:n}))}>{n?people(n):L(frameNames.inactive)}</button>)}
    </div>
    <div aria-live="polite" className="trait-selected-effect"><p className="trait-frame-label">{L(frameNames[grade])}</p><p>{effect?L(effect):L(['尚未达到激活人数。','The activation threshold has not been reached.','発動に必要な人数に達していません。','활성화에 필요한 인원수에 도달하지 않았습니다.'])}</p></div>
    <button type="button" className="secondary trait-detail-link" onClick={()=>onSelect(item)}>{L(['查看羁绊与成员 ↗','View trait and members ↗','特性と所属メンバーを見る ↗','특성과 소속 몬스터 보기 ↗'])}</button>
   </article>;
  })}</div>
 </section>;
}
