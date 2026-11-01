import {siteConfig} from './siteConfig';
import {type Localized} from './wiki/types';
export function SecurityContact({L}:{L:(v:Localized)=>string}){
 const email=siteConfig.securityEmail.trim();
 const valid=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
 return <section className="security-contact"><p className="eyebrow">HIGH PRIORITY ONLY</p><h3>{L(['高优先级漏洞专用邮箱','High-priority vulnerability email','高優先度の脆弱性専用メール','높은 우선순위 취약점 전용 이메일'])}</h3><p>{L(['仅受理数据丢失或损坏、未经授权的数据修改、可被利用的严重安全漏洞，以及导致核心游戏功能大范围不可用的问题。','For data loss or corruption, unauthorized data changes, exploitable security flaws, or widespread failures of core gameplay.','データ消失・破損、不正なデータ変更、悪用可能な重大な脆弱性、主要機能の広範な停止のみ受け付けます。','데이터 손실·손상, 무단 데이터 변경, 악용 가능한 심각한 취약점, 핵심 게임 기능의 광범위한 장애만 접수합니다.'])}</p>{valid?<a className="security-email" href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('[Monster Auto Battle] High-priority vulnerability')}`}>{email}</a>:<p className="connection-note">{L(['专用邮箱待公布。','Contact email to be announced.','専用アドレスは後日掲載します。','전용 이메일은 추후 공개됩니다.'])}</p>}<p className="security-policy">{L(['普通问题提交至此邮箱不会收到回复，请通过 GitHub Issues 提交。','Ordinary issues sent to this address will not receive a reply. Please use GitHub Issues.','通常の問題をこのメールに送信しても返信はありません。GitHub Issues をご利用ください。','일반 문제를 이 이메일로 보내면 답변하지 않습니다. GitHub Issues로 제출해 주세요.'])}</p></section>;
}
