import * as T from 'three';
import {createSurfaces} from './surfaces';
import {addUndergrowth,groundY} from './undergrowth';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const smooth=(a:number,b:number,x:number)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const noiseGLSL=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(3.1,4.7);a*=.5;}return v;}`;

/** A modeled world, without photo backdrops, external textures or section selectors. */
export function createJourney(host:HTMLDivElement){
 let seed=7026;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296;};
 const mobile=matchMedia('(max-width:680px)').matches;
 const renderer=new T.WebGLRenderer({alpha:false,antialias:!mobile,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
 renderer.domElement.className='journey-canvas';renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#0d272c');scene.fog=new T.FogExp2('#183b3d',.012);
 const camera=new T.PerspectiveCamera(62,1,.1,650);
 const composer=mobile?null:new EffectComposer(renderer);const bloom=mobile?null:new UnrealBloomPass(new T.Vector2(1,1),.3,.65,.85);const renderPass=mobile?null:new RenderPass(scene,camera);const outputPass=mobile?null:new OutputPass();if(composer&&bloom&&renderPass&&outputPass){composer.addPass(renderPass);composer.addPass(bloom);composer.addPass(outputPass);}
 // A small procedural environment supplies soft reflection to metal and water.
 const envCanvas=document.createElement('canvas');envCanvas.width=256;envCanvas.height=128;const envCtx=envCanvas.getContext('2d')!;const envGradient=envCtx.createLinearGradient(0,0,0,128);envGradient.addColorStop(0,'#759ea9');envGradient.addColorStop(.45,'#e4d7b7');envGradient.addColorStop(.6,'#8c9681');envGradient.addColorStop(1,'#273729');envCtx.fillStyle=envGradient;envCtx.fillRect(0,0,256,128);const envTexture=new T.CanvasTexture(envCanvas);envTexture.mapping=T.EquirectangularReflectionMapping;envTexture.colorSpace=T.SRGBColorSpace;const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromEquirectangular(envTexture);scene.environment=environment.texture;scene.environmentIntensity=.35;envTexture.dispose();pmrem.dispose();
 const hemi=new T.HemisphereLight('#c3e3e1','#172419',.9);scene.add(hemi);
 const sun=new T.DirectionalLight('#ffe3ac',3.5);sun.position.set(-30,65,10);sun.castShadow=true;sun.shadow.mapSize.setScalar(mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-42,right:42,top:42,bottom:-42,near:1,far:180});sun.shadow.bias=-.00025;sun.shadow.normalBias=.18;scene.add(sun,sun.target);
 const rim=new T.DirectionalLight('#8fcca7',.8);rim.position.set(25,28,-90);scene.add(rim);
 const forest=new T.Group(),heaven=new T.Group();scene.add(forest,heaven);
 const materials=new Set<T.Material>(),geometries=new Set<T.BufferGeometry>();
 function mat(color:string,extra:T.MeshStandardMaterialParameters={}){const m=new T.MeshStandardMaterial({color,roughness:.85,...extra});materials.add(m);return m;}
 function geo<G extends T.BufferGeometry>(g:G){geometries.add(g);return g;}
 const surfaces=createSurfaces(renderer);
 const bark=mat('#c9b6a0',{...surfaces.bark}),moss=mat('#c1c7a6',{...surfaces.earth}),leafMat=mat('#dde7a8',{map:surfaces.leaf,side:T.DoubleSide,roughness:.7,emissive:'#426221',emissiveIntensity:.12}),gold=mat('#dbb672',{metalness:.65,roughness:.28}),jade=mat('#71978b',{metalness:.1,roughness:.65,...surfaces.rock}),stone=mat('#c3c3b5',{...surfaces.rock}),darkStone=mat('#68756b',{...surfaces.rock}),wood=mat('#d4a093',{...surfaces.wood}),roofMat=mat('#96b6af',{...surfaces.tile,metalness:.12,roughness:.5,side:T.DoubleSide}),glow=mat('#e8cb87',{emissive:'#e8b85a',emissiveIntensity:1.2}),aqua=mat('#85ead5',{emissive:'#39bcab',emissiveIntensity:1.4});
 const cube=geo(new T.BoxGeometry(1,1,1)),cylinder=geo(new T.CylinderGeometry(1,1,1,10));
 function mesh(g:T.BufferGeometry,m:T.Material,parent:T.Object3D,pos:[number,number,number],scale:[number,number,number]=[1,1,1]){const o=new T.Mesh(g,m);o.position.set(...pos);o.scale.set(...scale);o.castShadow=m instanceof T.MeshStandardMaterial;o.receiveShadow=o.castShadow;parent.add(o);return o;}
 function box(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number){return mesh(cube,m,parent,[x,y,z],[w,h,d]);}
 function beam(start:T.Vector3,end:T.Vector3,r0:number,r1:number){const d=end.clone().sub(start),g=new T.CylinderGeometry(r1,r0,d.length(),7);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));g.translate(...start.clone().add(end).multiplyScalar(.5).toArray());return g;}
 function merged(parts:T.BufferGeometry[]){const result=geo(mergeGeometries(parts,false)!);parts.forEach(g=>g.dispose());return result;}
 const dummy=new T.Object3D();

 // Curved trunks, buttress roots, forked limbs and individually modeled leaves.
 const leafShape=new T.Shape();leafShape.moveTo(0,-.85);leafShape.quadraticCurveTo(.75,-.15,0,1);leafShape.quadraticCurveTo(-.75,-.15,0,-.85);
 const leafGeo=geo(new T.ShapeGeometry(leafShape,3));const leafUV=leafGeo.getAttribute('uv');const leafPos=leafGeo.getAttribute('position');for(let i=0;i<leafUV.count;i++)leafUV.setXY(i,(leafPos.getX(i)+.75)/1.5,(leafPos.getY(i)+.85)/1.85);const lp=leafGeo.getAttribute('position');for(let i=0;i<lp.count;i++)lp.setZ(i,Math.sin(lp.getY(i)*2)*.12);leafGeo.computeVertexNormals();
 const trees:{group:T.Group;x:number;z:number;side:number;phase:number;leaves:T.InstancedMesh}[]=[];const green=new T.Color();
 for(let n=0;n<(mobile?20:32);n++){
  const side=n%2?-1:1,row=Math.floor(n/2),x=side*(9+random()*12+(row%3===0?0:4)),z=28-row*9-random()*7;
  const group=new T.Group();group.position.set(x,groundY(x,z),z);forest.add(group);const height=21+random()*17,width=1+random()*.9;
  const curve=new T.CatmullRomCurve3([new T.Vector3(),new T.Vector3(side*.8,height*.32,0),new T.Vector3(-side*.9,height*.7,1),new T.Vector3(side*1.3,height,0)]);
  const trunk=new T.TubeGeometry(curve,24,width,14,false),tp=trunk.getAttribute('position');for(let i=0;i<tp.count;i++){const taper=1-.65*tp.getY(i)/height;const ridge=1+Math.sin(Math.atan2(tp.getZ(i),tp.getX(i))*9+tp.getY(i)*.3)*.09;tp.setX(i,tp.getX(i)*taper*ridge);tp.setZ(i,tp.getZ(i)*taper*ridge);}const trunkUV=trunk.getAttribute('uv');for(let i=0;i<trunkUV.count;i++){const u=trunkUV.getX(i);trunkUV.setXY(i,trunkUV.getY(i),u*3);}trunk.computeVertexNormals();
  const parts:T.BufferGeometry[]=[trunk],tips:T.Vector3[]=[];
  for(let j=0;j<7;j++){const a=j*2.4+random(),y=height*(.47+j*.065),r=5+random()*5;const origin=new T.Vector3(0,y,0),elbow=new T.Vector3(Math.cos(a)*r*.58,y+2,Math.sin(a)*r*.55),tip=new T.Vector3(Math.cos(a)*r,y+4+random()*3,Math.sin(a)*r);parts.push(beam(origin,elbow,width*.45,.28),beam(elbow,tip,.28,.035));tips.push(tip);const fork=tip.clone().add(new T.Vector3(-2,2,2));parts.push(beam(elbow,fork,.18,.025));tips.push(fork);}
  for(let j=0;j<6;j++){const a=j/6*Math.PI*2;parts.push(beam(new T.Vector3(Math.cos(a)*4,0,Math.sin(a)*4),new T.Vector3(0,2.7,0),.09,width*.7));}
  mesh(merged(parts),bark,group,[0,0,0]);
  const leaves=new T.InstancedMesh(leafGeo,leafMat,mobile?(n<8?500:280):(n<8?1300:700));
  for(let j=0;j<leaves.count;j++){const tip=tips[j%tips.length];dummy.position.set(tip.x+(random()-.5)*8,tip.y+(random()-.5)*4,tip.z+(random()-.5)*7);dummy.rotation.set(random()*Math.PI,random()*Math.PI,random()*6);dummy.scale.set(.32+random()*.3,.4+random()*.5,.5);dummy.updateMatrix();leaves.setMatrixAt(j,dummy.matrix);green.setHSL(.20+random()*.10,.24+random()*.18,.48+random()*.23);leaves.setColorAt(j,green);}
  leaves.castShadow=true;leaves.receiveShadow=true;leaves.computeBoundingSphere();group.add(leaves);trees.push({group,x,z,side,phase:random()*6,leaves});
 }
 const distantTrunks=new T.InstancedMesh(cylinder,bark,mobile?36:70),distantLeaves=new T.InstancedMesh(leafGeo,leafMat,mobile?5000:14000);const farTrees:{x:number;y:number;z:number}[]=[];
 for(let i=0;i<distantTrunks.count;i++){const x=(i%2?1:-1)*(27+random()*48),z=40-random()*220,h=23+random()*17;farTrees.push({x,y:h,z});dummy.position.set(x,h/2-.5,z);dummy.rotation.set(0,random()*6,(random()-.5)*.13);dummy.scale.set(.7+random()*.6,h,.7+random()*.6);dummy.updateMatrix();distantTrunks.setMatrixAt(i,dummy.matrix);}
 for(let i=0;i<distantLeaves.count;i++){const tree=farTrees[i%farTrees.length];dummy.position.set(tree.x+(random()-.5)*17,tree.y+(random()-.5)*9,tree.z+(random()-.5)*15);dummy.rotation.set(random()*3,random()*6,random()*3);dummy.scale.setScalar(.5+random()*.6);dummy.updateMatrix();distantLeaves.setMatrixAt(i,dummy.matrix);}forest.add(distantTrunks,distantLeaves);
 const floorGeo=geo(new T.PlaneGeometry(350,340,140,160));floorGeo.rotateX(-Math.PI/2);const fp=floorGeo.getAttribute('position');for(let i=0;i<fp.count;i++){const x=fp.getX(i),z=fp.getZ(i);fp.setY(i,groundY(x,z-44));}floorGeo.computeVertexNormals();mesh(floorGeo,moss,forest,[0,0,-44]);
 const streamMat=new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;${noiseGLSL}void main(){float rip=fbm(vec2(vUv.x*8.,vUv.y*70.-time*.12));float line=pow(.5+.5*sin(vUv.y*780.+rip*18.-time*.7),24.);float edge=smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x);vec3 c=mix(vec3(.025,.09,.08),vec3(.18,.32,.24),rip);c+=vec3(.65,.76,.6)*line*.065*edge;gl_FragColor=vec4(c,1.);}`});materials.add(streamMat);
 const streamGeo=geo(new T.PlaneGeometry(6,180,12,60));streamGeo.rotateX(-Math.PI/2);const sp=streamGeo.getAttribute('position');for(let i=0;i<sp.count;i++)sp.setX(i,sp.getX(i)+Math.sin(sp.getZ(i)*.035)*3);mesh(streamGeo,streamMat,forest,[0,-1.15,-50]);
 const rocks=new T.InstancedMesh(geo(new T.IcosahedronGeometry(1,2)),darkStone,mobile?40:80);
 for(let i=0;i<rocks.count;i++){dummy.position.set((i%2?1:-1)*(4+random()*16),-1,30-random()*175);dummy.scale.set(1+random()*2,.6+random()*1.4,1+random()*2);dummy.rotation.set(random(),random()*6,random());dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);}rocks.castShadow=true;rocks.receiveShadow=true;forest.add(rocks);
 addUndergrowth(forest,random,mobile,leafMat,darkStone,geo);
 const crystals=new T.InstancedMesh(geo(new T.ConeGeometry(.4,2,5)),aqua,40);
 for(let i=0;i<40;i++){dummy.position.set((i%2?1:-1)*(4+random()*3),-.2,22-random()*138);dummy.scale.setScalar(.3+random()*.8);dummy.rotation.set((random()-.5)*.5,random()*6,(random()-.5)*.5);dummy.updateMatrix();crystals.setMatrixAt(i,dummy.matrix);}forest.add(crystals);
 const gate=new T.Group();gate.position.set(0,7,-72);forest.add(gate);const gateHalves:T.Group[]=[];
 for(const side of [-1,1]){const half=new T.Group();gate.add(half);gateHalves.push(half);for(let layer=0;layer<2;layer++){const curve=new T.CatmullRomCurve3(Array.from({length:13},(_,i)=>{const a=i/12*Math.PI*.87;return new T.Vector3(side*Math.sin(a)*(8+layer*.7),-5+Math.cos(a)*(12+layer*.7),-layer*.2);}));mesh(geo(new T.TubeGeometry(curve,32,layer?.055:.16,6,false)),layer?aqua:gold,half,[0,0,0]);}}

 // Soft, tapered shafts catch the canopy light; their noise moves very slowly.
 const shaftMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;${noiseGLSL}void main(){float edge=pow(sin(vUv.x*3.14159),2.);float ends=smoothstep(0.,.16,vUv.y)*(1.-smoothstep(.55,1.,vUv.y));float bands=.6+.4*fbm(vec2(vUv.x*5.,vUv.y*3.+time*.025));gl_FragColor=vec4(.85,1.,.63,edge*ends*bands*.085);}`});materials.add(shaftMat);
 const shaftGeo=geo(new T.PlaneGeometry(1,1));for(let i=0;i<7;i++){const shaft=mesh(shaftGeo,shaftMat,forest,[-4+(i%3)*5,15,16-i*14],[3+i%3,35,1]);shaft.rotation.z=-.35;shaft.rotation.y=.15;}

 // Hip roofs curve upwards at the corners. Ribs and eaves follow the curvature.
 function roof(parent:T.Object3D,w:number,d:number,y:number,h:number){
  const g=new T.PlaneGeometry(w,d,14,12);g.rotateX(-Math.PI/2);const p=g.getAttribute('position');const height=(x:number,z:number)=>{const nx=Math.abs(x)/(w/2),nz=Math.abs(z)/(d/2);return h*Math.pow(Math.max(0,1-Math.max(nx,nz)),1.7)+.9*Math.pow(nx*nz,4);};
  for(let i=0;i<p.count;i++)p.setY(i,height(p.getX(i),p.getZ(i)));g.computeVertexNormals();mesh(geo(g),roofMat,parent,[0,y,0]);
  const border:T.Vector3[]=[];for(let side=0;side<4;side++)for(let i=0;i<=16;i++){const f=i/16*2-1,x=side===0?-w/2:side===1?f*w/2:side===2?w/2:-f*w/2,z=side===0?f*d/2:side===1?d/2:side===2?-f*d/2:-d/2;border.push(new T.Vector3(x,y+height(x,z),z));}border.push(border[0]);mesh(geo(new T.TubeGeometry(new T.CatmullRomCurve3(border,false,'centripetal'),96,.08,5,false)),gold,parent,[0,0,0]);
  const ribs:T.BufferGeometry[]=[];for(let n=-5;n<=5;n++){const x=n*w/13,pts:T.Vector3[]=[];for(let i=0;i<=12;i++){const z=(i/12-.5)*d;pts.push(new T.Vector3(x,y+height(x,z)+.04,z));}ribs.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),12,.035,3,false));}mesh(merged(ribs),jade,parent,[0,0,0]);
 }
 function pavilion(parent:T.Object3D,x:number,y:number,z:number,scale:number,levels:number){
  const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);parent.add(g);box(g,stone,0,-.6,0,15,1.2,12);box(g,stone,0,.05,0,14,.12,11);
  for(let tier=0;tier<levels;tier++){
   const w=16*(1-tier*.18),d=11*(1-tier*.18),base=tier*6;box(g,wood,0,base+2.4,-d*.3,w-2,4.6,.6);
   for(const sx of [-1,1])for(const sz of [-1,1]){mesh(cylinder,wood,g,[sx*(w/2-1),base+2.5,sz*(d/2-1)],[.34,5,.34]);mesh(cylinder,gold,g,[sx*(w/2-1),base+.3,sz*(d/2-1)],[.45,.45,.45]);}
   box(g,gold,0,base+4.7,d/2-1,w,.3,.32);
   for(let j=-2;j<=2;j++){box(g,glow,j*(w-3)/5,base+2.65,-d*.3+.35,.85,2.3,.08);for(const dy of [1.9,2.65,3.4])box(g,wood,j*(w-3)/5,base+dy,-d*.3+.42,1,.08,.08);}
   for(const sx of [-1,1])for(const sz of [-1,1])for(let k=0;k<3;k++){box(g,wood,sx*(w/2-1),base+4.1+k*.23,sz*(d/2-1),.65+k*.38,.17,.65+k*.38);}
   for(let j=-2;j<=2;j++)for(const offset of [-.27,0,.27])box(g,wood,j*(w-3)/5+offset,base+2.65,-d*.3+.44,.055,2.35,.09);
   for(const sx of [-1,1]){box(g,wood,sx*(w/2-1),base+2.4,0,.25,4.6,d-2);box(g,gold,sx*(w/2-1),base+4.25,0,.28,.1,d-2);}
   roof(g,w+4,d+4,base+5,2.6);
  }mesh(geo(new T.ConeGeometry(.24,2,6)),gold,g,[0,levels*6+2,0]);return g;
 }
 function floatingRock(radius:number,height:number,sides:number){const g=new T.CylinderGeometry(radius*.22,radius,height,sides,12);const p=g.getAttribute('position');for(let i=0;i<p.count;i++){const y=p.getY(i),scale=1+Math.sin(y*1.7)*.14+Math.sin(Math.atan2(p.getZ(i),p.getX(i))*5+y*.4)*.13;p.setX(i,p.getX(i)*scale);p.setZ(i,p.getZ(i)*scale);}g.computeVertexNormals();return geo(g);}
 const palace=new T.Group();palace.position.set(0,37,-185);heaven.add(palace);
 mesh(floatingRock(24,35,11),darkStone,palace,[0,-18,0]).rotation.z=Math.PI;
 mesh(geo(new T.CylinderGeometry(24,22,2,12)),stone,palace,[0,-1,0]);mesh(geo(new T.TorusGeometry(24,.13,5,96)),gold,palace,[0,.12,0]).rotation.x=Math.PI/2;
 const paving=mat('#d1cec2',{...surfaces.rock});for(let x=-20;x<=20;x+=4)for(let z=-20;z<=20;z+=4){if(x*x+z*z<440)box(palace,(x/4+z/4)%3===0?paving:stone,x,.08,z,3.9,.1,3.9);}
 for(const side of [-1,1])for(let j=0;j<4;j++){const x=side*8,z=12-j*6;mesh(cylinder,gold,palace,[x,1.3,z],[.08,2.6,.08]);mesh(geo(new T.SphereGeometry(.55,6,5)),glow,palace,[x,2.8,z],[1,1.3,1]);box(palace,wood,x,3.5,z,1.1,.15,1.1);mesh(geo(new T.ConeGeometry(.8,.4,4)),roofMat,palace,[x,3.75,z]).rotation.y=Math.PI/4;}
 const medallion=new T.Group();medallion.position.set(0,.2,7);palace.add(medallion);for(const radius of [2.7,3,3.6])mesh(geo(new T.TorusGeometry(radius,.035,4,64)),gold,medallion,[0,0,0]).rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const petal=mesh(leafGeo,gold,medallion,[Math.sin(a)*1.6,.02,Math.cos(a)*1.6],[.6,1.4,1]);petal.rotation.set(-Math.PI/2,0,a);}
 pavilion(palace,0,0,-6,1.25,3);pavilion(palace,-18,0,2,.7,2);pavilion(palace,18,0,2,.7,2);
 for(let j=0;j<12;j++)box(palace,stone,0,.15-j*.25,15+j*.7,10,.4,1);
 for(const side of [-1,1])for(let i=0;i<9;i++){mesh(cylinder,jade,palace,[side*15,1.2,-9+i*3],[.18,2.5,.18]);box(palace,gold,side*15,2,-9+i*3,.15,.15,3.1);}
 for(const side of [-1,1]){box(palace,wood,side*7,5,17,.8,10,.8);box(palace,gold,side*7,1,17,1.3,.6,1.3);}box(palace,gold,0,9.1,17,17,.6,1);const gateway=new T.Group();gateway.position.set(0,9.5,17);palace.add(gateway);roof(gateway,19,4,0,1.8);
 const orbit=new T.Group();orbit.position.set(0,13,-14);palace.add(orbit);const rings:T.Mesh[]=[];
 for(let j=0;j<3;j++){const ring=mesh(geo(new T.TorusGeometry(19+j*1.1,.07,5,128)),j===1?aqua:gold,orbit,[0,0,0]);ring.rotation.set(j*.3,j*.22,0);rings.push(ring);}
 const orbitNodes=new T.Group();orbit.add(orbitNodes);const nodeGeo=geo(new T.OctahedronGeometry(.25));for(let j=0;j<16;j++){const a=j/16*Math.PI*2;mesh(nodeGeo,glow,orbitNodes,[Math.cos(a)*20,Math.sin(a)*20,0]).rotation.z=a;}
 const islands:T.Group[]=[];for(let i=0;i<(mobile?4:8);i++){const island=new T.Group();island.position.set((i%2?1:-1)*(35+i*8),30+(i%3)*8,-170-i*16);island.scale.setScalar(.4+random()*.5);heaven.add(island);mesh(floatingRock(13,24,14),darkStone,island,[0,-12,0]).rotation.z=Math.PI;mesh(geo(new T.CylinderGeometry(13,12,1,8)),stone,island,[0,0,0]);pavilion(island,0,1,0,.8,2);islands.push(island);}
 const steps:T.Mesh[]=[];const stepGeo=geo(new T.CylinderGeometry(2.8,2.4,.45,6));for(let i=0;i<16;i++)steps.push(mesh(stepGeo,jade,heaven,[Math.sin(i*.3)*3,24+i*.72,-105-i*4.5]));

 // Batch static architecture by material, preserving the animated celestial rings.
 function batchStatic(root:T.Group,skip?:T.Object3D){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();
  const batches=new Map<T.Material,T.BufferGeometry[]>(),originals:T.Mesh[]=[];
  root.traverse(o=>{if(!(o instanceof T.Mesh)||o instanceof T.InstancedMesh)return;
   for(let p:T.Object3D|null=o;p&&p!==root;p=p.parent)if(p===skip)return;
   if(Array.isArray(o.material))return;
   const g=o.geometry.clone();g.applyMatrix4(inverse.clone().multiply(o.matrixWorld));
   const list=batches.get(o.material)||[];list.push(g);batches.set(o.material,list);originals.push(o);
  });
  originals.forEach(o=>o.removeFromParent());
  for(const [material,parts] of batches)mesh(merged(parts),material,root,[0,0,0]);
 }
 batchStatic(palace,orbit);islands.forEach(island=>batchStatic(island));

 // Cloud density fields and fireflies are computed in shaders, with no textures.
 const cloudMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},warmth:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;uniform float warmth;${noiseGLSL}void main(){vec2 p=vUv*2.-1.;float edge=1.-smoothstep(.15,1.,length(p*vec2(.8,1.2)));float f=fbm(vUv*4.+vec2(time*.008,0.));float density=smoothstep(.15,.85,f)*edge;vec3 shade=mix(vec3(.32,.53,.55),vec3(.62,.66,.69),warmth);shade+=pow(f,3.)*.4;gl_FragColor=vec4(shade,density*.85*(.12+warmth*.88));}`});materials.add(cloudMat);
 const cloudGeo=geo(new T.PlaneGeometry(1,1)),clouds:T.Mesh[]=[];for(let i=0;i<(mobile?13:24);i++)clouds.push(mesh(cloudGeo,cloudMat,scene,[(random()-.5)*210,18+random()*10,-92-random()*170],[65+random()*80,20+random()*30,1]));
 const skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{journey:{value:0}},vertexShader:'varying vec3 vWorld;void main(){vWorld=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 vWorld;uniform float journey;void main(){float h=normalize(vWorld).y;vec3 top=mix(vec3(.015,.065,.11),vec3(.035,.08,.15),journey);vec3 horizon=mix(vec3(.035,.09,.08),vec3(.46,.32,.18),journey);vec3 c=mix(horizon,top,smoothstep(-.1,.7,h));float sun=pow(max(0.,dot(normalize(vWorld),normalize(vec3(-.5,.2,-1.)))),70.);c+=vec3(1.,.68,.3)*sun*journey*.5;gl_FragColor=vec4(c,1.);}'});skyMat.fragmentShader=skyMat.fragmentShader.replace('varying vec3 vWorld;',noiseGLSL+'varying vec3 vWorld;').replace('gl_FragColor=vec4(c,1.);','vec3 dir=normalize(vWorld);float wisps=fbm(dir.xz*4.+dir.y*2.);c+=vec3(.15,.13,.1)*smoothstep(.48,.8,wisps)*journey*smoothstep(-.05,.3,dir.y);gl_FragColor=vec4(c,1.);');materials.add(skyMat);const sky=mesh(geo(new T.SphereGeometry(420,20,12)),skyMat,scene,[0,0,0]);
 const count=mobile?100:240,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*70;positions[i*3+1]=random()*22;positions[i*3+2]=35-random()*165;}
 const pointGeo=geo(new T.BufferGeometry());pointGeo.setAttribute('position',new T.BufferAttribute(positions,3));
 const pointMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0},alpha:{value:1}},vertexShader:'uniform float time;varying float intensity;void main(){vec3 p=position;p.x+=sin(time*.4+position.z)*.65;p.y+=sin(time*.6+position.x)*.5;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(75./(-mv.z),1.,6.);intensity=.35+.65*pow(sin(time*.6+position.x),2.);}',fragmentShader:'uniform float alpha;varying float intensity;void main(){float d=length(gl_PointCoord-.5)*2.;float glow=pow(max(0.,1.-d),2.);gl_FragColor=vec4(.66,1.,.64,glow*intensity*alpha);}'});materials.add(pointMat);scene.add(new T.Points(pointGeo,pointMat));
 const path=new T.CatmullRomCurve3([new T.Vector3(0,7,37),new T.Vector3(1,8,-6),new T.Vector3(-1,13,-52),new T.Vector3(0,29,-102),new T.Vector3(6,47,-120),new T.Vector3(12,53,-139)]);
 let progress=0,target=0,clock=0,last=0,raf=0,disposed=false,contextLost=false,lastShadowTime=-1,lastShadowProgress=-1;
 const pointer=new T.Vector2(),pointerSmooth=new T.Vector2(),motion=matchMedia('(prefers-reduced-motion: reduce)'),forestFog=new T.Color('#153a38'),skyFog=new T.Color('#8b847b'),look=new T.Vector3();
 const measure=()=>{renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/Math.max(1,host.clientHeight);camera.updateProjectionMatrix();composer?.setSize(host.clientWidth,host.clientHeight);};
 const onScroll=()=>{target=motion.matches?0:T.MathUtils.clamp(scrollY/(Math.max(600,innerHeight)*1.65),0,1);wake();};
 const onPointer=(e:PointerEvent)=>{if(e.pointerType==='mouse'&&!motion.matches)pointer.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5);};
 function frame(now:number){
  raf=0;if(disposed||contextLost||document.hidden)return;const delta=Math.min(.05,last?(now-last)/1000:1/60);last=now;if(!motion.matches)clock+=delta;
  progress=motion.matches?0:T.MathUtils.lerp(progress,target,1-Math.exp(-delta*5));if(Math.abs(progress-target)<.0001)progress=target;pointerSmooth.lerp(pointer,.035);
  const opening=smooth(.08,.54,progress),arrival=smooth(.43,.9,progress);
  camera.position.copy(path.getPointAt(progress));camera.position.x+=motion.matches?0:pointerSmooth.x*1.2;camera.position.y+=motion.matches?0:-pointerSmooth.y*.65+Math.sin(clock*.35)*.12;
  look.copy(path.getPointAt(Math.min(.99,progress+.12)));look.lerp(new T.Vector3(0,49,-190),smooth(.65,1,progress));camera.lookAt(look);
  for(const tree of trees){tree.group.position.x=tree.x+tree.side*opening*(18+Math.max(0,45-tree.z)*.13);tree.group.rotation.z=-tree.side*opening*.16;tree.leaves.rotation.y=motion.matches?0:Math.sin(clock*.22+tree.phase)*.016;}
  gateHalves[0].position.x=-opening*8;gateHalves[1].position.x=opening*8;gateHalves[0].rotation.y=opening*.8;gateHalves[1].rotation.y=-opening*.8;
  forest.visible=progress<.77;heaven.visible=progress>.22;
  for(let i=0;i<rings.length;i++){rings[i].rotation.y=i*.22+clock*(i%2?.045:-.035);rings[i].rotation.z=clock*(i%2?-.025:.02);}orbitNodes.rotation.z=clock*.055;
  for(let i=0;i<islands.length;i++)islands[i].position.y=30+(i%3)*8+Math.sin(clock*.28+i)*.7;
  for(let i=0;i<steps.length;i++){steps[i].position.y=24+i*.72+Math.sin(clock*.5+i*.5)*.25;steps[i].rotation.y=clock*.025;}
  for(const cloud of clouds)cloud.quaternion.copy(camera.quaternion);
  cloudMat.uniforms.time.value=clock;cloudMat.uniforms.warmth.value=arrival;streamMat.uniforms.time.value=clock;pointMat.uniforms.time.value=clock;pointMat.uniforms.alpha.value=1-arrival;sky.position.copy(camera.position);skyMat.uniforms.journey.value=arrival;
  (scene.fog as T.FogExp2).color.copy(forestFog).lerp(skyFog,arrival);(scene.fog as T.FogExp2).density=T.MathUtils.lerp(.012,.004,arrival);hemi.intensity=1.3+arrival*.65;sun.intensity=3.8+arrival*.5;rim.intensity=.8*(1-arrival);sun.target.position.set(camera.position.x,arrival*37,camera.position.z-32);sun.position.copy(sun.target.position).add(new T.Vector3(-34,65,18));
  shaftMat.uniforms.time.value=clock;if(Math.abs(progress-lastShadowProgress)>.002||clock-lastShadowTime>.2||motion.matches){renderer.shadowMap.needsUpdate=true;lastShadowProgress=progress;lastShadowTime=clock;}renderer.info.autoReset=false;renderer.info.reset();if(composer)composer.render();else renderer.render(scene,camera);host.dataset.progress=progress.toFixed(3);host.dataset.stage=progress<.35?'forest':progress<.7?'passage':'palace';host.dataset.drawCalls=String(renderer.info.render.calls);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.mode=motion.matches?'still':'animated';
  if(!motion.matches)raf=requestAnimationFrame(frame);
 }
 function wake(){if(!raf&&!disposed&&!document.hidden&&!contextLost)raf=requestAnimationFrame(frame);}
 const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();};const resize=()=>{measure();onScroll();};
 const lost=(e:Event)=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;host.dataset.renderer='fallback';};const restored=()=>{lastShadowTime=-1;contextLost=false;host.dataset.renderer='webgl';wake();};
 renderer.domElement.addEventListener('webglcontextlost',lost);renderer.domElement.addEventListener('webglcontextrestored',restored);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',resize);window.addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',onScroll);measure();onScroll();host.dataset.renderer='webgl';
 return ()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',onPointer);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',onScroll);renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);scene.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());surfaces.dispose();sun.shadow.dispose();environment.dispose();bloom?.dispose();outputPass?.dispose();composer?.dispose();renderer.dispose();renderer.domElement.remove();};
}
