import {useEffect,useState} from 'react';
import {useI18n} from './i18n';
import {localize,type Localized} from './wiki/types';
import './shop.css';
const themes:Localized[]=[['精灵','Elven','精霊','정령'],['天宫','Celestial','天宮','천궁']];
const kinds:Localized[]=[['场景与棋盘','Scene & board','シーンと盤','장면과 보드'],['魔杖','Wand','杖','마법봉'],['完整套餐','Full collection','フルセット','전체 세트']];
export const shopProducts=['scene_elven','scene_celestial','wand_elven','wand_celestial','bundle_elven','bundle_celestial','dragon_blessing'];
const selectedId=()=>location.hash.startsWith('#shop/')?location.hash.slice(6):'';
export function ShopPage(){
 const {language}=useI18n();const L=(v:Localized)=>localize(v,language);const [selected,setSelected]=useState(selectedId);
 useEffect(()=>{const sync=()=>setSelected(selectedId());addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const title=(i:number)=>i===6?L(['神龙祈福','Dragon Blessing','神龍祈願','신룡 기원']):`${L(themes[i%2])} · ${L(kinds[Math.floor(i/2)])}`;
 const contents=(i:number)=>i<2?L(['包含同系列场景和棋盘，可独立搭配。','Includes the matching scene and board, which can be equipped independently.','同シリーズのシーンと盤を含み、別々に組み合わせ可能です。','동일 시리즈 장면과 보드가 포함되며 각각 조합할 수 있습니다.']):i<4?L(['仅包含同系列魔杖。','Includes the matching wand only.','同シリーズの杖のみ含みます。','동일 시리즈 마법봉만 포함됩니다.']):i<6?L(['包含同系列场景、棋盘和魔杖。','Includes the matching scene, board and wand.','同シリーズのシーン・盤・杖を含みます。','동일 시리즈 장면, 보드, 마법봉이 포함됩니다.']):L(['自选金额，可重复参与。所有商品购买和单独祈福均按实付金额累计，每笔订单只计算一次。','Choose an amount and contribute repeatedly. All purchases and direct blessings count by the amount paid, once per order.','金額を選んで何度でも参加できます。全商品購入と祈願を実際の支払額で合算し、各注文は一度だけ計上します。','금액을 선택해 여러 번 참여할 수 있습니다. 모든 구매와 기원은 실제 결제액으로 주문당 한 번만 합산합니다.']);
 const price=(i:number)=>i===6?L(['自选金额','Choose an amount','金額を選択','금액 선택']):`$${i<2?9:i<4?4:11} USD / ¥${i<2?60:i<4?27:73} CNY`;
 const index=shopProducts.indexOf(selected);
 return <section className="support-products shop-page">
 {index>=0?<article className="shop-detail"><a href="#support">← {L(['全部商品','All products','すべての商品','모든 상품'])}</a><p className="eyebrow">MONSTER AUTO BATTLE / {index===6?'DRAGON BLESSING':'COLLECTION'}</p><h1>{title(index)}</h1><p>{contents(index)}</p><strong className="shop-price">{price(index)}</strong>{index===6&&<p>{L(['测试结束时按累计排名结算，前 50 名永久享受后续 VIP 更新内容。','At the end of testing, the top 50 by accumulated contributions receive permanent access to future VIP content updates.','テスト終了時の累計上位50名は、今後のVIP更新を永久に利用できます。','테스트 종료 시 누적 순위 상위 50명은 향후 VIP 업데이트를 영구 이용합니다.'])}</p>}
 <p>{L(['前往平台后，请选择上方同名商品。平台商品直达入口将在上架后接入。','On the platform, select the product named above. Direct product links will be added after listing.','プラットフォームで上記と同名の商品を選択してください。出品後に商品への直接リンクを追加します。','플랫폼에서 위와 같은 이름의 상품을 선택하세요. 상품 등록 후 직접 링크를 연결합니다.'])}</p>
 <div className="payment-links"><a className="hero-cta" href="https://afdian.com/a/pikachu123" target="_blank" rel="noopener noreferrer">{L(['前往爱发电 · 人民币','Visit Afdian · CNY','愛発電へ · CNY','Afdian 방문 · CNY'])} ↗</a><a className="hero-cta" href="https://ko-fi.com/pikachu42802" target="_blank" rel="noopener noreferrer">Ko-fi · USD ↗</a></div>
 <p>{L(['所有购买均计入神龙祈福。已购同系列内容需要补差价时，请先确认权益和补购金额，不要重复购买整套。','All purchases count toward Dragon Blessing. For upgrades, confirm existing ownership and the additional amount before buying a full set again.','全購入額を神龍祈願に加算します。差額購入は所有権と追加金額を確認し、セットを重複購入しないでください。','모든 구매는 신룡 기원에 합산됩니다. 차액 구매 시 기존 보유 내역과 추가 금액을 확인하고 세트를 중복 구매하지 마세요.'])}</p></article>:<><p className="eyebrow">SCENES · WANDS · COLLECTIONS</p><h2>{L(['选择你的珍藏','Choose your collection','コレクションを選ぶ','컬렉션 선택'])}</h2>{selected&&<p role="status">{L(['未找到该商品，请从下方选择。','Product not found. Choose below.','商品が見つかりません。下から選択してください。','상품을 찾을 수 없습니다. 아래에서 선택하세요.'])}</p>}</>}
 <div className="support-grid">{shopProducts.map((id,i)=><article key={id}><span>{String(i+1).padStart(2,'0')}</span><h2>{title(i)}</h2><p>{contents(i)}</p><strong className="shop-price">{price(i)}</strong><a className="shop-link" href={'#shop/'+id}>{L(['查看详情与购买入口','Details & purchase options','詳細・購入先','상세 정보 및 구매'])} →</a></article>)}</div>
 </section>;
}
