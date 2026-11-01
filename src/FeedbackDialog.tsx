import {useEffect,useRef} from 'react';
import {siteConfig} from './siteConfig';
import {SecurityContact} from './SecurityContact';
import type {Localized} from './wiki/types';

export function FeedbackDialog({repository,close,L}:{repository:string;close:()=>void;L:(v:Localized)=>string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{ref.current?.showModal();},[]);
 const gitee=/^https:\/\/gitee\.com\/[\w.-]+\/[\w.-]+\/?$/.test(siteConfig.giteeRepository)?siteConfig.giteeRepository.replace(/\/$/,''):'';
 return <dialog ref={ref} className="feedback-dialog" onCancel={close} onClose={close} aria-labelledby="feedback-title">
  <button className="dialog-close" onClick={close} aria-label={L(['关闭','Close','閉じる','닫기'])}>×</button>
  <p className="eyebrow">LETTERS TO THE INNKEEPER</p>
  <h2 id="feedback-title">{L(['选择反馈渠道','Choose a feedback channel','報告先を選ぶ','제보 채널 선택'])}</h2>
  <p>{L(['普通问题、资料修正和建议，可任选 GitHub 或 Gitee 提交。需要对应平台账号，Issue 内容会公开。','Use GitHub or Gitee for ordinary issues, wiki corrections and suggestions. An account on the chosen platform is required; issues are public.','通常の問題、資料の修正、提案は GitHub または Gitee へ。各サービスのアカウントが必要で、Issue は公開されます。','일반 문제, 자료 수정, 제안은 GitHub 또는 Gitee로 보내주세요. 해당 플랫폼 계정이 필요하며 Issue는 공개됩니다.'])}</p>
  <div className="feedback-channels">
   {repository&&<a className="hero-cta feedback-github" href={`${repository}/issues/new/choose`} target="_blank" rel="noreferrer"><span>GitHub Issues</span><span aria-hidden="true">↗</span></a>}
   {gitee&&<a className="hero-cta feedback-gitee" href={`${gitee}/issues/new`} target="_blank" rel="noreferrer"><span>Gitee Issues</span><span aria-hidden="true">↗</span></a>}
  </div>
  <p>{L(['同一问题选择一个平台提交即可；两边的处理状态暂不自动同步。','Submit each issue to one platform only. Statuses are not automatically synchronized between platforms.','同じ問題はいずれか一方へ。両サービスの進捗は自動同期されません。','같은 문제는 한 곳에만 제출해 주세요. 두 플랫폼의 처리 상태는 자동 동기화되지 않습니다.'])}</p>
  <p>{L(['上传日志或截图前请移除个人信息。严重漏洞的利用细节、他人数据请勿公开提交。','Remove personal information before uploading logs or screenshots. Do not publicly post exploit details or other players’ data.','ログや画像の個人情報を削除してください。悪用手順や他人のデータは公開しないでください。','로그나 스크린샷의 개인정보를 지워주세요. 악용 방법이나 다른 플레이어의 데이터는 공개하지 마세요.'])}</p>
  <SecurityContact L={L}/>
 </dialog>;
}
