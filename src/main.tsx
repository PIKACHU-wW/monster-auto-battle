import {createRoot} from 'react-dom/client';
import {useState,useEffect,useRef} from 'react';
import {LanguageProvider,LanguageSelector,useI18n} from './i18n';
import {WikiPage} from './WikiPage';
import {catalog} from './wiki/catalog';
import {localize,type Localized} from './wiki/types';
import {siteConfig} from './siteConfig';
import './archive.css';
import {RepairProgress} from './RepairProgress';
import {SecurityContact} from './SecurityContact';

function App(){
 const {language}=useI18n();const L=(v:Localized)=>localize(v,language);
 const [feedback,setFeedback]=useState(false);
 const repository=/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(siteConfig.repository)?siteConfig.repository.replace(/\/$/,''):'';
 return <><a className="skip-link" href="#archive">{L(['跳至资料库','Skip to archive','資料へ移動','자료로 이동'])}</a>
 <header className="archive-header"><a className="archive-brand" href="#"><img src="./brand/monster-auto-battle-mark-v1.png" alt=""/><span>MONSTER AUTO BATTLE<small>THE FIELD GUIDE</small></span></a><div className="header-actions"><span className="archive-tag">WIKI / 01</span><LanguageSelector/><a className="progress-link" href="#repairs">{L(["修复进度","Repair progress","修正状況","수정 진행 상황"] )} ↗</a><button className="feedback-link" onClick={()=>setFeedback(true)}>{L(['问题反馈','Feedback','フィードバック','문제 제보'])} ↗</button></div></header>
 <main><section className="archive-hero"><div className="hero-grid" aria-hidden="true"/><div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> MONSTER AUTO BATTLE · FIELD NOTES</p><h1>{L(['读懂怪物。','Know your monsters.','モンスターを知る。','몬스터를 이해하고.'])}<br/><em>{L(['构筑无限可能。','Build the unexpected.','可能性を組み上げる。','가능성을 조합하다.'])}</em></h1><p className="hero-description">{L(['从第一只怪物，到你的下一套阵容。探索技能、寻找羁绊，把每一个选择变成制胜的配合。','From your first monster to your next composition. Explore skills, discover synergies, and make every choice count.','最初の一体から、次の編成へ。スキルと特性を調べ、自分だけの組み合わせを見つけよう。','첫 몬스터부터 다음 조합까지. 스킬과 특성을 탐색하고 나만의 전략을 찾아보세요.'])}</p><a className="hero-cta" href="#archive">{L(['探索资料库','Explore the archive','資料を探索','자료 둘러보기'])}<span>↓</span></a><div className="hero-stats">{(['monsters','traits','equipment'] as const).map((category,i)=><div key={category}><strong>{catalog.filter(e=>e.category===category).length.toString().padStart(2,'0')}</strong><span>{L([['怪物档案','羁绊机制','契印收藏'][i],['MONSTERS','TRAITS','SIGILS'][i],['モンスター','特性','契印'][i],['몬스터','특성','계약 인장'][i]])}</span></div>)}</div></div>
 <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="art-coordinate">BESTIARY — M054</span><span className="art-rune">✧</span><img className="hero-dragon" src="./images/wiki/M054.png" alt=""/><div className="art-label"><span>COST / 05</span><strong>{L(catalog.find(e=>e.id==='M054')!.title)}</strong><small>MONSTER ARCHIVE / 054</small></div><span className="art-bottom">COLLECT KNOWLEDGE. CREATE POSSIBILITIES.</span></div></section>
 <section id="archive" className="archive-content"><div className="archive-section-heading"><span>01 / THE ARCHIVE</span><span>{L(['你的下一步，从这里开始','Your next move starts here','次の一手は、ここから','다음 전략의 시작'])}</span></div><WikiPage/></section>
 <RepairProgress repository={repository}/><section className="contribute"><div><p className="eyebrow">BETTER TOGETHER</p><h2>{L(['发现问题？一起让它变得更好。','Found something? Help us improve.','気づいたことを、改善につなげよう。','발견한 문제를 함께 개선해요.'])}</h2><p>{L(['游戏问题与资料修正，统一通过 GitHub Issues 跟进。','Track game issues and wiki corrections on GitHub Issues.','ゲームの問題や資料の修正は GitHub Issues で管理します。','게임 문제와 자료 수정은 GitHub Issues에서 관리합니다.'])}</p></div><button onClick={()=>setFeedback(true)}>{L(['提交反馈','Send feedback','報告する','제보하기'])} ↗</button></section></main>
 <footer><span>MONSTER AUTO BATTLE <small> / FIELD GUIDE</small></span><span>{L(['探索 · 组合 · 再来一局','EXPLORE · COMBINE · PLAY AGAIN','探索・編成・もう一戦','탐색 · 조합 · 다시 한 판'])}</span></footer>
 {feedback&&<FeedbackDialog repository={repository} close={()=>setFeedback(false)} L={L}/>}</>;
}
function FeedbackDialog({repository,close,L}:{repository:string;close:()=>void;L:(v:Localized)=>string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{ref.current?.showModal();},[]);
 return <dialog ref={ref} className="feedback-dialog" onCancel={close} onClose={close}><button className="dialog-close" onClick={close} aria-label={L(['关闭','Close','閉じる','닫기'])}>×</button><p className="eyebrow">COMMUNITY / FEEDBACK</p><h2>GitHub Issues</h2><p>{L(['普通游戏问题、资料错误和建议都可以在这里反馈。提交需要 GitHub 账号，Issue 内容会公开。','Report gameplay issues, wiki corrections, and suggestions. A GitHub account is required; issues are public.','ゲームの不具合、資料の誤り、提案を報告できます。GitHub アカウントが必要で、内容は公開されます。','게임 문제, 자료 오류, 제안을 남겨주세요. GitHub 계정이 필요하며 내용은 공개됩니다.'])}</p><p>{L(['日志请先移除个人信息；涉及他人数据或可被利用的安全漏洞，请勿公开复现细节。','Remove personal information from logs. Do not publicly disclose exploitable security flaws or other players’ data.','ログの個人情報を削除してください。他人のデータや悪用可能な脆弱性の詳細は公開しないでください。','로그의 개인정보를 지워주세요. 타인의 데이터나 악용 가능한 보안 취약점의 세부 사항은 공개하지 마세요.'])}</p>{repository?<a className="hero-cta" href={`${repository}/issues/new/choose`} target="_blank" rel="noreferrer">{L(['前往 GitHub','Open GitHub','GitHub を開く','GitHub 열기'])} ↗</a>:<p className="connection-note">{L(['反馈仓库筹备中，开放后将在这里提供入口。','The feedback repository is being prepared. Its link will appear here when available.','報告用リポジトリを準備中です。公開後、ここにリンクを掲載します。','제보 저장소를 준비 중입니다. 공개되면 여기에 링크가 표시됩니다.'])}</p>}<SecurityContact L={L}/></dialog>;
}
createRoot(document.getElementById('root')!).render(<LanguageProvider><App/></LanguageProvider>);
