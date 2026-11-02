import {useEffect,useState} from 'react';
import {LanguageSelector,useI18n} from './i18n';
import {WikiPage} from './WikiPage';
import {localize,type Localized} from './wiki/types';
import {TavernScene} from './TavernIllustration';
import {RepairProgress} from './LiveProgress';
import {FeedbackDialog} from './FeedbackForm';
import {feedbackIntro} from './feedbackCopy';
import {siteConfig} from './siteConfig';
import './portal.css';
import {ShopPage} from './ShopPage';
const pages=['support','feedback','wiki'];
const current=()=>location.hash==='#wiki'||location.hash==='#archive'?'wiki':location.hash==='#feedback'||location.hash==='#repairs'?'feedback':'support';
export function Portal(){
 const {language}=useI18n();const L=(v:Localized)=>localize(v,language);
 const [page,setPage]=useState(current);const [shopRoute,setShopRoute]=useState(()=>location.hash.startsWith('#shop/'));const [feedback,setFeedback]=useState(false);
 useEffect(()=>{const sync=()=>{setPage(current());setShopRoute(location.hash.startsWith('#shop/'));};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const labels:Localized[]=[['赞助计划','Support','サポート','후원'],['问题反馈','Feedback','フィードバック','문제 제보'],['维基','Wiki','ウィキ','위키']];
 return <><a className="skip-link" href="#page-content">{L(['跳至正文','Skip to content','本文へ','본문으로'])}</a><header className="archive-header"><a className="archive-brand" href="#support"><img src="./brand/monster-auto-battle-mark-v1.png" alt=""/><span>MONSTER AUTO BATTLE<small>THE WAYFARER’S TAVERN</small></span></a><LanguageSelector/></header>
 <nav className="portal-tabs" aria-label={L(['主导航','Main navigation','メインナビゲーション','주 메뉴'])}>{pages.map((key,i)=><a href={'#'+key} key={key} aria-current={page===key?'page':undefined}><span>0{i+1}</span>{L(labels[i])}</a>)}</nav><main id="page-content">
 {page==='support'&&<>{!shopRoute&&<section className="archive-hero"><div className="hero-copy"><p className="eyebrow">SUPPORT THE NEXT ADVENTURE</p><h1>{L(labels[0])}<br/><em>{L(['让冒险继续。','Keep the story going.','物語は、まだ続く。','이야기는 계속됩니다.'])}</em></h1><p className="hero-description">{L(['选择喜欢的场景与魔杖，或参与神龙祈福，支持 Monster Auto Battle 的持续更新。','Choose a scene or wand, or join Dragon Blessing to support future Monster Auto Battle updates.','シーンや杖、神龍祈願で Monster Auto Battle の更新を応援しましょう。','장면과 지팡이 또는 신룡 기원으로 Monster Auto Battle의 업데이트를 응원하세요.'])}</p><div className="payment-links"><a className="hero-cta" href="https://afdian.com/a/pikachu123" target="_blank" rel="noopener noreferrer">{L(['爱发电 · 人民币','Afdian · CNY','愛発電 · CNY','Afdian · CNY'])} ↗</a><a className="hero-cta" href="https://ko-fi.com/pikachu42802" target="_blank" rel="noopener noreferrer">Ko-fi · USD ↗</a></div></div><div className="hero-art"><TavernScene/><div className="tavern-plaque"><span>MONSTER AUTO BATTLE</span><strong>{L(['为下一场冒险举杯','To the next adventure','次の冒険に乾杯','다음 모험을 위하여'])}</strong></div></div></section>}<ShopPage/></>}
 {page==='feedback'&&<><section className="contribute"><div><p className="eyebrow">LETTERS TO THE INNKEEPER</p><h1>{L(labels[1])}</h1><p>{L(feedbackIntro)}</p></div><button className="feedback-link" onClick={()=>setFeedback(true)}>{L(['提交 / 查询反馈','Submit / track feedback','報告・進捗照会','제보 / 진행 조회'])} ↗</button></section><section className="support-products"><h2>{L(['高优先级漏洞联系邮箱','High-priority vulnerability contact','優先度の高い脆弱性の連絡先','높은 우선순위 취약점 연락처'])}</h2><a href={'mailto:'+siteConfig.securityEmail}>{siteConfig.securityEmail}</a><p>{L(['仅处理高优先级漏洞。普通问题请使用上方反馈入口，发送到邮箱不会收到回复。','For high-priority vulnerabilities only. Submit ordinary issues using the feedback form above; ordinary issues sent by email will not receive a reply.','優先度の高い脆弱性のみ対応します。通常の問題は上の報告フォームをご利用ください。通常の問題へのメール返信は行いません。','높은 우선순위 취약점만 처리합니다. 일반 문제는 위 제보 양식을 이용해 주세요. 일반 문제 이메일에는 답변하지 않습니다.'])}</p></section><RepairProgress/></>}
 {page==='wiki'&&<section id="archive" className="archive-content"><div className="archive-section-heading"><span>THE ADVENTURER’S HANDBOOK</span><span>{L(labels[2])}</span></div><WikiPage/></section>}</main><footer><span>MONSTER AUTO BATTLE <small>/ THE WAYFARER’S TAVERN</small></span></footer>{feedback&&<FeedbackDialog close={()=>setFeedback(false)} L={L}/>}</>;
}
