import type {Localized} from './wiki/types';
export const feedbackOrigin = typeof window!=='undefined' && ['www.pikachuw.site','localhost','127.0.0.1'].includes(window.location.hostname) ? '' : 'https://www.pikachuw.site';
export const feedbackStatuses:Record<string,Localized>={
 pending:['待审核','Awaiting review','審査待ち','검토 대기'],confirmed:['已确认','Confirmed','確認済み','확인됨'],fixing:['处理中','In progress','対応中','처리 중'],fixed:['已处理','Resolved','対応済み','처리 완료'],released:['已发布','Released','公開済み','배포됨'],rejected:['未通过','Not accepted','不採用','미승인'],duplicate:['重复问题','Duplicate','重複','중복']};
export const feedbackSeverities:Record<string,Localized>={low:['低危','Low','低','낮음'],medium:['中危','Medium','中','중간'],high:['高危','High','高','높음'],critical:['严重','Critical','重大','심각']};
export const honorNames:Record<string,Localized>={'初级黑客':['初级黑客','Junior Hacker','初級ハッカー','초급 해커'],'中级黑客':['中级黑客','Skilled Hacker','中級ハッカー','중급 해커'],'高级黑客':['高级黑客','Advanced Hacker','上級ハッカー','고급 해커'],'传奇黑客':['传奇黑客','Legendary Hacker','伝説のハッカー','전설의 해커']};
export async function feedbackRequest(path:string, options:RequestInit={}){
 const response=await fetch(`${feedbackOrigin}/api/feedback/${path}`,{...options,credentials:'omit'});
 if(!response.ok)throw new Error(String(response.status));
 return response.json();
}
