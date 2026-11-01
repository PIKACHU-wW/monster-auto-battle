import {useEffect,useRef,useState} from 'react';
import {useI18n} from './i18n';
import {catalog} from './wiki/catalog';
import {TraitExpansionPreview} from './wiki/TraitExpansionPreview';
import {localize,type WikiCategory,type WikiEntry} from './wiki/types';
import './wiki/wiki.css';

const categories:{id:WikiCategory;label:string;symbol:string;heading:string;guide:string[]}[]=[
 {id:'quests',label:'任务',symbol:'Ⅰ',heading:'与洛恩接取委托',guide:[
  '在酒馆与洛恩交谈接取任务。首次接活前先完成试阵；之后按蛮荒、几何、精灵、天宫的顺序推进，每章三份委托。',
  '每关通过独立招募选择组建阵容，完成布阵后准备开战。失败可以重新尝试；胜利后回酒馆复命，再接取下一份委托。',
  '首次完成奖励属于局外金币与经验，不会变成多人对局中的金币、等级或属性加成。重复结算不会重复领取首次奖励。']},
 {id:'monsters',label:'怪物',symbol:'Ⅱ',heading:'认识你的阵容成员',guide:[
  '怪物费用同时代表稀有度。费用更高并不意味着能替代所有低费怪物；技能定位、站位与羁绊配合决定它在阵容中的作用。',
  '同名怪物可以融合为精魄。每个升星阶段填满两个精魄槽即可升星；完整二星与三星分别对应三份与九份基础怪物。溢出的同名精魄进入余额。',
  '同种怪物的不同星级不会重复贡献羁绊人数。配置阵容时，既要考虑核心单位升星，也要留出激活羁绊的位置。']},
 {id:'traits',label:'羁绊',symbol:'Ⅲ',heading:'让怪物之间产生配合',guide:[
  '每只怪物拥有2～3个羁绊。查看成员名单寻找交叉搭配，也可以在怪物页多选羁绊，筛选同时具备这些羁绊的成员。',
  '羁绊分为生态、职能和特殊关系。达到条目列出的不同怪物人数后激活对应档位；同名怪物不重复计数，召唤物不增加人数。',
  '特殊关系需要指定成员，不能用另一只同名怪物代替缺少的成员。',
  '羁绊不只是属性加成：包围方向、移动路线、施法顺序和保护距离都可能影响触发。可以从条目下方直接查看组成怪物。']},
 {id:'equipment',label:'契印',symbol:'Ⅳ',heading:'用契印补足阵容能力',guide:[
  '契印分为战斗、生态、禁忌三类。每枚固定提供1–2条基础属性，并附带特殊效果。每只怪物只有一个契印槽。',
  '一、二星使用普通效果，三星替换为觉醒效果，两档不同时生效。基础属性不随星级提高系数，也不会因觉醒重复获得。',
  '集市可获得契印，野怪轮每次提供两枚。仓库有32格；装备、替换与取下均在正常准备阶段操作，战斗中领取奖励不会改变本场已锁定阵容。',
  '野怪获胜后，可在紧接的准备阶段花费2金币，重铸本轮新获得的一枚契印，从三个候选中选一个。每个获胜野怪轮最多一次；失败补发物不能用于该轮重铸。']},
];
const detailHeadings={quests:'委托背景',monsters:'技能与战斗特点',traits:'羁绊机制',equipment:'契印效果'};
const relatedHeadings={quests:'后续任务',monsters:'关联羁绊',traits:'组成怪物',equipment:'关联羁绊'};
const pageSize=12;
const traitOptions=catalog.filter(e=>e.category==='traits');
// Same 6x3 sprite atlas and indices as the game's MonsterDetailsU stat panel.
const statIconIndex:Record<string,number>={'生命值':0,'攻击力':1,'攻击速度':2,'护甲':4,'魔法抗性':5,'暴击率':6,'初始能量':10};

export function WikiPage(){
 const {language,t}=useI18n();const L=(value:WikiEntry['title'])=>localize(value,language);
 const [category,setCategory]=useState<WikiCategory>('monsters'),[query,setQuery]=useState(''),[group,setGroup]=useState('all');
 const [selected,setSelected]=useState<string|null>(null),[page,setPage]=useState(0);
 const [selectedTraits,setSelectedTraits]=useState<string[]>([]);
 const articleHeading=useRef<HTMLHeadingElement>(null),listHeading=useRef<HTMLParagraphElement>(null),lastCard=useRef<string|null>(null);
 const info=categories.find(c=>c.id===category)!;
 const entries=catalog.filter(e=>e.category===category),groups=[...new Map(entries.map(e=>[e.group[0],e.group])).entries()];
 const search=query.normalize('NFKC').trim().toLocaleLowerCase();
 const filtered=entries.filter(e=>(category==='monsters'?selectedTraits.every(id=>e.related.includes(id)):(group==='all'||e.group[0]===group))&&[L(e.title),L(e.description),L(e.group),e.skillName?L(e.skillName):'',...(e.stars??[]).map(s=>L(s.description)),...e.related.map(id=>L(catalog.find(r=>r.id===id)!.title))].join(' ').normalize('NFKC').toLocaleLowerCase().includes(search));
 const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize)),currentPage=Math.min(page,pageCount-1);
 const visible=filtered.slice(currentPage*pageSize,(currentPage+1)*pageSize),article=catalog.find(e=>e.id===selected);
 useEffect(()=>{if(selected)articleHeading.current?.focus();else if(lastCard.current)document.getElementById(`wiki-${lastCard.current}`)?.focus({preventScroll:true});},[selected]);
 useEffect(()=>{setPage(0);},[language]);
 function selectCategory(id:WikiCategory){setCategory(id);setSelected(null);setQuery('');setGroup('all');setSelectedTraits([]);setPage(0);lastCard.current=null;}
 function open(entry:WikiEntry){lastCard.current=entry.id;setSelected(entry.id);}
 function related(entry:WikiEntry){setCategory(entry.category);setQuery('');setGroup('all');setSelectedTraits([]);setPage(0);open(entry);}
 function toggleTrait(id:string){setSelectedTraits(current=>current.includes(id)?current.filter(v=>v!==id):[...current,id]);setPage(0);}
 function paginate(next:number){setPage(next);listHeading.current?.focus();}
 return <div className="wiki-library" data-category={category}>
  <section className="page-title"><p className="eyebrow">MONSTER AUTO BATTLE · WIKI</p><h1>{t('游戏维基')}</h1><p>{t('从酒馆委托到阵容构筑，查找任务、怪物、羁绊与契印。')}</p></section>
  <div className="wiki-sections" aria-label={t('维基分类')}>
   {categories.map(c=><button key={c.id} aria-pressed={category===c.id} className={category===c.id?'active':''} onClick={()=>selectCategory(c.id)}><span className="wiki-section-symbol" aria-hidden="true">{c.symbol}</span><span>{t(c.label)}</span><span className="wiki-section-count">{catalog.filter(e=>e.category===c.id).length}</span></button>)}
  </div>
  {article?<article className="panel wiki-article">
   <button className="secondary" onClick={()=>setSelected(null)}>{t('← 返回条目')}</button>
   <div className="wiki-detail-header">{article.image&&<img src={article.image} alt="" width="112" height="112"/>}<div><p className="eyebrow">{L(article.group)}</p><h2 ref={articleHeading} tabIndex={-1}>{L(article.title)}</h2></div></div>
   {article.category!=='equipment'&&<dl className="wiki-facts">{article.facts.map(f=><div key={f.label}><dt>{t(f.label)}</dt><dd>{typeof f.value==='string'?f.value:L(f.value)}</dd></div>)}</dl>}
   {article.baseStats&&<section className="wiki-sigil-base"><h3>{t('基础属性')}</h3><dl className="wiki-facts wiki-sigil-stats">{article.baseStats.map(f=>{const index=statIconIndex[f.label];return <div key={f.label}><dt><span className="wiki-stat-icon" aria-hidden="true" style={{backgroundPosition:`${(index%6)*20}% ${Math.floor(index/6)*50}%`}}/>{t(f.label)}</dt><dd>{typeof f.value==='string'?f.value:L(f.value)}</dd></div>;})}</dl></section>}
   {article.category==='equipment'&&<><h3>{t('特殊效果')}</h3>{article.facts.filter(f=>f.label==='共鸣条件').map(f=><p key={f.label}>{t(f.label)}：{typeof f.value==='string'?f.value:L(f.value)}</p>)}</>}
   {article.stars?<>
    <h3>{t('星级属性对照')}</h3>
    <p className="subtle">{t('以下为未装备契印、未计入羁绊和战斗增益的基础属性。技能数值按对应星级列出，实战中会受当前属性、目标防御及增益影响。')}</p>
    <div className="wiki-star-table-wrap"><table className="wiki-star-table"><caption>{t('一至三星基础属性')}</caption><thead><tr><th scope="col">{t('属性')}</th>{article.stars.map(s=><th scope="col" key={s.star}>{t(['一星','二星','三星'][s.star-1])}</th>)}</tr></thead><tbody>{article.stars[0].stats.map((stat,i)=><tr key={stat.label}><th scope="row">{t(stat.label)}</th>{article.stars!.map(s=><td key={s.star}>{s.stats[i].value}</td>)}</tr>)}</tbody></table></div>
    <h3>{t(detailHeadings[article.category])}{article.skillName&&<> · {L(article.skillName)}</>}</h3>
    <div className="wiki-star-skills">{article.stars.map(s=><section className="wiki-star-skill" key={s.star}><h4><span aria-hidden="true">{'★'.repeat(s.star)}</span>{t(['一星','二星','三星'][s.star-1])}</h4>{L(s.description).split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</section>)}</div>
   </>:article.sigilEffects?<><h4>{t('普通效果（1–2星）')}</h4><p>{L(article.sigilEffects.normal)}</p><h4>{t('三星觉醒效果')}</h4><p>{L(article.sigilEffects.awakened)}</p><p className="subtle">{t('上述重做效果中的友军不含自身、召唤物或备战单位；阵亡触发只计初始上阵单位的首次真正阵亡。')}</p></>:<>{article.category!=='equipment'&&<h3>{t(detailHeadings[article.category])}</h3>}{L(article.description).split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</>}
   {article.category==='quests'&&<p className="wiki-detail-tip">{t(categories[0].guide[2])}</p>}
   {article.traitTiers&&<section className="wiki-trait-tiers"><h3>{t('人数档位效果')}</h3><p className="subtle">{t('按上阵的不同怪物计数，同名怪物不重复计算。以下分别列出达到各人数档位时的完整效果。')}</p><div className="wiki-star-skills">{article.traitTiers.map(tier=><section className="wiki-star-skill" key={tier.count}><h4><span>{tier.count} {t('名不同怪物')}</span></h4>{L(tier.description).split('\n').map((text,i)=><p key={i}>{text}</p>)}</section>)}</div></section>}
   {article.category!=='equipment'&&article.related.length>0&&<section className="wiki-related"><h3>{t(relatedHeadings[article.category])}</h3><div>{article.related.map(id=>{const e=catalog.find(v=>v.id===id)!;return <button key={id} className="secondary" onClick={()=>related(e)}>{e.image&&<img src={e.image} loading="lazy" alt="" width="32" height="32"/>}{L(e.title)}<span aria-hidden="true">↗</span></button>;})}</div></section>}
  </article>:<>
   <section className="panel wiki-guide"><p className="eyebrow">{t(info.label)}</p><h2>{t(info.heading)}</h2><p>{t(info.guide[0])}</p><details key={category}><summary>{t('基础规则')}</summary>{info.guide.slice(1).map(p=><p key={p}>{t(p)}</p>)}</details></section>
   <div className={`wiki-tools wiki-library-tools${category==='monsters'?' wiki-monster-tools':''}`}><label>{t('搜索维基')}<input type="search" placeholder={t('搜索名称、技能或效果…')} value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/></label>{category==='monsters'?<fieldset className="wiki-trait-filter"><legend>{t('羁绊')}</legend><div className="wiki-trait-options"><button type="button" className="wiki-trait-chip" aria-pressed={selectedTraits.length===0} onClick={()=>{setSelectedTraits([]);setPage(0);}}>{t('全部羁绊')}</button>{traitOptions.map(trait=><button type="button" key={trait.id} data-trait={trait.id} className="wiki-trait-chip" aria-pressed={selectedTraits.includes(trait.id)} onClick={()=>toggleTrait(trait.id)}>{trait.image&&<img src={trait.image} alt="" width="22" height="22" loading="lazy"/>}{L(trait.title)}</button>)}</div><p>{t('可多选，显示同时具备所选羁绊的怪物。')}</p></fieldset>:<label>{t('分类筛选')}<select value={group} onChange={e=>{setGroup(e.target.value);setPage(0);}}><option value="all">{t('全部分组')}</option>{groups.map(([key,label])=><option key={key} value={key}>{L(label)}</option>)}</select></label>}</div>
   <p className="wiki-result-count" ref={listHeading} tabIndex={-1} role="status" aria-live="polite">{filtered.length} {t('条目')} <span>{currentPage+1} / {pageCount}</span></p>
   <div className="wiki-grid">{visible.map(e=><button className="panel wiki-card" id={`wiki-${e.id}`} key={e.id} onClick={()=>open(e)}><div className="wiki-card-heading">{e.image?<img src={e.image} alt="" loading="lazy" decoding="async" width="64" height="64"/>:<span className="wiki-quest-number" aria-hidden="true">{e.title[0].split(' ')[0]}</span>}<div><span className="eyebrow">{L(e.group)}</span><h2>{L(e.title)}</h2></div></div><p>{L(e.summary)}</p><span className="wiki-read">{t('阅读条目 ↗')}</span></button>)}</div>
   {filtered.length===0&&<section className="panel empty"><h2>{t('没有找到相关条目')}</h2><p>{t('当前分类没有匹配的条目。')}</p><button className="secondary" onClick={()=>{setQuery('');setGroup('all');setSelectedTraits([]);setPage(0);}}>{t('清除搜索')}</button></section>}
   {pageCount>1&&<div className="wiki-pagination"><button className="secondary" disabled={currentPage===0} onClick={()=>paginate(currentPage-1)}>{t('上一页')}</button><span>{currentPage+1} / {pageCount}</span><button className="secondary" disabled={currentPage>=pageCount-1} onClick={()=>paginate(currentPage+1)}>{t('下一页')}</button></div>}
   {category==='traits'&&<TraitExpansionPreview onSelect={open}/>}
  </>}
 </div>;
}
