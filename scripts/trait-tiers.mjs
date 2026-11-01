import assert from 'node:assert/strict';
// Parameters come from traits.json; %name means a ratio converted to percent.
const templates={
 insect_swarm:[null,
  'Start after {first}s; hatch a swarm every {interval}s, lasting {life}s. The next valid basic attack attaches it to the target, dealing {%ratio}% of ATK at hatching as magic damage every {bite}s. On host death, migrate within {radius} hexes without resetting lifetime. Team cap {cap}, per-host cap {host_cap}. Attached swarms survive the owner; idle swarms do not.',
  '{first}秒後から{interval}秒ごとに虫群を孵化し、{life}秒持続。次の有効な通常攻撃で寄生し、{bite}秒ごとに孵化時攻撃力の{%ratio}%の魔法ダメージ。宿主死亡時は{radius}マス以内へ移り、寿命は更新しない。チーム上限{cap}、宿主ごと{host_cap}。寄生済みは本体死亡後も残るが、待機中は消える。',
  '{first}초 후부터 {interval}초마다 벌레떼를 부화시키며 {life}초 지속됩니다. 다음 유효 기본 공격으로 기생하여 {bite}초마다 부화 당시 공격력의 {%ratio}% 마법 피해를 줍니다. 숙주 사망 시 {radius}칸 내로 이동하며 수명은 갱신되지 않습니다. 팀 최대 {cap}, 숙주당 {host_cap}. 기생한 무리는 본체 사망 후에도 남지만 대기 무리는 사라집니다.'],
 aerial_route:[null,
  'Walking or trait sidesteps over {steps} hexes empower the next valid basic hit within {window}s for {%ratio}% ATK physical damage. Attempt a legal sidestep at equal distance from the target every {interval}s, with {recovery}s recovery. Does not interrupt casting or attack windup. Root, stun, taunt or blocked cells prevent it. Skill movement and forced displacement do not charge it; death clears the charge.',
  '通常移動・特性の横移動を計{steps}マス行うと、{window}秒以内の次の有効な通常攻撃に攻撃力{%ratio}%の物理追加ダメージ。{interval}秒ごとに対象との距離を維持する有効な隣接空きマスへ横移動し、硬直{recovery}秒。詠唱・攻撃準備は中断せず、移動不能・スタン・挑発・閉塞で移動不可。スキル移動と強制移動は蓄積せず、死亡で消える。',
  '걷기나 특성 옆걸음으로 {steps}칸 이동하면 {window}초 내 다음 유효 기본 공격에 공격력 {%ratio}%의 물리 추가 피해를 줍니다. {interval}초마다 대상과 같은 거리를 유지하는 유효 빈칸으로 이동하며 회복 시간은 {recovery}초입니다. 시전과 공격 준비를 중단하지 않으며 속박, 기절, 도발, 막힌 칸은 이동을 막습니다. 스킬 이동과 강제 이동은 충전되지 않고 사망 시 충전이 사라집니다.'],
 pack_encircle:[null,
  'Within {window}s, two distinct Beasts hit the same enemy from different directions. Expose it for {expose}s with {charges} rends, each adding {%ratio}% ATK physical damage. Cooldown {cooldown}s begins at the originally scheduled end of exposure; early consumption does not shorten it.',
  '{window}秒以内に異なる獣族2体が別方向から同じ敵へ有効な通常攻撃を命中させると、弱点を{expose}秒露出。{charges}回まで攻撃力{%ratio}%の物理裂傷を追加。予定されていた露出終了時点からクールダウン{cooldown}秒。早く使い切っても短縮しない。',
  '{window}초 내 서로 다른 야수 2명이 다른 방향에서 같은 적에게 유효 기본 공격을 적중하면 {expose}초 동안 약점을 노출합니다. 최대 {charges}회 공격력 {%ratio}%의 물리 추가 피해. 원래 노출 종료 시점부터 재사용 {cooldown}초이며 일찍 소모해도 단축되지 않습니다.'],
 behemoth_impact:[
  '承受敌方直接伤害累计达到自身最大生命{%threshold}%后，蓄势{windup}秒，向前方{radius}格范围释放自身最大生命{%ratio}%的物理震波；冷却{cooldown}秒。蓄势中受打断控制或位置改变会取消。',
  'After accumulating enemy direct damage equal to {%threshold}% of own max HP, wind up for {windup}s and release a forward shockwave within {radius} hexes for {%ratio}% own max HP physical damage. Cooldown {cooldown}s. Interrupting control or position changes cancel the windup.',
  '敵の直接ダメージを自身最大HPの{%threshold}%蓄積すると、{windup}秒溜めて前方{radius}マスへ自身最大HPの{%ratio}%の物理衝撃波。クールダウン{cooldown}秒。妨害や位置変化で溜めを中断。',
  '적 직접 피해를 자신의 최대 체력 {%threshold}%만큼 누적하면 {windup}초 준비 후 전방 {radius}칸에 자신의 최대 체력 {%ratio}% 물리 충격파를 방출합니다. 재사용 {cooldown}초. 방해 제어나 위치 변경은 준비를 취소합니다.'],
 carapace_cycle:[
  '受有效攻击叠加甲壳，每层护甲+{armor}，最多{stacks}层。满层后进入{hard}秒硬壳，层数提供的护甲翻倍；随后清除壳层，恢复自身最大生命{%heal}%，移速+{speed}，持续{soft}秒，再重新长壳。',
  'Valid incoming attacks build up to {stacks} shell stacks, each granting {armor} armor. At full stacks, double their armor for {hard}s; then shed all stacks, heal {%heal}% max HP and gain {speed} movement speed for {soft}s before regrowing.',
  '有効な被攻撃で甲殻を最大{stacks}層蓄積し、各層防御力+{armor}。満層で{hard}秒間その防御力が倍増。その後全層を脱ぎ、最大HPの{%heal}%回復と移動速度+{speed}を{soft}秒得て再成長する。',
  '유효 공격을 받으면 갑각을 최대 {stacks}중첩 쌓으며 중첩당 방어력 +{armor}. 최대 중첩에서 {hard}초 동안 해당 방어력이 두 배가 됩니다. 이후 중첩을 제거하고 최대 체력 {%heal}%를 회복하며 {soft}초 동안 이동 속도 +{speed} 후 다시 성장합니다.'],
 flora_garden:[
  '每{interval}秒播种，{mature}秒成熟，从播种起存在{life}秒；每名植物最多{cap}片，每队最多8片。成熟花园每秒治疗1格内友军：相连时为播种者最大生命{%heal}%，未相连时减半，并对范围内敌人施加0.65秒减速。播种者阵亡后花园消失。',
  'Sow every {interval}s; mature after {mature}s and expire {life}s after sowing. Cap {cap} gardens per Flora unit, 8 per team. Each second, mature gardens heal allies within 1 hex for {%heal}% of the sower’s max HP when linked, half when isolated, and slow nearby enemies for 0.65s. Gardens disappear when the sower dies.',
  '{interval}秒ごとに播種し、{mature}秒後に成熟、播種から{life}秒で消滅。植物1体につき{cap}個、チーム8個まで。成熟花園は毎秒1マス以内の味方を回復し、接続時は播種者最大HPの{%heal}%、孤立時は半分。敵には0.65秒の減速。播種者死亡で消滅。',
  '{interval}초마다 씨를 심고 {mature}초 후 성숙하며 파종부터 {life}초 후 사라집니다. 식물당 {cap}개, 팀당 8개. 성숙 정원은 매초 1칸 내 아군을 치유하며 연결 시 파종자 최대 체력 {%heal}%, 고립 시 절반입니다. 주변 적에게 0.65초 둔화를 부여하며 파종자 사망 시 사라집니다.'],
 spectral_debt:[
  '每{interval}秒尝试绑定{radius}格内最近敌人的魂影，持续{life}秒。后续有效普攻命中宿主时，额外造成自身攻击{%ratio}%的法伤，单次上限为目标最大生命{%cap}%。宿主死亡留下魂能，由存活幽冥继承；每层使该魂影附伤提高10%，每只最多3层，队伍待分配魂能最多6份。',
  'Every {interval}s, bind the nearest enemy within {radius} hexes for {life}s. Valid basic hits on the host add {%ratio}% ATK magic damage, capped at {%cap}% target max HP per hit. Host death leaves soul energy inherited by living Spectral units: +10% to this bonus per stack, up to 3 per unit; team bank cap 6.',
  '{interval}秒ごとに{radius}マス以内の最も近い敵を{life}秒束縛。宿主への有効な通常攻撃で攻撃力{%ratio}%の魔法追加ダメージ、1回の上限は対象最大HPの{%cap}%。宿主死亡時の魂能を生存幽冥が継承し、1層ごとにこの追加ダメージ+10%、各3層まで。チームの未配分魂能上限6。',
  '{interval}초마다 {radius}칸 내 가장 가까운 적의 영혼을 {life}초 결속합니다. 숙주에게 유효 기본 공격 적중 시 공격력 {%ratio}% 마법 추가 피해, 적중당 대상 최대 체력 {%cap}% 상한. 숙주 사망 시 생존 망령이 영혼 에너지를 계승하며 중첩당 해당 추가 피해 +10%, 개체당 최대 3중첩, 팀 미분배 최대 6개입니다.'],
 dragon_cycle:[
  '蓄积{charge}秒后觉醒，成功施法使蓄积提前{cast}秒。觉醒最多持续{awake}秒，获得{breaths}次吐息：有效普攻附加攻击{%ratio}%法伤，最多命中目标及其相邻敌人共{victims}名。次数耗尽或到时后衰退{rest}秒，再开始蓄积。',
  'Awaken after {charge}s of charging; each successful cast advances charging by {cast}s. Awakening lasts up to {awake}s with {breaths} breaths: valid basic hits add {%ratio}% ATK magic damage to up to {victims} enemies including the target and adjacent enemies. After charges run out or time expires, rest {rest}s and recharge.',
  '{charge}秒蓄積で覚醒し、成功した詠唱で{cast}秒短縮。覚醒は最大{awake}秒、吐息{breaths}回。有効な通常攻撃に攻撃力{%ratio}%の魔法ダメージを追加し、対象と隣接敵の計{victims}体まで命中。使い切るか時間切れで{rest}秒休止して再蓄積。',
  '{charge}초 충전 후 각성하며 성공한 시전마다 충전이 {cast}초 앞당겨집니다. 최대 {awake}초 동안 숨결 {breaths}회: 유효 기본 공격에 공격력 {%ratio}% 마법 피해를 추가하며 대상과 인접 적 합계 최대 {victims}명에게 적중합니다. 소진 또는 만료 후 {rest}초 휴식하고 재충전합니다.'],
 guard_contract:[null,
  'At combat start, each ally gains a shield equal to {%opening_shield}% of its own max HP, once per battle. Each Guardian binds the nearest unbound non-Guardian ally and shares {%share}% damage within {radius} hexes. After taking transferred damage equal to {%charge_hp}% own max HP, counter nearby enemies for {%counter_hp}% own max HP magic damage; cooldown {cooldown}s.',
  '開戦時、各味方に自身最大HPの{%opening_shield}%のシールドを1戦1回付与。各守衛は最も近い未契約の非守衛味方と結び、{radius}マス以内で{%share}%のダメージを分担。転送ダメージが自身最大HPの{%charge_hp}%に達すると、近くの敵へ自身最大HPの{%counter_hp}%の魔法反撃。クールダウン{cooldown}秒。',
  '전투 시작 시 각 아군은 자신의 최대 체력 {%opening_shield}% 보호막을 전투당 한 번 얻습니다. 수호자는 가장 가까운 미결속 비수호 아군과 연결해 {radius}칸 내 피해 {%share}%를 분담합니다. 이전 피해가 자신의 최대 체력 {%charge_hp}%에 도달하면 주변 적에게 자신의 최대 체력 {%counter_hp}% 마법 반격, 재사용 {cooldown}초입니다.'],
 hunter_pursuit:[null,
  'Lock onto the reachable enemy with the lowest HP percentage within {radius} hexes for {lock}s; taunt takes priority. When prey damaged within the last {assist}s dies, gain one legal chase of up to {chase_steps} hexes within {chase_window}s, then one basic hit on the next prey within {timeout}s adds {%bonus}% ATK physical damage.',
  '{radius}マス以内で到達可能なHP割合が最も低い敵を{lock}秒ロック。挑発優先。過去{assist}秒以内に攻撃した獲物が死亡すると、{chase_window}秒以内に最大{chase_steps}マスの有効な追撃移動を1回得る。続く{timeout}秒以内の次の獲物への通常攻撃1回に攻撃力{%bonus}%の物理ダメージを追加。',
  '{radius}칸 내 도달 가능한 적 중 체력 비율이 가장 낮은 적을 {lock}초 고정하며 도발이 우선합니다. 최근 {assist}초 내 피해를 준 사냥감이 사망하면 {chase_window}초 내 최대 {chase_steps}칸 추격 1회, 이후 {timeout}초 내 다음 사냥감에 대한 기본 공격 1회에 공격력 {%bonus}% 물리 추가 피해를 얻습니다.'],
 warlock_relay:[null,
  'Within {window}s, {distinct} different Warlocks must finish casting. The next Warlock cast consumes the charged sequence: after {delay}s, release an independent {%ratio}% ATK magic echo within {radius} hexes, hitting up to {victims} enemies including the target and adjacent enemies. One Warlock cannot fill multiple slots; interrupted or copied casts do not count. Timeout clears the sequence; caster death before release cancels it.',
  '{window}秒以内に異なる術士{distinct}体が詠唱完了すると充填。次の術士の詠唱完了で消費し、{delay}秒後に{radius}マス以内へ攻撃力{%ratio}%の独立魔法反響。対象と隣接敵の計{victims}体まで。同じ術士は重複充填不可。中断・複製は数えず、時間切れで解除、発射前の術者死亡で中止。',
  '{window}초 내 서로 다른 술사 {distinct}명이 시전을 완료하면 충전됩니다. 다음 술사 시전 완료 시 소모하여 {delay}초 후 {radius}칸 내에 공격력 {%ratio}% 독립 마법 메아리를 발사하며 대상과 인접 적 합계 최대 {victims}명에게 적중합니다. 같은 술사는 중복 충전할 수 없고 중단/복제 시전은 제외됩니다. 시간 초과 시 초기화, 발사 전 시전자 사망 시 취소됩니다.'],
 support_relay:[null,
  '{%ratio}% of effective Support healing or damage actually absorbed by Support shields becomes rescue reserves on the beneficiary, capped at {%cap}% beneficiary max HP for {window}s. Its next basic attack dealing effective damage transfers reserves to the other injured non-summoned ally with the lowest HP percentage within {radius} hexes. With no target, keep reserves until expiry. Overhealing, merely granting or stripping shields does not charge reserves; relay healing cannot recharge itself.',
  '支援の実回復量または支援シールドの実吸収量の{%ratio}%を受益者の救援貯蓄へ。上限は受益者最大HPの{%cap}%、{window}秒持続。次の有効ダメージを与える通常攻撃で、{radius}マス以内の別の負傷した非召喚味方のうちHP割合が最も低い者へ渡す。対象不在なら期限まで保持。過剰回復・単なるシールド付与や剥離は蓄積せず、接力は自己再充填しない。',
  '지원의 유효 치유 또는 지원 보호막 실제 흡수량의 {%ratio}%를 수혜자의 구조 저장량으로 전환합니다. 수혜자 최대 체력 {%cap}% 상한, {window}초 지속. 다음 유효 피해 기본 공격으로 {radius}칸 내 다른 부상 비소환 아군 중 체력 비율이 가장 낮은 대상에게 전달합니다. 대상이 없으면 만료까지 보존합니다. 초과 치유, 보호막 부여/제거만으로 충전되지 않고 전달 치유는 재충전하지 않습니다.'],
 rabbit_combo:[null,
  'M031, M032 and M033 must each hit the same enemy within {window}s. If all three contributors survive, strike after {delay}s for {%ratio}% of their combined ATK as physical damage and attempt a {stun}s stun. Team cooldown {cooldown}s. Duplicate species cannot replace a member; secondary damage does not count. Target or contributor death cancels the windup without refunding cooldown.',
  'M031・M032・M033が{window}秒以内に同じ敵へ各1回有効命中。全員生存なら{delay}秒後、3体の合計攻撃力{%ratio}%の物理合撃と{stun}秒スタン。チーム共通クールダウン{cooldown}秒。同種で代用不可、二次ダメージは数えない。対象または参加者死亡で中止し、クールダウンは返らない。',
  'M031, M032, M033이 {window}초 내 같은 적에게 각각 유효 적중해야 합니다. 세 기여자가 생존하면 {delay}초 후 합산 공격력 {%ratio}% 물리 합격과 {stun}초 기절을 시도합니다. 팀 재사용 {cooldown}초. 같은 종으로 대체할 수 없고 2차 피해는 제외됩니다. 대상이나 기여자 사망 시 취소되며 재사용 시간은 돌려주지 않습니다.'],
 dragonline_relay:[
  '首名指定成员首次觉醒时，向其他指定成员传递一次龙息，使其蓄积提前{relay}秒；若不在蓄积阶段，则留给下一轮蓄积，每名成员只领取一次。',
  'The first designated member to awaken sends a one-time relay to the other designated members, advancing their charge by {relay}s. If not charging, save it for the next charge cycle; each member receives it once.',
  '指定メンバーの最初の覚醒で、他の指定メンバーへ1回だけ龍息を伝え、蓄積を{relay}秒短縮。蓄積中でなければ次周期へ保存し、各メンバー1回のみ受領。',
  '지정 구성원 중 첫 각성자가 다른 지정 구성원에게 한 번 숨결을 전달해 충전을 {relay}초 앞당깁니다. 충전 중이 아니면 다음 주기에 저장하며 구성원마다 한 번만 받습니다.'],
 chelafang_seed:[
  '赤纹魔蛛有效命中敌人时植入蛛种，持续{life}秒；红螯惧兽在此期间成功控制同一目标后，引爆蛛种，造成植入时魔蛛攻击{%ratio}%的法伤，并尝试定身{root}秒。同一目标冷却{cooldown}秒，每队最多{cap}枚蛛种；魔蛛或宿主阵亡、蛛种到期会清除。',
  'A valid hit by M004 plants a seed for {life}s. If M016 successfully controls that target in time, detonate for {%ratio}% of M004’s ATK at planting as magic damage and attempt a {root}s root. Per-target cooldown {cooldown}s, team cap {cap} seeds. Owner/host death or expiry removes the seed.',
  'M004の有効命中で{life}秒間の種を植える。時間内にM016が同じ敵への制御に成功すると、植え付け時のM004攻撃力{%ratio}%の魔法ダメージと{root}秒移動不能を試みる。対象ごとクールダウン{cooldown}秒、チーム上限{cap}個。本体・宿主死亡や期限切れで消える。',
  'M004의 유효 적중이 {life}초 씨앗을 심습니다. 그동안 M016이 같은 적 제어에 성공하면 설치 당시 M004 공격력 {%ratio}% 마법 피해와 {root}초 속박을 시도합니다. 대상당 재사용 {cooldown}초, 팀 최대 {cap}개. 본체/숙주 사망 또는 만료 시 사라집니다.']
};

export function traitTiers(trait){
 return trait.tiers.map(count=>{
  // Runtime replaces lower tiers of the same kind, but retains other unlocked kinds.
  const active=new Map();for(const e of trait.effects)if(e.tier<=count&&(!active.has(e.kind)||active.get(e.kind).tier<e.tier))active.set(e.kind,e);
  const texts=[[],[],[],[]];
  for(const e of active.values()){
   if(e.kind==='shield_transfer'){
    [`守卫阵亡时，将剩余护盾的${e.pct}%转移给一名友军。`,`On Guardian death, transfer ${e.pct}% of its remaining shield to an ally.`,`守衛死亡時、残りシールドの${e.pct}%を味方1体へ移す。`,`수호자 사망 시 남은 보호막의 ${e.pct}%를 아군 한 명에게 이전합니다.`].forEach((s,i)=>texts[i].push(s));continue;
   }
   assert.ok(templates[e.kind],`Missing trait template ${e.kind}`);const p=e.params;
   const render=s=>s.replace(/\{(%?)(\w+)\}/g,(_,pct,key)=>{assert.ok(Number.isFinite(p[key]),`Missing ${e.kind}.${key}`);return String(Math.round(p[key]*(pct?100:1)*100)/100);});
   const main=templates[e.kind].map((s,i)=>s?render(s):e.notes.replace('（援军入场时获得，每单位每场一次）','（每单位每场一次）'));
   const add=(condition,lines)=>{if(condition)lines.forEach((s,i)=>{if(s)main[i]+=' '+render(s);});};
   add(p.children>0,[null,'Once per swarm, migration creates up to {children} children at {%child_ratio}% damage on other nearby hosts; children inherit remaining lifetime and cannot reproduce.','移動時に1回だけ、近くの別宿主へ最大{children}群の子を分岐。ダメージ{%child_ratio}%、残り寿命を継承し再繁殖不可。','무리당 한 번 이동 시 주변 다른 숙주에게 최대 {children}개의 자손을 만듭니다. 피해 {%child_ratio}%, 남은 수명 계승, 재번식 불가.']);
   add(p.wind>0,[null,'Traversed cells leave wind for {wind_life}s: allies gain {wind} movement speed while inside and for {linger}s after leaving, without stacking. Team cap 8 zones.','通過マスに{wind_life}秒の追い風。味方の移動速度+{wind}、退出後{linger}秒残留、重複なし。チーム最大8区域。','지나간 칸에 {wind_life}초 순풍: 아군 이동 속도 +{wind}, 이탈 후 {linger}초 잔류, 중첩 불가. 팀 최대 8구역.']);
   add(p.splash>0,[null,'The last rend splashes up to two adjacent enemies for {%splash}% ATK physical damage.','最後の裂傷は隣接敵最大2体へ攻撃力{%splash}%の物理飛散ダメージ。','마지막 타격은 인접 적 최대 2명에게 공격력 {%splash}% 물리 확산 피해.']);
   add(p.push>0,['震波额外击退{push}格，受阻时追加震波伤害{%collision}%的碰撞物伤；同一目标的击退保护间隔为2秒。','Also push {push} hex; if blocked, add {%collision}% of shockwave damage as physical collision damage. Per-target push protection lasts 2s.','追加で{push}マス押し戻し、閉塞時は衝撃波の{%collision}%の物理衝突ダメージ。同じ対象の押し戻し保護は2秒。','추가로 {push}칸 밀치며 막히면 충격파 피해의 {%collision}% 물리 충돌 피해. 대상별 밀치기 보호는 2초.']);
   add(p.zone>0,['蜕壳处留下{zone_life}秒保护区，1格内友军护甲+{zone}，同类区域取较强值。','Shedding leaves a {zone_life}s zone granting {zone} armor to allies within 1 hex; overlapping zones use the strongest value.','脱皮地点に{zone_life}秒の保護区域を残し、1マス以内の味方の防御力+{zone}。重複時は最大値。','탈피 위치에 {zone_life}초 보호 구역, 1칸 내 아군 방어력 +{zone}. 중첩 시 강한 값만 적용.']);
   add(e.kind==='flora_garden'&&p.root>0,['成功施法可催熟自身2格内花园，并对花园1格内敌人尝试定身{root}秒；同一敌人的缠绕触发间隔为3秒。','Successful casts mature your gardens within 2 hexes and attempt to root enemies within 1 hex of them for {root}s; per-enemy root interval 3s.','詠唱成功で自身から2マス以内の花園を成熟させ、花園1マス以内の敵を{root}秒移動不能にする。同一敵への発動間隔3秒。','시전 성공 시 자신의 2칸 내 정원을 성숙시키고 정원 1칸 내 적에게 {root}초 속박을 시도합니다. 적별 발동 간격 3초.']);
   add(p.emergency_at>0,[null,'Once per Guardian, before its partner falls to {%emergency_at}% HP, block up to {%emergency_hp}% Guardian max HP from that hit.','各守衛1戦1回、契約対象がHP{%emergency_at}%へ下がる直前、その一撃を守衛最大HPの{%emergency_hp}%まで遮断。','수호자당 한 번, 결속 대상이 체력 {%emergency_at}%로 내려가기 전 해당 피해를 수호자 최대 체력 {%emergency_hp}%까지 차단.']);
   add(p.chain_bonus>0,[null,'Participate in consecutive prey kills within {timeout}s to build up to {cap} stacks; each later stack adds {%chain_bonus}% ATK pursuit damage. Timeout or death clears stacks.','{timeout}秒以内の連続獲物撃破参加で最大{cap}層。追加各層は追撃ダメージに攻撃力{%chain_bonus}%を加算。時間切れ・死亡で解除。','{timeout}초 내 연속 사냥감 처치 기여 시 최대 {cap}중첩, 후속 중첩마다 추격 피해에 공격력 {%chain_bonus}% 추가. 시간 초과나 사망 시 초기화.']);
   add(p.ward>0,[null,'The first wave shields the lowest-HP-percentage non-summoned ally within {shield_radius} hexes for {%ward}% caster max HP.','初波は{shield_radius}マス以内でHP割合が最も低い非召喚味方に、術者最大HPの{%ward}%のシールドを付与。','첫 파동은 {shield_radius}칸 내 체력 비율이 가장 낮은 비소환 아군에게 시전자 최대 체력 {%ward}% 보호막을 부여.']);
   add(p.pulses>1,[null,'After {gap}s, release another echo at {%decay}% damage.','{gap}秒後、{%decay}%ダメージの反響を追加。','{gap}초 후 {%decay}% 피해 메아리 추가.']);
   add(p.hops>1,[null,'After {delay}s, relay from the first recipient to another injured ally at {%decay}% base healing. The chain never revisits a unit.','{delay}秒後、最初の受益者から別の負傷味方へ基礎回復量{%decay}%の接力を追加。同じ者を再訪しない。','{delay}초 후 첫 수혜자에서 다른 부상 아군에게 기본 치유량 {%decay}%로 추가 전달. 같은 유닛을 재방문하지 않습니다.']);
   add(e.kind==='dragonline_relay'&&p.ratio>0,['三名指定成员均首次觉醒后，全队每场一次联合龙威：以最后触发者为中心，对3格内敌人造成其当前攻击力{%ratio}%的法伤并尝试眩晕{stun}秒；3格内友军各获得自身最大生命{%shield}%的护盾。','After all three designated members first awaken, trigger one joint attack per team per battle around the last awakener: enemies within 3 hexes take {%ratio}% of that caster’s current ATK as magic damage and a {stun}s stun attempt; allies within 3 hexes each gain a shield equal to {%shield}% of their own max HP.','指定3体全員の初回覚醒後、最後の覚醒者を中心にチーム1戦1回の共同攻撃。3マス以内の敵に術者の現在攻撃力{%ratio}%の魔法ダメージと{stun}秒スタン。3マス以内の味方には各自の最大HPの{%shield}%のシールド。','지정 세 구성원의 최초 각성 후 마지막 각성자를 중심으로 팀당 전투 한 번 합동 공격. 3칸 내 적에게 시전자 현재 공격력 {%ratio}% 마법 피해와 {stun}초 기절 시도. 3칸 내 각 아군은 자신의 최대 체력 {%shield}% 보호막을 얻습니다.']);
   main.forEach((s,i)=>texts[i].push(s));
  }
  return {count,description:texts.map(parts=>parts.join('\n'))};
 });
}
