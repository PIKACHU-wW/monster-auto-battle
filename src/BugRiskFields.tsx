import {useI18n} from './i18n';
import {assessBugRisk,type RiskAnswers,type RiskField,type RiskResult,type RiskSeverity,type RiskReason} from './bugRisk';
import './bug-risk.css';
export const riskSeverityLabels:Record<RiskSeverity,string>={low:'低',medium:'中',high:'高'};
export const riskQuestions:{field:RiskField;title:string;hint:string;options:readonly (readonly [string,string])[]}[]=[
 {field:'experience',title:'功能影响',hint:'表现异常不影响功能；功能受限仍可继续使用；功能不可用表示相关功能无法完成。',options:[['none','无影响'],['cosmetic','表现异常'],['impaired','功能受限'],['blocked','功能不可用'],['unknown','不确定']]},
 {field:'data',title:'数据影响',hint:'数据错误指内容或数值不正确；丢失或损坏指数据缺失、损毁或无法读取。仅显示异常不属于实际数据错误。',options:[['none','无影响'],['incorrect','数据错误'],['destroyed','数据丢失或损坏'],['unknown','不确定']]},
 {field:'others',title:'数据修改权限',hint:'越权修改指能够修改正常权限之外的他人数据；仅影响其他玩家的使用体验不属于越权修改。',options:[['no','无越权修改'],['yes','可越权修改他人数据'],['unknown','不确定']]},
 {field:'difficulty',title:'触发条件',hint:'选择问题出现所需的条件；尚未确认触发方式时，选择“不确定”。',options:[['easy','常规条件可触发'],['hard','需特定条件'],['unknown','不确定']]},
];
const reasonLabels:Record<RiskReason,string>={
 'other-data':'存在越权修改他人数据的能力，建议高等级。',
 'destroyed-data':'存在数据丢失或损坏，建议高等级。',
 'incorrect-data':'实际数据存在错误，建议高等级。',
 'easy-blocker':'功能不可用且常规条件可触发，由中等级提升为高等级。',
 blocked:'功能不可用，建议中等级；触发条件不降低基础等级。',impaired:'存在功能受限，建议中等级。',
 'unknown-impact':'影响尚不明确，暂定中等级并等待确认。',cosmetic:'仅存在表现异常，无数据或权限影响，建议低等级。',
 'no-impact':'未报告功能、数据或权限影响，暂定低等级。',
};
export function RiskSummary({answers,result=assessBugRisk(answers),showAnswers=false}:{answers:RiskAnswers;result?:RiskResult;showAnswers?:boolean}){
 const {t}=useI18n();
 return <div className={`risk-result ${result.status==='rated'?result.severity:''}`} aria-live="polite" aria-atomic="true">
  <div className="risk-result-heading"><strong>{t('系统建议等级')}</strong>{result.status==='rated'&&<span className="risk-grade" data-severity={result.severity}>{t(riskSeverityLabels[result.severity])}</span>}</div>
  {result.status==='rated'?<><p>{t(reasonLabels[result.reason])}</p>{result.needsReview&&<p className="risk-review">{t('待确认：存在不确定项，审核时将结合问题描述核实。')}</p>}{showAnswers&&<dl className="risk-tags-summary">{riskQuestions.map(q=><div key={q.field}><dt>{t(q.title)}</dt><dd>{t(q.options.find(([value])=>value===answers[q.field])![1])}</dd></div>)}</dl>}</>:<p>{t('完成四个维度后显示建议等级；无法判断的维度可选择“不确定”。')}</p>}
 </div>;
}
export function BugRiskFields({answers,onChange}:{answers:RiskAnswers;onChange:(next:RiskAnswers)=>void}){
 const {t}=useI18n();
 return <section className="risk-fields" aria-labelledby="risk-title"><h3 id="risk-title">{t('问题影响与触发条件')}</h3><p className="risk-intro">{t('每个维度选择一项，系统将自动建议低、中或高等级。')}</p>
 {riskQuestions.map((q,i)=><fieldset key={q.field} aria-describedby={`risk-${q.field}-hint`}><legend><span aria-hidden="true">0{i+1}</span> {t(q.title)}</legend><p id={`risk-${q.field}-hint`} className="risk-hint">{t(q.hint)}</p><div className="risk-options">{q.options.map(([value,label])=><label key={value} className={answers[q.field]===value?'risk-option selected':'risk-option'}><input required type="radio" name={`risk-${q.field}`} value={value} checked={answers[q.field]===value} onChange={()=>onChange({...answers,[q.field]:value})}/><span>{t(label)}</span></label>)}</div></fieldset>)}
 <RiskSummary answers={answers}/><p className="risk-hint">{t('此等级为自动建议，最终等级由审核确认。')}</p></section>;
}
export function RiskGuide(){const {t}=useI18n();return <div className="panel"><h3>{t('分级规则')}</h3><div className="severity red"><h4>{t('高 · 数据或权限风险')}</h4><p>{t('数据错误、数据丢失或损坏、越权修改他人数据直接为高。功能不可用且常规条件可触发，也为高。')}</p></div><div className="severity purple"><h4>{t('中 · 功能受影响或待确认')}</h4><p>{t('功能受限、未满足升级条件的功能不可用，以及任一影响维度不确定，至少暂定为中。')}</p></div><div className="severity blue"><h4>{t('低 · 无影响或仅表现异常')}</h4><p>{t('无功能影响或仅表现异常，且数据和权限均无影响时为低；常规条件可触发不会使其升级。')}</p></div><p className="subtle">{t('需特定条件不会降低严重数据问题的等级。只有触发条件不确定时，保留基础等级并标记待确认。')}</p></div>;}
