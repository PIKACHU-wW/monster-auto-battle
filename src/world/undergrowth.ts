import * as T from 'three';

export const riverX=(z:number)=>Math.sin((z+50)*.035)*3;
export function groundY(x:number,z:number){const bank=T.MathUtils.smoothstep(Math.abs(x-riverX(z)),2.2,5.8);return -2.2+bank*(1.65+Math.sin(x*.21+z*.13)*.25+Math.sin(z*.3)*.15);}

export function addUndergrowth(parent:T.Group,random:()=>number,mobile:boolean,leaf:T.MeshStandardMaterial,rock:T.MeshStandardMaterial,register:<G extends T.BufferGeometry>(g:G)=>G){
 const dummy=new T.Object3D(),color=new T.Color();
 function patch(geometry:T.BufferGeometry,count:number,scale:number,spread:number){
  const plants=new T.InstancedMesh(register(geometry),leaf,count);
  for(let i=0;i<count;i++){
   const z=32-random()*175,x=riverX(z)+(i%2?1:-1)*(4.2+Math.pow(random(),2)*spread);
   dummy.position.set(x,groundY(x,z)-.04,z);dummy.rotation.set(0,random()*Math.PI*2,0);const size=scale*(.55+random()*.9);dummy.scale.set(size,size*(.75+random()*.5),size);dummy.updateMatrix();plants.setMatrixAt(i,dummy.matrix);color.setHSL(.20+random()*.09,.24+random()*.2,.45+random()*.25);plants.setColorAt(i,color);
  }
  plants.receiveShadow=true;plants.computeBoundingSphere();parent.add(plants);
 }
 function vegetation(fern:boolean){
  const vertices:number[]=[],uvs:number[]=[];
  function triangle(a:T.Vector3,b:T.Vector3,c:T.Vector3){vertices.push(...a.toArray(),...b.toArray(),...c.toArray());uvs.push(.5,0,0,.5,.5,1);}
  for(let f=0;f<(fern?7:9);f++){
   const a=f*2.399,dx=Math.cos(a),dz=Math.sin(a),length=.7+random()*.65;
   if(fern){
    for(let i=1;i<10;i++){
     const t=i/10,r=t*length,base=new T.Vector3(dx*r,Math.sin(t*2.1)*length*.7,dz*r);const width=Math.sin(t*Math.PI)*length*.28;
     for(const side of [-1,1]){const tip=base.clone().add(new T.Vector3(-dz*width*side+dx*.13,.04,dx*width*side+dz*.13));triangle(base,base.clone().add(new T.Vector3(dx*.11,-.035,dz*.11)),tip);triangle(base,tip,base.clone().add(new T.Vector3(-dx*.08,.035,-dz*.08)));}
    }
   }else{
    const start=new T.Vector3(dx*.12,0,dz*.12),mid=new T.Vector3(dx*.23,length*.55,dz*.23),tip=new T.Vector3(dx*.5,length,dz*.5),width=new T.Vector3(-dz*.045,0,dx*.045);
    triangle(start.clone().sub(width),start.clone().add(width),mid.clone().add(width));triangle(start.clone().sub(width),mid.clone().add(width),mid.clone().sub(width));triangle(mid.clone().sub(width),mid.clone().add(width),tip);
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.computeVertexNormals();return g;
 }
 patch(vegetation(false),mobile?1100:3200,.85,22);patch(vegetation(true),mobile?180:480,1.3,15);
 const pebbles=new T.InstancedMesh(register(new T.IcosahedronGeometry(1,1)),rock,mobile?180:500);
 for(let i=0;i<pebbles.count;i++){const z=32-random()*175,x=riverX(z)+(i%2?1:-1)*(3.3+random()*5);dummy.position.set(x,groundY(x,z),z);dummy.rotation.set(random()*3,random()*6,random()*3);const size=.1+random()*.3;dummy.scale.set(size,size*.6,size);dummy.updateMatrix();pebbles.setMatrixAt(i,dummy.matrix);}pebbles.receiveShadow=true;parent.add(pebbles);
}
