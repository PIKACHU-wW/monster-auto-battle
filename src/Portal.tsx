import {useEffect,useState} from 'react';
import {LanguageSelector,useI18n} from './i18n';
import {WikiPage} from './WikiPage';
import {localize,type Localized} from './wiki/types';
import {TavernScene} from './TavernIllustration';
import {RepairProgress} from './LiveProgress';
import {FeedbackDialog} from './FeedbackForm';
import {feedbackIntro} from './feedbackCopy';
import './portal.css';
const pages=['support','feedback','wiki'];
const current=()=>location.hash==='#wiki'||location.hash==='#archive'?'wiki':location.hash==='#feedback'||location.hash==='#repairs'?'feedback':'support';
export function Portal(){
 const {language}=useI18n();const L=(v:Localized)=>localize(v,language);
 const [page,setPage]=useState(current);const [feedback,setFeedback]=useState(false);
 useEffect(()=>{const sync=()=>setPage(current());addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const labels:Localized[]=[['赞助计划','Support','サポート','후원'],['问题反馈','Feedback','フィードバック','문제 제보'],['维基','Wiki','ウィキ','위키']];
 const products:{title:Localized;body:Localized}[]=[
 {title:['精灵场景与棋盘','Elven scene & board','精霊シーンと盤面','정령 장면과 보드'],body:['获得精灵场景，即可使用对应的精灵棋盘。','The Elven scene includes its matching board.','精霊シーンを所有すると、対応する盤面も使用できます。','정령 장면을 보유하면 해당 보드도 사용할 수 있습니다.']},
 {title:['天宫场景与棋盘','Celestial scene & board','天宮シーンと盤面','천궁 장면과 보드'],body:['获得天宫场景，即可使用对应的天宫棋盘。','The Celestial scene includes its matching board.','天宮シーンを所有すると、対応する盤面も使用できます。','천궁 장면을 보유하면 해당 보드도 사용할 수 있습니다.']},
 {title:['精灵魔杖 · 天宫魔杖','Elven & Celestial wands','精霊の杖・天宮の杖','정령 지팡이 · 천궁 지팡이'],body:['两款魔杖独立出售，可以分别选择。','Two independently sold wands, available separately.','2種類の杖は、それぞれ個別に購入できます。','두 지팡이는 각각 별도로 구매할 수 있습니다.']}];
 return <><a className="skip-link" href="#page-content">{L(['跳至正文','Skip to content','本文へ','본문으로'])}</a><header className="archive-header"><a className="archive-brand" href="#support"><img src="./brand/monster-auto-battle-mark-v1.png" alt=""/><span>MONSTER AUTO BATTLE<small>THE WAYFARER’S TAVERN</small></span></a><LanguageSelector/></header>
 <nav className="portal-tabs" aria-label={L(['主导航','Main navigation','メインナビゲーション','주 메뉴'])}>{pages.map((key,i)=><a href={'#'+key} key={key} aria-current={page===key?'page':undefined}><span>0{i+1}</span>{L(labels[i])}</a>)}</nav><main id="page-content">
 {page==='support'&&<><section className="archive-hero"><div className="hero-copy"><p className="eyebrow">SUPPORT THE NEXT ADVENTURE</p><h1>{L(labels[0])}<br/><em>{L(['让冒险继续。','Keep the story going.','物語は、まだ続く。','이야기는 계속됩니다.'])}</em></h1><p className="hero-description">{L(['选择喜欢的场景与魔杖，或参与神龙祈福，支持 Monster Auto Battle 的持续更新。','Choose a scene or wand, or join Dragon Blessing to support future Monster Auto Battle updates.','シーンや杖、神龍祈願で Monster Auto Battle の更新を応援しましょう。','장면과 지팡이 또는 신룡 기원으로 Monster Auto Battle의 업데이트를 응원하세요.'])}</p><div className="payment-links"><a className="hero-cta" href="https://afdian.com/a/pikachu123" target="_blank" rel="noopener noreferrer">{L(['爱发电 · 人民币','Afdian · CNY','愛発電 · CNY','Afdian · CNY'])} ↗</a><a className="hero-cta" href="https://ko-fi.com/pikachu42802/tiers" target="_blank" rel="noopener noreferrer">Ko-fi · USD ↗</a></div></div><div className="hero-art"><TavernScene/><div className="tavern-plaque"><span>MONSTER AUTO BATTLE</span><strong>{L(['为下一场冒险举杯','To the next adventure','次の冒険に乾杯','다음 모험을 위하여'])}</strong></div></div></section><section className="support-products"><p className="eyebrow">SCENES & WANDS</p><div className="support-grid">{products.map((p,i)=><article key={i}><span>0{i+1}</span><h2>{L(p.title)}</h2><p>{L(p.body)}</p></article>)}</div><article className="blessing-card"><p className="eyebrow">DRAGON BLESSING</p><h2>{L(['神龙祈福','Dragon Blessing','神龍祈願','신룡 기원'])}</h2><p>{L(['支持自选金额、多次参与。场景、魔杖等实际购买金额也计入祈福累计；场景附带的棋盘不重复计入。','Choose your contribution amount and participate repeatedly. Scene and wand purchases count toward your blessing total; included boards are not counted twice.','金額を選んで何度でも参加できます。シーンや杖の購入額も累計に含まれます。付属の盤面は重複計上しません。','금액을 선택해 여러 번 참여할 수 있습니다. 장면과 지팡이 구매 금액도 누적액에 포함되며, 포함된 보드는 중복 계산하지 않습니다.'])}</p><strong>{L(['测试版本结束时，按祈福累计排名结算，前 50 名永久享受后续 VIP 更新内容。','At the end of testing, the top 50 by accumulated blessing contributions receive permanent access to future VIP content updates.','テスト終了時の累計祈願ランキング上位50名は、今後のVIPコンテンツ更新を永久に利用できます。','테스트 종료 시 기원 누적 순위 상위 50명은 향후 VIP 콘텐츠 업데이트를 영구적으로 이용할 수 있습니다.'])}</strong></article></section></>}
 {page==='feedback'&&<><section className="contribute"><div><p className="eyebrow">LETTERS TO THE INNKEEPER</p><h1>{L(labels[1])}</h1><p>{L(feedbackIntro)}</p></div><button className="feedback-link" onClick={()=>setFeedback(true)}>{L(['提交 / 查询反馈','Submit / track feedback','報告・進捗照会','제보 / 진행 조회'])} ↗</button></section><RepairProgress/></>}
 {page==='wiki'&&<section id="archive" className="archive-content"><div className="archive-section-heading"><span>THE ADVENTURER’S HANDBOOK</span><span>{L(labels[2])}</span></div><WikiPage/></section>}</main><footer><span>MONSTER AUTO BATTLE <small>/ THE WAYFARER’S TAVERN</small></span></footer>{feedback&&<FeedbackDialog close={()=>setFeedback(false)} L={L}/>}</>;
}
