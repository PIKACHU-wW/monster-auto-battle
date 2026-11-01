import assert from 'node:assert/strict';
import {resolveSceneEntitlements as resolve} from '../src/sceneEntitlements.ts';
for(const cents of [0,499])assert.deepEqual(resolve(cents,null,'elven'),{scenes:[],needsChoice:false});
for(const cents of [500,999]){
 assert.deepEqual(resolve(cents,null,null),{scenes:[],needsChoice:true});
 for(const choice of ['elven','celestial'])assert.deepEqual(resolve(cents,null,choice),{scenes:[choice],needsChoice:false});
 assert.deepEqual(resolve(cents,'elven','celestial'),{scenes:['elven'],needsChoice:false});
}
for(const cents of [1000,1500,100000])assert.deepEqual(resolve(cents,'elven','celestial'),{scenes:['elven','celestial'],needsChoice:false});
const granted=new Set(resolve(500,null,'elven').scenes);
for(let i=0;i<10;i++)for(const scene of resolve(500+500,'elven',null).scenes)granted.add(scene);
assert.deepEqual([...granted],['elven','celestial']);
for(const bad of [-1,500.1,NaN,Infinity,'1000',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>resolve(bad,null,null));
assert.throws(()=>resolve(500,null,'other'));
assert.throws(()=>resolve(500,'other',null));
console.log('Scene thresholds, locked choice, upgrade, replay and invalid inputs passed.');
