import {useEffect, useRef} from 'react';
import './world-background.css';

export function WorldBackground(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let cancelled=false;let dispose:(()=>void)|undefined;
  import('./world/createJourney').then(({createJourney})=>{
   if(cancelled||!root.current)return;
   try{dispose=createJourney(root.current);}catch(error){console.error('Background renderer failed',error);root.current.dataset.renderer='fallback';root.current.querySelector('canvas')?.remove();}
  }).catch(()=>{if(root.current)root.current.dataset.renderer='fallback';});
  return ()=>{cancelled=true;dispose?.();};
 },[]);
 return <div ref={root} className="world-background" aria-hidden="true"><div className="world-shade"/></div>;
}
