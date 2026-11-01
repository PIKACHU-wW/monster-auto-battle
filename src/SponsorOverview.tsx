import {useI18n} from './i18n';

const commonBenefits = ['永久留名', '官网创始者展示'];
const tiers = [
 {color:'red',name:'红色',benefits:['永久享受当前及未来所有 VIP 内容','两支付费魔杖','红色专属头衔',...commonBenefits]},
 {color:'purple',name:'紫色',benefits:['两支付费魔杖','紫色专属头衔',...commonBenefits]},
 {color:'blue',name:'蓝色',benefits:['自选一支付费魔杖','蓝色专属头衔',...commonBenefits]},
 {color:'green',name:'绿色',benefits:['绿色专属头衔',...commonBenefits]},
];

export function SponsorOverview(){
 const {t}=useI18n();
 return <>
  <section className="support-plan-heading">
   <h1>{t('早期赞助计划')}</h1>
  </section>
  <section className="support-intro">
   <h2 className="privilege-heading"><span>{t('特权一')}</span>{t('场景解锁')}</h2>
   <p className="scene-unlock-text">{t('赞助金额累计价值满')}<em>{t('5 美元')}</em>{t('，自选一个场景')}</p>
   <p className="scene-unlock-text">{t('赞助金额累计价值满')}<em>{t('10 美元')}</em>{t('，解锁精灵与天宫场景')}</p>
   <div className="support-realms">
    <figure className="scene-card"><img src="/images/elven-scene.png" alt={t('精灵场景')} width="1200" height="800" decoding="async"/><figcaption>{t('精灵场景')}</figcaption></figure>
    <figure className="scene-card"><img src="/images/celestial-scene.png" alt={t('天宫场景')} width="1200" height="800" decoding="async"/><figcaption>{t('天宫场景')}</figcaption></figure>
   </div>
  </section>
  <section id="rewards" className="support-rewards">
   <h2 className="privilege-heading"><span>{t('特权二')}</span>{t('四种 VIP 档位')}</h2>
   <div className="vip-ranking-rules">
    <h3>{t('如何获得 VIP 档位')}</h3>
    <p>{t('以测试版本结束为截止时间，按截止前累计有效赞助金额从高到低排名，确定最终 VIP 档位。测试期间的排名为暂定排名。')}</p>
    <ul>
     <li>{t('第 1–25 名：红色 VIP')}</li>
     <li>{t('第 26–100 名：紫色 VIP')}</li>
     <li>{t('第 101–200 名：蓝色 VIP')}</li>
     <li>{t('第 201 名及以后：绿色 VIP，人数不限')}</li>
    </ul>
    <p>{t('所有早期赞助者均享有永久留名与官网创始者展示。各档位权益如下：')}</p>
   </div>
   <div className="vip-list">
    {tiers.map(tier=><article className={`vip-card ${tier.color}`} key={tier.color}>
     <div className="vip-name"><span className="vip-emblem" aria-hidden="true">◇</span><h3>{t(tier.name)} VIP</h3></div>
     <ul>{tier.benefits.map(benefit=><li key={benefit}><span aria-hidden="true">✓</span>{t(benefit)}</li>)}</ul>
    </article>)}
   </div>
  </section>
 </>;
}
