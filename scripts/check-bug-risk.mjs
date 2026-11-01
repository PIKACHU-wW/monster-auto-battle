import assert from 'node:assert/strict';
import {assessBugRisk,riskValues,emptyRiskAnswers,RISK_RULE_VERSION} from '../src/bugRisk.ts';
const baseline={experience:'none',data:'none',others:'no',difficulty:'hard'};
const cases=[
 [{experience:'cosmetic',difficulty:'easy'},'low'],
 [{experience:'impaired',difficulty:'easy'},'medium'],
 [{experience:'blocked'},'medium'],
 [{experience:'blocked',difficulty:'easy'},'high'],
 [{data:'incorrect'},'high'],
 [{data:'destroyed'},'high'],
 [{others:'yes'},'high'],
 [{data:'unknown',difficulty:'easy'},'medium'],
 [{experience:'cosmetic',difficulty:'unknown'},'low'],
 [{experience:'unknown',data:'unknown',others:'unknown',difficulty:'unknown'},'medium'],
];
for(const [overrides,severity]of cases){const result=assessBugRisk({...baseline,...overrides});assert.equal(result.status,'rated');assert.equal(result.severity,severity);}
let combinations=0;
for(const experience of riskValues.experience)for(const data of riskValues.data)for(const others of riskValues.others)for(const difficulty of riskValues.difficulty){
 const a={experience,data,others,difficulty},copy=JSON.stringify(a),r=assessBugRisk(a);
 assert.equal(r.status,'rated');assert.equal(JSON.stringify(a),copy);assert.equal(r.version,RISK_RULE_VERSION);
 // Independent policy oracle checks decisions, not a second implementation of the score formula.
 const high=others==='yes'||data==='destroyed'||data==='incorrect'||(experience==='blocked'&&difficulty==='easy');
 const medium=experience==='impaired'||experience==='blocked'||experience==='unknown'||data==='unknown'||others==='unknown';
 assert.equal(r.severity,high?'high':medium?'medium':'low');
 assert.equal(r.needsReview,Object.values(a).includes('unknown'));
 assert.equal(r.unknownFields.length,Object.values(a).filter(v=>v==='unknown').length);
 assert.deepEqual(assessBugRisk({...a,severity:'low',score:-1000}),r);
 combinations++;
}
assert.equal(combinations,180);
for(const value of [undefined,null,[],{},emptyRiskAnswers(),'high'])assert.equal(assessBugRisk(value).status,'incomplete');
for(const field of Object.keys(baseline))for(const value of ['',null,undefined,'tampered',0,true,{},[]]){const r=assessBugRisk({...baseline,[field]:value});assert.equal(r.status,'incomplete');assert.ok([...r.missing,...r.invalid].includes(field));}
// The most damaging declared impact always wins, even with contradictory labels.
assert.equal(assessBugRisk({...baseline,data:'none',others:'yes'}).reason,'other-data');
assert.equal(assessBugRisk({...baseline,data:'destroyed',experience:'unknown'}).reason,'destroyed-data');

assert.equal(assessBugRisk({...baseline,experience:'blocked',difficulty:'easy'}).upgradedByConditions,true);
assert.equal(assessBugRisk({...baseline,experience:'blocked',difficulty:'easy',data:'incorrect'}).upgradedByConditions,false);
assert.equal(assessBugRisk({...baseline,experience:'cosmetic',difficulty:'unknown'}).baseSeverity,'low');
console.log(`PASS: ${combinations} combinations, severity invariants, uncertain answers, malformed input, no mutation, and ignored client-supplied scores.`);
