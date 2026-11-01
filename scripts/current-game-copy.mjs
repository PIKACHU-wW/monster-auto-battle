import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import assert from 'node:assert/strict';

export async function readBakedStars(root){
 const blocks=[];let block=null,pending='';
 const flush=()=>{if(pending){block.push(JSON.parse(pending));pending='';}};
 const input=readline.createInterface({input:fs.createReadStream(path.join(root,'Assets/Scenes/MonsterAutoBattler_LeanTest.unity')),crlfDelay:Infinity});
 for await(const line of input){
  if(line==='  starDescriptions:'){block=[];blocks.push(block);continue;}
  if(!block)continue;
  if(line.startsWith('  - ')){flush();pending=line.slice(4);}
  else if(line.startsWith('    ')&&pending){pending+=line.trim();}
  else{flush();block=null;}
 }
 if(block)flush();
 assert.ok(blocks.length>0,'Missing baked star descriptions');
 for(const b of blocks){assert.equal(b.length,165);assert.deepEqual(b,blocks[0],'Scene detail panels have different star copy');}
 return {descriptions:blocks[0],panelCount:blocks.length};
}

export function renderLiveTokens(text,m,star){
 const body=[1,1.8,3][star-1];
 return text.replace(/\{([AH])([\d.]+)\}/g,(_,kind,n)=>{
  const reference=Number(kind==='H'?m.hp:m.atk);
  return String(Math.round(Number(n)*(.55+.45*Math.trunc(reference*body)/Math.max(1,reference*body))*100)/100);
 });
}

export function effectOnly(text){
 const lines=text.split('\n');
 if(/^(基础属性|Base stats|基礎能力|基本ステータス|基本能力|기본 능력치|기본 능력|기본 스탯)/.test(lines[0]))lines.shift();
 return lines.join('\n').replace(/^(特殊效果|Effect|特殊効果|効果|특수 효과|효과)\s*[:：]\s*/,'').trim();
}
