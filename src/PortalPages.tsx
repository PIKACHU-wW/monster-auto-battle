import {useI18n} from './i18n';
import {useState} from 'react';

export {WikiPage} from './WikiPage';

export function RankingsPage(){
 const {t}=useI18n();
 const [kind,setKind]=useState<'sponsor'|'bugs'>('sponsor');
 return <><section className="page-title"><p className="eyebrow">EVERY CONTRIBUTION MATTERS</p><h1>{t("每一份贡献，都值得被记住。")}</h1><p>{t("查看早期赞助与问题反馈贡献，无需注册或登录。")}</p></section><div className="tabs" aria-label={t("排行榜类型")}><button aria-pressed={kind==='sponsor'} className={kind==='sponsor'?'selected':''} onClick={()=>setKind('sponsor')}>{t("早期赞助榜")}</button><button aria-pressed={kind==='bugs'} className={kind==='bugs'?'selected':''} onClick={()=>setKind('bugs')}>{t("Bug 贡献榜")}</button></div>
 <section className="panel"><div className="section-heading"><h2>{kind==='sponsor'?t("早期赞助榜"):t("Bug 贡献榜")}</h2><span className="pill">{t("尚未接入真实数据")}</span></div><div className="table-scroll"><table><thead><tr><th>{t("名次")}</th><th>{t("VRChat 用户名")}</th><th>{kind==='sponsor'?t("累计赞助"):t("贡献经验")}</th><th>{kind==='sponsor'?t("暂定档位"):t("有效 Bug 数")}</th></tr></thead><tbody><tr><td colSpan={4}><div className="empty"><span>◇</span><h3>{kind==='sponsor'?t("等待第一份支持"):t("等待第一份确认的贡献")}</h3><p>{kind==='sponsor'?t("核验后的赞助记录将在这里汇总展示。"):t("经过审核的有效问题才会计入贡献。")}</p></div></td></tr></tbody></table></div></section>
 <section className="panel"><h3>{kind==='sponsor'?t("关于早期结算"):t("关于贡献记录")}</h3><p>{kind==='sponsor'?t("测试期间的名次仅为暂定。测试结束后按累计有效赞助统一结算：红色 1–25，紫色 26–100，蓝色 101–200，绿色 201 名及以后。所有早期赞助者永久留名，人数不限。"):t("报告由审核人员判定等级和有效性，数量与质量分别记录。重复问题合并处理；具体经验数值和黑客等级阈值仍待确定。")}</p><p className="subtle">{t("排行榜只展示经确认的公开信息，不展示原始日志、私密报告或支付凭据。")}</p></section></>;
}
