import * as T from 'three';

// Authored, tileable surface detail. These are material maps, never scene backdrops.
export function createSurfaces(renderer:T.WebGLRenderer){
 const textures:T.Texture[]=[];
 const hash=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
 function noise(x:number,y:number,period:number,yPeriod=period){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const h=(a:number,b:number)=>hash((a%period+period)%period,(b%yPeriod+yPeriod)%yPeriod);return T.MathUtils.lerp(T.MathUtils.lerp(h(ix,iy),h(ix+1,iy),u),T.MathUtils.lerp(h(ix,iy+1),h(ix+1,iy+1),u),v);}
 function field(u:number,v:number){return noise(u*8,v*8,8)*.53+noise(u*16,v*16,16)*.27+noise(u*32,v*32,32)*.13+noise(u*64,v*64,64)*.07;}
 function surface(kind:'bark'|'earth'|'rock'|'wood'|'tile',repeat:number){
  const size=512,data=new Uint8Array(size*size*4),height=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const u=x/size,v=y/size,n=field(u,v),grain=hash(x,y);let rgb:number[],h=n;
   if(kind==='bark'){
    const warp=noise(u*8,v*8,8)*.7;const ridge=Math.pow(noise(u*96+warp*.7,v*8,96,8),.65);
    const fissure=Math.pow(1-ridge,2);h=ridge*.65+n*.35;
    const moss=T.MathUtils.smoothstep(n,.48,.72)*.65;
    rgb=[(66+68*h)*(1-moss*.25),(48+53*h)*(1+moss*.28),32+39*h];rgb=rgb.map(c=>c*(1-fissure*.7)+(grain-.5)*14);
   }else if(kind==='earth'){
    const grass=T.MathUtils.smoothstep(n,.38,.64);h=n*.7+grain*.3;
    rgb=[T.MathUtils.lerp(68,73,grass),T.MathUtils.lerp(49,87,grass),T.MathUtils.lerp(30,40,grass)].map(c=>c*(.55+n)+(grain-.5)*28);
   }else if(kind==='rock'){
    const veins=Math.pow(Math.abs(Math.sin((u+v)*Math.PI*8+n*10)),14);h=n*.8+grain*.1+veins*.1;
    rgb=[105,112,106].map(c=>c*(.5+n*.8)+veins*15+(grain-.5)*18);
   }else if(kind==='wood'){
    const lines=Math.pow(.5+.5*Math.sin(u*Math.PI*100+noise(u*8,v*8,8)*9),3);h=.4+lines*.25+n*.2;
    rgb=[111+lines*24,37+lines*13,29+lines*9].map(c=>c*(.6+n*.7)+(grain-.5)*8);
   }else{
    const col=u*16,row=v*12,cu=col-Math.floor(col),rv=row-Math.floor(row);
    const seam=cu<.065||rv<.07;const arch=Math.sin(cu*Math.PI);h=seam?.12:.45+arch*.35;
    const variation=hash(Math.floor(col),Math.floor(row));rgb=[38,61,64].map(c=>(seam?c*.35:c*(.7+arch*.4+variation*.3))+(grain-.5)*10);
   }
   const i=(y*size+x)*4;for(let c=0;c<3;c++){data[i+c]=T.MathUtils.clamp(rgb[c],0,255);height[i+c]=Math.round(h*255);}data[i+3]=height[i+3]=255;
  }
  const map=new T.DataTexture(data,size,size),bump=new T.DataTexture(height,size,size);
  for(const t of [map,bump]){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat,repeat);t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());t.needsUpdate=true;textures.push(t);}
  map.colorSpace=T.SRGBColorSpace;return {map,bumpMap:bump,bumpScale:kind==='bark'?.32:kind==='rock'?.18:.09};
 }
 const bark=surface('bark',2),earth=surface('earth',26),rock=surface('rock',2),wood=surface('wood',1),tile=surface('tile',1);
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;const ctx=canvas.getContext('2d')!;
 const gradient=ctx.createLinearGradient(0,0,128,0);gradient.addColorStop(0,'#244a22');gradient.addColorStop(.48,'#82a84c');gradient.addColorStop(.52,'#b3c879');gradient.addColorStop(1,'#365e2e');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,256);
 ctx.lineWidth=1.2;ctx.strokeStyle='#acc47b88';for(let y=8;y<250;y+=18){ctx.beginPath();ctx.moveTo(64,y+15);ctx.quadraticCurveTo(30,y,0,y-25);ctx.moveTo(64,y+15);ctx.quadraticCurveTo(98,y,128,y-25);ctx.stroke();}
 const leaf=new T.CanvasTexture(canvas);leaf.colorSpace=T.SRGBColorSpace;leaf.anisotropy=4;textures.push(leaf);
 return {bark,earth,rock,wood,tile,leaf,dispose:()=>textures.forEach(t=>t.dispose())};
}
