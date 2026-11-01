/** Pure, versioned rules. Input is player-reported evidence, not a verified rating.
 * Impact determines the base severity. Only an unavailable function under normal
 * conditions upgrades medium to high. Unknown impact is provisionally medium.
 * Legacy field IDs remain stable: experience = functional impact,
 * others = data modification permissions, difficulty = trigger conditions.
 * A future API must validate answers and recalculate here; never trust a client score.
 */
export const RISK_RULE_VERSION='1.1.0';
export const riskValues={
 experience:['none','cosmetic','impaired','blocked','unknown'],
 data:['none','incorrect','destroyed','unknown'],
 others:['no','yes','unknown'],
 difficulty:['easy','hard','unknown'],
} as const;
export type RiskField=keyof typeof riskValues;
export type RiskAnswers={[K in RiskField]:(typeof riskValues)[K][number]|null};
export type CompleteRiskAnswers={[K in RiskField]:Exclude<RiskAnswers[K],null>};
export type RiskSeverity='low'|'medium'|'high';
export type RiskReason='other-data'|'destroyed-data'|'incorrect-data'|'easy-blocker'|'blocked'|'impaired'|'unknown-impact'|'cosmetic'|'no-impact';
export type RiskResult=
 |{status:'incomplete';missing:RiskField[];invalid:RiskField[];version:string}
 |{status:'rated';severity:RiskSeverity;baseSeverity:RiskSeverity;upgradedByConditions:boolean;reason:RiskReason;needsReview:boolean;unknownFields:RiskField[];version:string};
export const emptyRiskAnswers=():RiskAnswers=>({experience:null,data:null,others:null,difficulty:null});
export function assessBugRisk(input:unknown):RiskResult{
 const obj=input!==null&&typeof input==='object'&&!Array.isArray(input)?input as Record<string,unknown>:{};
 const missing:RiskField[]=[],invalid:RiskField[]=[];
 for(const field of Object.keys(riskValues) as RiskField[]){
  const value=Object.hasOwn(obj,field)?obj[field]:undefined;
  if(value===null||value===undefined||value==='')missing.push(field);
  else if(typeof value!=='string'||!(riskValues[field] as readonly string[]).includes(value))invalid.push(field);
 }
 if(missing.length||invalid.length)return {status:'incomplete',missing,invalid,version:RISK_RULE_VERSION};
 const a=obj as CompleteRiskAnswers;
 const unknownFields=(Object.keys(riskValues) as RiskField[]).filter(k=>a[k]==='unknown');
 const unknownImpact=unknownFields.some(k=>k!=='difficulty');
 const dataRisk=a.others==='yes'||a.data==='incorrect'||a.data==='destroyed';
 const baseSeverity:RiskSeverity=dataRisk?'high':a.experience==='impaired'||a.experience==='blocked'||unknownImpact?'medium':'low';
 const upgradedByConditions=baseSeverity==='medium'&&a.experience==='blocked'&&a.difficulty==='easy';
 const severity:RiskSeverity=upgradedByConditions?'high':baseSeverity;
 const reason:RiskReason=a.others==='yes'?'other-data':a.data==='destroyed'?'destroyed-data':a.data==='incorrect'?'incorrect-data':a.experience==='blocked'&&a.difficulty==='easy'?'easy-blocker':a.experience==='blocked'?'blocked':a.experience==='impaired'?'impaired':unknownImpact?'unknown-impact':a.experience==='cosmetic'?'cosmetic':'no-impact';
 return {status:'rated',severity,baseSeverity,upgradedByConditions,reason,needsReview:unknownFields.length>0,unknownFields,version:RISK_RULE_VERSION};
}
