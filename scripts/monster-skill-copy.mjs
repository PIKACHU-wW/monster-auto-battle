// Full numeric skill copy: en, ja, ko. p = ATK-scaled flat value,
// h = HP-scaled flat value, u = utility growth, r = self-stat ratio growth,
// v = explicit 1/2/3-star values. Keep control, probabilities and enemy HP ratios fixed.
export const skillTemplates={
 M001:[
  'At combat start, hide for {v:4/4.3/4.6}s. Enemies cannot target you directly and your basic attacks always critically hit. Area damage still hits.',
  '戦闘開始時に{v:4/4.3/4.6}秒間潜伏し、敵の直接指定を受けず、通常攻撃が必ずクリティカルになる。範囲ダメージは受ける。',
  '전투 시작 시 {v:4/4.3/4.6}초 동안 은신합니다. 적이 직접 대상으로 지정할 수 없으며 기본 공격이 반드시 치명타가 됩니다. 범위 피해는 받습니다.'
 ],
 M002:[
  'At full energy, leap to a legal hex beside a targetable enemy in the rearmost row. Deal {p:100} physical damage to enemies within 1 hex of landing and stun for 0.6s, then prioritize the ambush target. Search forward if the back row has no landing. Without a valid target or landing, do not cast or spend energy.',
  'エネルギー満タン時、敵最後列の指定可能な敵の隣の有効マスへ跳躍。着地地点から1マス以内に物理{p:100}ダメージと0.6秒スタンを与え、その敵を優先攻撃する。最後列に着地できなければ前列を探し、有効な敵や着地点がなければ発動も消費もしない。',
  '에너지가 가득 차면 적 최후열의 지정 가능한 적 옆 유효 칸으로 도약합니다. 착지 지점 1칸 내 적에게 물리 피해 {p:100}과 0.6초 기절을 주고 습격 대상을 우선 공격합니다. 착지점이 없으면 앞 열을 탐색하며, 유효한 대상이나 착지점이 없으면 시전하거나 에너지를 소모하지 않습니다.'
 ],
 M003:[
  'On death, poison every enemy within 2 hexes of the death location for 3s, dealing {p:65} magic damage per second.',
  '死亡時、その位置から2マス以内の全敵を3秒間毒にし、毎秒{p:65}魔法ダメージを与える。',
  '사망 시 사망 위치 2칸 내 모든 적을 3초 동안 중독시켜 매초 마법 피해 {p:65}을 줍니다.'
 ],
 M004:[
  'Basic attack hits grant {u:5}% attack speed for 3s, stacking up to 5 times ({u:25}% total).',
  '通常攻撃命中ごとに攻撃速度が3秒間{u:5}%上昇。最大5スタック、合計{u:25}%。',
  '기본 공격 적중마다 공격 속도가 3초 동안 {u:5}% 증가합니다. 최대 5중첩, 총 {u:25}%입니다.'
 ],
 M005:[
  'Spit acid at the nearest enemy for {p:95} physical damage, then split it behind the target to both sides. Each branch deals 45% of the main hit and cannot hit the original target again.',
  '最も近い敵に酸を吐き、{p:95}物理ダメージを与える。その背後の左右へ分裂し、各分裂は本体の45%のダメージを与える。最初の対象には再命中しない。',
  '가장 가까운 적에게 산을 뱉어 물리 피해 {p:95}을 주고 대상 뒤 좌우로 분열시킵니다. 각 분열은 본체 피해의 45%를 주며 최초 대상에 재적중하지 않습니다.'
 ],
 M006:[
  'On taking a hit, 30% chance to reduce that hit by {v:50/52/55}%. Does not create a shield.',
  '被弾時、30%の確率でその一撃のダメージを{v:50/52/55}%軽減する。シールドは生成しない。',
  '피격 시 30% 확률로 해당 피해를 {v:50/52/55}% 감소시킵니다. 보호막은 생성하지 않습니다.'
 ],
 M007:[
  'Taunt every enemy within 3 hexes for 2s, forcing them to attack you. Gain a shield equal to 25% of your max HP at cast time, affected by shield bonuses.',
  '自身から3マス以内の全敵を2秒間挑発し、自身を攻撃させる。発動時の最大HPの25%のシールドを得る。シールド強化が適用される。',
  '자신의 3칸 내 모든 적을 2초 동안 도발해 자신을 공격하게 합니다. 시전 시 최대 체력의 25%만큼 보호막을 얻으며 보호막 증가 효과가 적용됩니다.'
 ],
 M008:[
  'Basic attack hits have a 30% chance to stun for {v:1.5/1.6/1.7}s.',
  '通常攻撃命中時、30%の確率で対象を{v:1.5/1.6/1.7}秒間スタンさせる。',
  '기본 공격 적중 시 30% 확률로 대상을 {v:1.5/1.6/1.7}초 동안 기절시킵니다.'
 ],
 M009:[
  'Charge to a legal hex beside the nearest enemy within 3 hexes. Deal {p:90} physical damage and knock it back 1 hex. If a unit blocks the path, deal an additional {p:54} physical damage to the target and the blocking enemy.',
  '3マス以内の最も近い敵の隣の有効マスへ突進し、{p:90}物理ダメージを与えて1マス押し戻す。経路をユニットが塞いでいると、対象と遮っている敵に追加で{p:54}物理ダメージ。',
  '3칸 내 가장 가까운 적 옆 유효 칸으로 돌진해 물리 피해 {p:90}을 주고 1칸 밀쳐냅니다. 유닛이 경로를 막으면 대상과 가로막는 적에게 물리 피해 {p:54}을 추가로 줍니다.'
 ],
 M010:[
  'Basic attack hits poison the target for 2s, dealing {p:15} magic damage per second. Repeated hits from the same caster refresh the duration without stacking.',
  '通常攻撃命中時、対象を2秒間毒にし、毎秒{p:15}魔法ダメージ。同じ個体の再攻撃は時間を更新し、重複しない。',
  '기본 공격 적중 시 대상을 2초 동안 중독시켜 매초 마법 피해 {p:15}을 줍니다. 같은 개체의 재적중은 시간을 갱신하며 중첩되지 않습니다.'
 ],
 M011:[
  'Place a radius-1 web under an enemy within 3 hexes for {v:4/4.5/5}s. Root each enemy for 0.8s on first entry and slow it while inside. No extra damage or healing reduction.',
  '3マス以内の敵の足元に半径1マスの網を{v:4/4.5/5}秒間設置。各敵を初回進入時に0.8秒間移動不能にし、網の中では減速させる。追加ダメージや回復阻害はない。',
  '3칸 내 적의 발밑에 반경 1칸 거미줄을 {v:4/4.5/5}초 동안 설치합니다. 각 적은 최초 진입 시 0.8초 속박되고 내부에서는 둔화됩니다. 추가 피해나 치유 감소는 없습니다.'
 ],
 M012:[
  'Roar toward the current target, dealing physical damage equal to 160% ATK to enemies in a 120-degree cone extending 2 hexes. No crowd control.',
  '現在の対象に向かって咆哮し、前方2マス・120度の扇形内の敵に攻撃力の160%の物理ダメージ。行動妨害は付与しない。',
  '현재 대상 방향으로 포효해 전방 2칸, 120도 부채꼴 범위의 적에게 공격력 160%의 물리 피해를 줍니다. 군중 제어는 없습니다.'
 ],
 M013:[
  'After a 0.6s windup, grant yourself and living allies within 2 hexes {u:25}% attack speed for 4s. Recasts refresh rather than stack. Does not restore energy.',
  '0.6秒溜めた後、自身と2マス以内の生存味方の攻撃速度を4秒間{u:25}%上昇。再使用は時間を更新し、重複しない。エネルギーは回復しない。',
  '0.6초 준비 후 자신과 2칸 내 생존 아군의 공격 속도를 4초 동안 {u:25}% 증가시킵니다. 재시전은 시간을 갱신하며 중첩되지 않고 에너지를 회복하지 않습니다.'
 ],
 M014:[
  'When a basic attack hits a shielded enemy, first consume up to {p:25} additional shield and heal yourself for 50% of the amount consumed. Triggers at most once every 0.5s.',
  'シールドを持つ敵への通常攻撃時、先に追加で最大{p:25}のシールドを消費させ、その実際の消費量の50%を自身のHPとして回復する。発動は0.5秒に1回まで。',
  '보호막이 있는 적에게 기본 공격 적중 시 먼저 보호막을 추가로 최대 {p:25} 흡수하고 실제 흡수량의 50%만큼 자신을 치유합니다. 0.5초에 최대 한 번 발동합니다.'
 ],
 M015:[
  'Link to the nearest non-summoned ally ahead within 2 hexes. Take 30% of its direct damage after shields and reduce your share by {v:25/30/35}%. The link follows positioning; shared damage cannot be transferred again.',
  '前方2マス以内の最も近い非召喚味方と接続し、シールド吸収後の直接ダメージの30%を肩代わりする。肩代わり分を{v:25/30/35}%軽減。位置に応じて接続を更新し、肩代わり分は再転送しない。',
  '전방 2칸 내 가장 가까운 비소환 아군과 연결해 보호막 적용 후 직접 피해의 30%를 분담합니다. 분담 피해를 {v:25/30/35}% 감소시킵니다. 위치에 따라 연결을 갱신하며 분담 피해는 재전달되지 않습니다.'
 ],
 M016:[
  'Basic attack hits have a 20% chance to disarm the target for {v:1.5/1.6/1.8}s, preventing basic attacks.',
  '通常攻撃命中時、20%の確率で対象を{v:1.5/1.6/1.8}秒間武装解除し、通常攻撃を封じる。',
  '기본 공격 적중 시 20% 확률로 대상을 {v:1.5/1.6/1.8}초 무장 해제하여 기본 공격을 막습니다.'
 ],
 M017:[
  'At combat start, hide and gain {v:30/33/36}% additional dodge for 4s, subject to the total dodge cap. Enemies cannot target you directly; area damage still hits. Does not trigger an extra counterattack.',
  '戦闘開始時、4秒間潜伏し、追加回避率{v:30/33/36}%を得る。敵の直接指定は受けないが範囲ダメージは受ける。総回避率の上限が適用され、追加反撃は発生しない。',
  '전투 시작 시 4초 동안 은신하고 추가 회피율 {v:30/33/36}%를 얻습니다. 적이 직접 대상으로 지정할 수 없지만 범위 피해는 받습니다. 총 회피율 상한이 적용되며 추가 반격은 발동하지 않습니다.'
 ],
 M018:[
  'Place up to 2 eggs with {h:120} HP in legal adjacent empty hexes. After 2s, each hatches in place into a larva with {h:170} HP and {p:21} ATK. Destroyed eggs do not hatch. At most 4 eggs or larvae per caster. Summon HP scales with caster max HP and ATK with caster ATK; recalculate at hatching and maturation.',
  '隣接する有効な空きマスにHP{h:120}の卵を最大2個設置。2秒後、同じ位置でHP{h:170}・攻撃力{p:21}の幼虫へ孵化。破壊された卵は孵化しない。術者ごとに卵と幼虫は合計4体まで。HPは術者の最大HP、攻撃力は術者の攻撃力に連動し、孵化・成長時に再計算する。',
  '인접한 유효 빈칸에 체력 {h:120}의 알을 최대 2개 놓습니다. 2초 후 같은 칸에서 체력 {h:170}, 공격력 {p:21}의 유충으로 부화합니다. 파괴된 알은 부화하지 않으며 시전자당 알과 유충 합계 최대 4개입니다. 소환물 체력은 시전자 최대 체력, 공격력은 시전자 공격력에 비례하며 부화와 성장 시 재계산합니다.'
 ],
 M019:[
  'When an enemy within 3 hexes successfully casts an active skill, counter the caster for {p:65} magic damage. At most once every 2s. This counter cannot trigger another cast counter.',
  '3マス以内の敵がアクティブスキルを正常に発動すると、その術者に{p:65}魔法ダメージで反撃する。2秒に1回まで。この反撃は別の詠唱反撃を誘発しない。',
  '3칸 내 적이 액티브 스킬 시전에 성공하면 시전자에게 마법 피해 {p:65}로 반격합니다. 2초에 최대 한 번 발동하며 이 반격은 다른 시전 반격을 유발하지 않습니다.'
 ],
 M020:[
  'Basic attack hits cause bleeding for 2.5s, dealing {p:12} physical damage per second, and heal yourself for {p:18} HP.',
  '通常攻撃命中で2.5秒間出血させ、毎秒{p:12}物理ダメージを与える。同時に自身のHPを{p:18}回復。',
  '기본 공격 적중 시 2.5초 동안 출혈을 일으켜 매초 물리 피해 {p:12}를 주고 자신을 {p:18} 치유합니다.'
 ],
 M021:[
  'Reduce the armor and magic resistance of every enemy within 2 hexes by {u:45} each for 4s.',
  '自身から2マス以内の全敵の防御力と魔法耐性を4秒間それぞれ{u:45}低下させる。',
  '자신의 2칸 내 모든 적의 방어력과 마법 저항력을 4초 동안 각각 {u:45} 감소시킵니다.'
 ],
 M022:[
  'Gain {u:40}% attack speed and {u:30}% increased damage for 4s, plus a {h:100} shield.',
  '攻撃速度が{u:40}%、与ダメージが{u:30}%、4秒間上昇し、{h:100}のシールドを得る。',
  '4초 동안 공격 속도 {u:40}%, 가하는 피해 {u:30}% 증가와 보호막 {h:100}을 얻습니다.'
 ],
 M023:[
  'Taking effective damage, including shield absorption, adds an armor stack at most once every 0.3s. At 4 stacks, the next non-dodged basic attack consumes them to deal {p:100} additional physical damage.',
  'シールド吸収を含む有効な被ダメージで重甲を獲得。0.3秒に1スタックまで。4スタックで、次の回避されなかった通常攻撃が全て消費し、{p:100}物理ダメージを追加する。',
  '보호막 흡수를 포함한 유효 피해를 받으면 0.3초에 최대 1회 중갑을 쌓습니다. 4중첩 후 다음 회피되지 않은 기본 공격이 중첩을 소모해 물리 피해 {p:100}을 추가합니다.'
 ],
 M024:[
  'Send a phantom shark 3 hexes along a fixed direction. Outbound and return passes each deal {p:80} magic damage, hitting each enemy at most once per pass. It returns to the launch point; the caster does not move.',
  '固定方向へ3マス進む幻の鮫を放つ。往路・復路でそれぞれ{p:80}魔法ダメージを与え、各経路で各敵に1回だけ命中。発射位置へ戻り、術者自身は移動しない。',
  '고정 방향으로 3칸 이동하는 환영 상어를 발사합니다. 왕복 각각 마법 피해 {p:80}을 주며 각 경로에서 적마다 한 번만 적중합니다. 발사 지점으로 돌아오고 시전자는 이동하지 않습니다.'
 ],
 M025:[
  'Pull the farthest targetable enemy within 3 hexes up to 2 hexes closer, deal {p:100} magic damage and disarm for 2s. Path and landing must be legal. Displacement immunity blocks the pull; control immunity blocks disarm; neither alone blocks damage.',
  '3マス以内で最も遠い指定可能な敵を最大2マス引き寄せ、{p:100}魔法ダメージと2秒の武装解除を与える。経路と着地点は有効である必要がある。移動免疫は引き寄せ、行動妨害免疫は武装解除を防ぐが、それだけではダメージを防がない。',
  '3칸 내 가장 먼 지정 가능한 적을 최대 2칸 끌어당기고 마법 피해 {p:100}과 2초 무장 해제를 줍니다. 경로와 도착점이 유효해야 합니다. 강제 이동 면역은 끌어당김, 제어 면역은 무장 해제를 막지만 각각 피해 자체를 막지는 않습니다.'
 ],
 M026:[
  'After a 0.6s windup, cleanse current crowd control from yourself and allies within 2 hexes, then grant {u:25} armor for 4s. Does not remove poison, burning, bleeding or stat debuffs, and grants no ongoing control immunity.',
  '0.6秒溜め、自身と2マス以内の味方の現在の行動妨害を解除し、防御力を4秒間{u:25}上げる。毒・炎上・出血・能力低下は解除せず、以後の行動妨害免疫も与えない。',
  '0.6초 준비 후 자신과 2칸 내 아군의 현재 군중 제어를 해제하고 방어력을 4초 동안 {u:25} 증가시킵니다. 중독, 화상, 출혈, 능력치 감소는 해제하지 않으며 지속 제어 면역도 부여하지 않습니다.'
 ],
 M027:[
  'Fire 4 bone bolts 0.3s apart. Each selects the farthest targetable enemy anywhere on the board. After 0.2s travel, deal {p:42} physical damage and heal yourself for {p:18} HP if damage is dealt. Stun, silence or death interrupts further shots. Bolts already fired persist, but cannot heal a dead caster.',
  '0.3秒間隔で骨槍を4発放ち、各発射時に盤面全域で最も遠い指定可能な敵を選ぶ。0.2秒後に{p:42}物理ダメージを与え、実際にダメージを与えた場合は自身を{p:18}回復。スタン・沈黙・死亡で後続発射を中断。発射済みの槍は残るが、死亡した術者は回復しない。',
  '0.3초 간격으로 뼈창 4개를 발사하며 매번 전장 전체에서 가장 먼 지정 가능한 적을 선택합니다. 0.2초 비행 후 물리 피해 {p:42}를 주고 실제 피해를 주면 자신을 {p:18} 치유합니다. 기절, 침묵, 사망은 후속 발사를 중단합니다. 발사된 창은 남지만 사망한 시전자를 치유하지 않습니다.'
 ],
 M028:[
  s=>`${s===3?'Open radius-2 rifts at up to 3 different enemies, 0.2s apart.':'Open a radius-2 rift at the densest enemy position anywhere on the board, preferring a farther targetable enemy on ties.'} After 0.5s, each rift deals {p:120} magic damage, then {p:35} once per second for 3 pulses, then a final {p:150}. Positions remain fixed and each hit only affects enemies still inside. No crowd control.`,
  s=>`${s===3?'異なる敵最大3体の位置に0.2秒間隔で半径2マスの裂け目を開く。':'盤面全域で敵が最も密集する位置に半径2マスの裂け目を開く。同数なら遠い指定可能な敵を優先。'}各裂け目は0.5秒後に{p:120}魔法ダメージ、続いて毎秒{p:35}を3回、最後に{p:150}を与える。位置は固定され、各判定時に内部にいる敵だけが対象。行動妨害はない。`,
  s=>`${s===3?'서로 다른 적 최대 3명의 위치에 0.2초 간격으로 반경 2칸 균열을 엽니다.':'전장 전체에서 적이 가장 밀집한 위치에 반경 2칸 균열을 엽니다. 동수이면 더 먼 지정 가능한 적을 우선합니다.'} 각 균열은 0.5초 후 마법 피해 {p:120}, 이후 매초 {p:35}씩 3회, 마지막에 {p:150}을 줍니다. 위치는 고정되며 각 판정 시 내부에 남은 적만 피해를 받습니다. 군중 제어는 없습니다.`
 ],
 M029:[
  s=>`Channel ${s===3?'a tracking':'a fixed-direction'} breath for {v:2/2/3}s, dealing {p:55} magic damage every 0.5s along a {v:3/3/6}-hex line, {v:4/4/6} pulses total. Cannot move, attack or recast during the channel. ${s===3?'Retarget the nearest targetable enemy in range if the target dies, hides or leaves range; end if none remains. Immune to forced displacement, but stun, silence and death interrupt.':'Stun, silence, forced displacement and death interrupt.'}`,
  s=>`${s===3?'対象を追尾する':'方向固定の'}ブレスを{v:2/2/3}秒間放ち、前方{v:3/3/6}マスの直線上へ0.5秒ごとに{p:55}魔法ダメージ、計{v:4/4/6}回。詠唱中は移動・通常攻撃・再詠唱不可。${s===3?'対象が死亡・潜伏・射程外となった場合は射程内の最も近い指定可能な敵へ変更し、いなければ終了。強制移動には免疫を持つが、スタン・沈黙・死亡で中断。':'スタン・沈黙・強制移動・死亡で中断。'}`,
  s=>`${s===3?'대상을 추적하는':'방향이 고정된'} 브레스를 {v:2/2/3}초 동안 발사합니다. 전방 {v:3/3/6}칸 직선에 0.5초마다 마법 피해 {p:55}, 총 {v:4/4/6}회를 줍니다. 채널링 중 이동, 기본 공격, 재시전 불가. ${s===3?'대상이 사망, 은신하거나 사거리를 벗어나면 사거리 내 가장 가까운 지정 가능한 적으로 전환하며 없으면 종료합니다. 강제 이동에는 면역이지만 기절, 침묵, 사망으로 중단됩니다.':'기절, 침묵, 강제 이동, 사망으로 중단됩니다.'}`
 ],
 M030:[
  'Bite a melee target for {p:250} physical damage plus 15% of its max HP. Execute if below {v:15/15/25}% HP after the hit; the neutral boss is execution-immune. On a kill, heal 20% of own max HP and pounce to the reachable, targetable enemy with the lowest HP percentage within {v:2/2/4} hexes, up to {v:3/3/5} bites per cast. On a failed kill, gain a shield equal to 25% of own max HP for 3s and stop. Stop if no next target exists or control interrupts.',
  '近接対象に{p:250}＋対象最大HPの15%の物理ダメージ。命中後HPが{v:15/15/25}%未満なら即死させるが、野生ボスには即死無効。撃破時に自身の最大HPの20%を回復し、{v:2/2/4}マス以内で到達・指定可能なHP割合が最も低い敵へ跳びかかる。1回の詠唱で最大{v:3/3/5}回。撃破失敗時は自身最大HPの25%のシールドを3秒間得て終了。次の対象がいない場合や行動妨害でも停止する。',
  '근접 대상에게 물리 피해 {p:250}과 대상 최대 체력의 15%를 줍니다. 적중 후 체력이 {v:15/15/25}% 미만이면 처형하며 야생 보스는 처형에 면역입니다. 처치 시 자신의 최대 체력 20%를 회복하고 {v:2/2/4}칸 내 도달 및 지정 가능한 적 중 체력 비율이 가장 낮은 적에게 도약합니다. 시전당 최대 {v:3/3/5}회입니다. 처치하지 못하면 자신의 최대 체력 25% 보호막을 3초 동안 얻고 종료합니다. 다음 대상이 없거나 제어로 중단되어도 멈춥니다.'
 ],
 M031:[
  'Basic attack hits have a 35% chance to deal {p:25} additional physical damage.',
  '通常攻撃命中時、35%の確率で{p:25}物理ダメージを追加する。',
  '기본 공격 적중 시 35% 확률로 물리 피해 {p:25}를 추가합니다.'
 ],
 M032:[
  'On a basic attack hit, heal the living ally with the lowest current HP for {p:25}. Healing scales with current ATK and healing bonuses.',
  '通常攻撃命中時、現在HPが最も低い生存味方を{p:25}回復する。回復量は現在の攻撃力と回復強化に連動する。',
  '기본 공격 적중 시 현재 체력이 가장 낮은 생존 아군을 {p:25} 치유합니다. 치유량은 현재 공격력과 치유 증가 효과에 비례합니다.'
 ],
 M033:[
  'At combat start, gain control immunity for {v:4/4.5/5}s, blocking stun, root, disarm, silence, slow and taunt. Does not prevent damage.',
  '戦闘開始時、{v:4/4.5/5}秒間行動妨害免疫を得て、スタン・移動不能・武装解除・沈黙・減速・挑発を防ぐ。ダメージは防がない。',
  '전투 시작 시 {v:4/4.5/5}초 동안 제어 면역을 얻어 기절, 속박, 무장 해제, 침묵, 둔화, 도발을 막습니다. 피해는 막지 않습니다.'
 ],
 M034:[
  'Basic attack hits mark the target for 4s. When 3 different non-summoned allies hit it with basic attacks, deal {p:65} physical damage and remove the mark. The marking hit counts.',
  '通常攻撃命中で対象を4秒間マーク。異なる非召喚味方3体の通常攻撃が命中すると{p:65}物理ダメージを与え、マークを解除する。マークを付与した攻撃も1回に数える。',
  '기본 공격 적중 시 대상을 4초 동안 표식합니다. 서로 다른 비소환 아군 3명의 기본 공격이 적중하면 물리 피해 {p:65}를 주고 표식을 제거합니다. 표식을 부여한 공격도 포함됩니다.'
 ],
 M035:[
  'Summon a stationary flower turret in a legal adjacent hex with {h:260} HP, {p:30} ATK and 3-hex range. After surviving 4s it gains {p:15} ATK and 1 range. At most 2 per caster. HP scales with caster max HP and ATK with caster ATK; recalculate on maturation.',
  '有効な隣接マスにHP{h:260}・攻撃力{p:30}・射程3マスの固定花台を召喚。4秒生存すると攻撃力が{p:15}、射程が1増加する。術者ごとに最大2台。HPは術者の最大HP、攻撃力は術者の攻撃力に連動し、成長時に再計算する。',
  '유효한 인접 칸에 체력 {h:260}, 공격력 {p:30}, 사거리 3칸의 고정 꽃 포탑을 소환합니다. 4초 생존하면 공격력 {p:15}와 사거리 1이 증가합니다. 시전자당 최대 2개이며 체력은 시전자 최대 체력, 공격력은 시전자 공격력에 비례하고 성장 시 재계산됩니다.'
 ],
 M036:[
  'Grant each living ally a {h:90} shield, scaling with caster max HP and shield bonuses.',
  '全ての生存味方に{h:90}のシールドを付与。術者の最大HPとシールド強化に連動する。',
  '모든 생존 아군에게 보호막 {h:90}을 부여합니다. 시전자 최대 체력과 보호막 증가 효과에 비례합니다.'
 ],
 M037:[
  'At full energy, bloom and deal {p:180} magic damage to the current target and enemies within 1 hex of it.',
  'エネルギー満タン時に開花し、現在の対象とその1マス以内の敵に{p:180}魔法ダメージを与える。',
  '에너지가 가득 차면 개화해 현재 대상과 대상의 1칸 내 적에게 마법 피해 {p:180}을 줍니다.'
 ],
 M038:[
  'At combat start, hide and gain 30% additional dodge and {u:30}% movement speed for 4s. Enemies cannot target you directly; area damage still hits. The total dodge cap applies.',
  '戦闘開始時、4秒間潜伏し、追加回避率30%と移動速度{u:30}%を得る。敵の直接指定は受けないが範囲ダメージは受ける。総回避率の上限が適用される。',
  '전투 시작 시 4초 동안 은신하고 추가 회피율 30%와 이동 속도 {u:30}%를 얻습니다. 적이 직접 대상으로 지정할 수 없지만 범위 피해는 받습니다. 총 회피율 상한이 적용됩니다.'
 ],
 M039:[
  'Fear the nearest targetable enemy within 2 hexes for 1.2s and deal {p:80} magic damage. Fear prevents attacking and casting and makes it try to flee; it stays still if blocked. If damage is dealt and the target survives, reduce its damage dealt by 25% for 4s.',
  '2マス以内の最も近い指定可能な敵を1.2秒間恐怖にし、{p:80}魔法ダメージ。恐怖中は攻撃・詠唱を停止して逃走を試み、経路がなければ停止。ダメージを与えて対象が生存した場合、その与ダメージを4秒間25%低下させる。',
  '2칸 내 가장 가까운 지정 가능한 적에게 1.2초 공포와 마법 피해 {p:80}을 줍니다. 공포 중 공격과 시전이 중단되고 도망을 시도하며 경로가 없으면 멈춥니다. 피해를 주고 대상이 생존하면 가하는 피해를 4초 동안 25% 감소시킵니다.'
 ],
 M040:[
  'After a 0.4s windup, dash to an empty hex beside the nearest enemy and deal {p:160} physical damage. Reserve the landing before casting. If no hex is free, keep energy and retry later.',
  '0.4秒溜めた後、最も近い敵の隣の空きマスへ突進し、{p:160}物理ダメージを与える。詠唱前に着地点を確保。空きがなければエネルギーを保持して再試行する。',
  '0.4초 준비 후 가장 가까운 적 옆 빈칸으로 돌진해 물리 피해 {p:160}을 줍니다. 시전 전에 착지점을 예약하며 빈칸이 없으면 에너지를 유지하고 재시도합니다.'
 ],
 M041:[
  s=>`After a 0.7s windup, drop a dragon tooth on ${s===3?'up to 3 different nearest enemies, 0.3s apart':'the nearest enemy'}, dealing {p:210} magic damage and stunning for 1.2s per target. The caster does not move.${s===3?' Skip targets that have already died.':''}`,
  s=>`0.7秒溜め、${s===3?'最も近い異なる敵最大3体へ0.3秒間隔で':'最も近い敵へ'}龍牙を落とす。各対象に{p:210}魔法ダメージと1.2秒スタン。自身は移動しない。${s===3?'既に死亡した対象には落とさない。':''}`,
  s=>`0.7초 준비 후 ${s===3?'서로 다른 가장 가까운 적 최대 3명에게 0.3초 간격으로':'가장 가까운 적에게'} 용의 이빨을 떨어뜨립니다. 대상마다 마법 피해 {p:210}과 1.2초 기절을 줍니다. 시전자는 이동하지 않습니다.${s===3?' 이미 사망한 대상은 건너뜁니다.':''}`
 ],
 M042:[
  s=>`Revive 4s after death with {v:50/60/75}% max HP, once per battle.${s===3?' On revival, also gain a shield equal to 15% of own max HP for 3s. Shield bonuses apply; shield prevention blocks it.':''}`,
  s=>`死亡4秒後、最大HPの{v:50/60/75}%で復活。1戦につき1回。${s===3?'復活時に自身最大HPの15%のシールドを3秒間得る。シールド強化が適用され、シールド獲得禁止中は得られない。':''}`,
  s=>`사망 4초 후 최대 체력의 {v:50/60/75}%로 부활합니다. 전투당 한 번입니다.${s===3?' 부활 시 자신의 최대 체력 15%만큼 보호막을 3초 동안 얻습니다. 보호막 증가 효과가 적용되며 보호막 획득 금지 시 생성되지 않습니다.':''}`
 ],
 M043:[
  'Brand the nearest enemy within 4 hexes for 3s, recording actual HP lost. On expiration or true death, explode within 1 hex of it for {p:40} magic damage plus 30% of recorded loss, with the extra portion capped at {p:180}. This explosion is not recorded by other brands.',
  '4マス以内の最も近い敵に3秒間の烙印を付け、実際のHP減少を記録。終了時または本当に死亡した時、その1マス以内で爆発し、{p:40}魔法ダメージ＋記録量の30%を与える。追加分の上限は{p:180}。爆発は他の烙印に記録されない。',
  '4칸 내 가장 가까운 적에게 3초 낙인을 부여해 실제 체력 손실을 기록합니다. 만료 또는 최종 사망 시 대상의 1칸 내에 마법 피해 {p:40}과 기록량의 30%를 주며 추가분 상한은 {p:180}입니다. 이 폭발은 다른 낙인에 기록되지 않습니다.'
 ],
 M044:[
  s=>`After a 0.6s windup, ${s===3?'give every living ally':'gain'} a shield equal to {r:25}% of caster max HP. Grant ${s===3?'every living ally':'yourself and living allies within 2 hexes'} {u:15} armor and {u:15} magic resistance for 4s; recasts refresh, not stack.${s===3?' During the 4s protection, the first lethal hit leaves an ally at 1 HP and grants a shield equal to 20% of that ally’s max HP. Each unit can be saved once per battle; recasts do not reset it. Shield prevention blocks the extra shield, not the 1-HP rescue.':''}`,
  s=>`0.6秒溜め、${s===3?'全ての生存味方に':'自身に'}術者最大HPの{r:25}%のシールドを付与。${s===3?'全ての生存味方':'自身と2マス以内の生存味方'}の防御力・魔法耐性をそれぞれ{u:15}、4秒間上昇。重複せず再使用で時間更新。${s===3?'保護中の最初の致死ダメージではHPを1残し、その味方の最大HP20%のシールドを与える。救済は各ユニット1戦1回で、再使用しても回数は戻らない。シールド禁止中もHPは1残るが追加シールドは得られない。':''}`,
  s=>`0.6초 준비 후 ${s===3?'모든 생존 아군에게':'자신에게'} 시전자 최대 체력 {r:25}%의 보호막을 부여합니다. ${s===3?'모든 생존 아군':'자신과 2칸 내 생존 아군'}의 방어력과 마법 저항력이 4초 동안 각각 {u:15} 증가하며 재시전은 시간만 갱신합니다.${s===3?' 보호 중 최초 치명적 피해를 받으면 체력 1을 남기고 해당 아군 최대 체력 20%의 보호막을 부여합니다. 유닛당 전투 한 번만 구제하며 재시전으로 초기화되지 않습니다. 보호막 금지 시에도 체력 1은 남지만 추가 보호막은 없습니다.':''}`
 ],
 M045:[
  s=>`Strike ${s===3?'up to 3 different enemies with the lowest HP percentages':'the enemy with the lowest current HP'} for {p:200} magic damage each and heal every living ally for {p:80}. Healing does not require a kill; there is no execution threshold.${s===3?' Each kill additionally heals yourself for 20% max HP; excess self-healing becomes a shield. Healing modifiers and shield prevention apply.':''}`,
  s=>`${s===3?'HP割合が最も低い異なる敵最大3体':'現在HPが最も低い敵'}にそれぞれ{p:200}魔法ダメージを与え、全生存味方を{p:80}回復する。回復に撃破は不要で、即死条件もない。${s===3?'撃破ごとに自身の最大HP20%を追加回復し、この回復の余剰分をシールドに変える。回復補正とシールド禁止が適用される。':''}`,
  s=>`${s===3?'체력 비율이 가장 낮은 서로 다른 적 최대 3명':'현재 체력이 가장 낮은 적'}에게 각각 마법 피해 {p:200}을 주고 모든 생존 아군을 {p:80} 치유합니다. 치유는 처치를 요구하지 않으며 처형 조건은 없습니다.${s===3?' 처치마다 자신의 최대 체력 20%를 추가 회복하며 이 자가 치유의 초과분은 보호막으로 바뀝니다. 치유 보정과 보호막 금지가 적용됩니다.':''}`
 ],
 M046:[
  'Basic attack hits grant {u:6} ATK for 3s, stacking up to 3 times.',
  '通常攻撃命中時に攻撃力が3秒間{u:6}上昇。最大3スタック。',
  '기본 공격 적중 시 공격력이 3초 동안 {u:6} 증가합니다. 최대 3중첩입니다.'
 ],
 M047:[
  'At combat start, gain {u:25}% attack speed and {u:25}% movement speed for 4s.',
  '戦闘開始時、攻撃速度と移動速度が4秒間それぞれ{u:25}%上昇する。',
  '전투 시작 시 4초 동안 공격 속도와 이동 속도가 각각 {u:25}% 증가합니다.'
 ],
 M048:[
  'Every third basic attack reduces the current target’s armor by {u:18} for 3s and deals {p:45} additional physical damage. Armor reduction from the same caster refreshes without stacking.',
  '通常攻撃3回ごとに、現在の対象の防御力を3秒間{u:18}低下させ、{p:45}物理ダメージを追加。同じ個体の防御低下は時間更新のみで重複しない。',
  '매 세 번째 기본 공격은 현재 대상의 방어력을 3초 동안 {u:18} 감소시키고 물리 피해 {p:45}를 추가합니다. 같은 개체의 방어력 감소는 시간만 갱신하며 중첩되지 않습니다.'
 ],
 M049:[
  'Plant a poison seed on the nearest enemy for 4s, dealing {p:18} magic damage per second. On true death, spread the remaining seed to at most 2 enemies within 2 hexes, once only, keeping the original expiry. Seeds from the same caster refresh rather than stack on a target. At most 3 active seeds per caster; remove the oldest when exceeded.',
  '最も近い敵に4秒間の毒種を付け、毎秒{p:18}魔法ダメージ。本当に死亡すると、2マス以内の敵最大2体へ残り時間のまま一度だけ伝播。同じ術者から同じ敵への毒種は時間更新のみ。術者ごとに最大3個で、超えると最古の種を除去する。',
  '가장 가까운 적에게 4초 독 씨앗을 심어 매초 마법 피해 {p:18}을 줍니다. 최종 사망 시 원래 만료 시간을 유지하며 2칸 내 적 최대 2명에게 한 세대만 전파합니다. 같은 시전자가 같은 대상에게 부여하면 시간만 갱신합니다. 시전자당 최대 3개이며 초과 시 가장 오래된 씨앗을 제거합니다.'
 ],
 M050:[
  'Root the nearest enemy for 2s, dealing {p:20} magic damage every 0.5s. On expiry or true death, burst for {p:60} magic damage to enemies within 1 hex. Control immunity blocks the root, but not the poison or burst.',
  '最も近い敵を2秒間移動不能にし、0.5秒ごとに{p:20}魔法ダメージ。終了または本当の死亡時に破裂し、1マス以内の敵に{p:60}魔法ダメージ。行動妨害免疫は移動不能だけを防ぎ、毒や破裂ダメージは防がない。',
  '가장 가까운 적을 2초 속박하고 0.5초마다 마법 피해 {p:20}을 줍니다. 만료 또는 최종 사망 시 폭발해 1칸 내 적에게 마법 피해 {p:60}을 줍니다. 제어 면역은 속박만 막고 독이나 폭발 피해는 막지 않습니다.'
 ],
 M051:[
  'Spend 80 energy to drain up to 2 nearest targetable enemies within 1 hex for 4s. Every 0.5s, deal {p:15} magic damage to each and heal for 100% of total actual damage, for 8 pulses. Disconnect targets that leave range, die or become untargetable. Caster death, stun or silence ends the channel. No pull or root. Each pulse uses current ATK; healing modifiers apply.',
  'エネルギー80を消費し、1マス以内の最も近い指定可能な敵最大2体を4秒間吸収。0.5秒ごとに各{p:15}魔法ダメージ、計8回。実際の合計ダメージの100%を自身のHPとして回復。射程外・死亡・指定不能で接続解除。術者の死亡・スタン・沈黙で終了。引き寄せや移動不能はない。毎回現在の攻撃力を参照し、回復補正も適用する。',
  '에너지 80을 소모해 1칸 내 가장 가까운 지정 가능한 적 최대 2명을 4초 동안 흡수합니다. 0.5초마다 각각 마법 피해 {p:15}, 총 8회를 주고 실제 총 피해의 100%만큼 자신을 치유합니다. 대상이 범위를 벗어나거나 사망 또는 지정 불가가 되면 연결을 끊습니다. 시전자 사망, 기절, 침묵으로 종료합니다. 끌어당김과 속박은 없으며 매회 현재 공격력을 읽고 치유 보정을 적용합니다.'
 ],
 M052:[
  'Trigger once when HP first falls to each of 75%, 50% and 25%. Grant a {h:70} shield to up to 2 living non-summoned allies other than self with the lowest HP percentages anywhere on the board, and deal {p:70} magic damage to every enemy within 2 hexes of self. Each threshold triggers once per battle; revival does not reset it. Shields scale with own max HP and damage with current ATK.',
  'HPが初めて75%・50%・25%へ低下した時に各1回発動。自身と召喚物を除く盤面全域の生存味方からHP割合が最も低い最大2体へ{h:70}シールドを付与し、自身から2マス以内の全敵へ{p:70}魔法ダメージ。各閾値は1戦1回で復活でも戻らない。シールドは自身最大HP、ダメージは現在の攻撃力に連動する。',
  '체력이 처음 75%, 50%, 25%에 도달할 때 각각 한 번 발동합니다. 전장 전체에서 자신과 소환물을 제외한 생존 아군 중 체력 비율이 가장 낮은 최대 2명에게 보호막 {h:70}을 주고 자신의 2칸 내 모든 적에게 마법 피해 {p:70}을 줍니다. 각 조건은 전투당 한 번이며 부활로 초기화되지 않습니다. 보호막은 자신의 최대 체력, 피해는 현재 공격력에 비례합니다.'
 ],
 M053:[
  'Erupt at the densest enemy position within 3 hexes for {p:40} magic damage. Leave a radius-1 magma pool for 4s, dealing {p:35} magic damage every 0.5s. Enemies stop taking pool damage after leaving; later entrants are also hit.',
  '3マス以内で敵が最も密集する位置に噴火し、{p:40}魔法ダメージ。半径1マスの溶岩池を4秒間残し、0.5秒ごとに{p:35}魔法ダメージ。外へ出ると池のダメージは止まり、後から入った敵も対象となる。',
  '3칸 내 적이 가장 밀집한 위치에 분출해 마법 피해 {p:40}을 줍니다. 반경 1칸 용암 웅덩이를 4초 남기며 0.5초마다 마법 피해 {p:35}를 줍니다. 밖으로 나가면 웅덩이 피해가 멈추고 나중에 진입한 적도 피해를 받습니다.'
 ],
 M054:[
  s=>`Fire a ray toward the nearest enemy, ${s===3?'extending to the board edge':'4 hexes long'} and about 1 hex wide. Deal {p:170} true damage along the path and gain a {h:90} shield. It pierces enemies and applies no burn.${s===3?' Refract toward up to 3 different enemies not hit by the main ray, dealing 50% of main-ray damage per branch. Each enemy is hit only once per cast, by the main ray or a branch.':''}`,
  s=>`最も近い敵へ${s===3?'盤面端まで届く':'長さ4マスの'}、幅約1マスの光線を放つ。経路上に{p:170}確定ダメージを与え、自身に{h:90}シールド。敵を貫通し、炎上は付与しない。${s===3?'主光線が当たらなかった異なる敵最大3体へ屈折し、各分岐は主光線の50%のダメージを与える。各敵は1回の詠唱で主光線か分岐のどちらか1回だけ命中する。':''}`,
  s=>`가장 가까운 적을 향해 ${s===3?'전장 끝까지 뻗는':'길이 4칸의'} 폭 약 1칸 광선을 발사합니다. 경로에 고정 피해 {p:170}을 주고 자신에게 보호막 {h:90}을 부여합니다. 적을 관통하며 화상은 없습니다.${s===3?' 주 광선에 맞지 않은 서로 다른 적 최대 3명에게 굴절하며 각 분기는 주 광선 피해의 50%를 줍니다. 시전당 각 적은 주 광선 또는 분기 중 한 번만 맞습니다.':''}`
 ],
 M055:[
  'Place up to {v:1/1/3} decoys, each with {h:250} HP, in legal adjacent empty hexes. Each taunts up to 2 susceptible enemies within 2 hexes for 1.5s. On destruction or after 4s, it explodes for {p:140} magic damage within 1 hex. At most {v:1/1/3} living decoys per caster. Limited by available hexes and summon capacity.',
  '隣接する有効な空きマスにHP{h:250}の囮を最大{v:1/1/3}体設置。各囮は2マス以内の挑発可能な敵最大2体を1.5秒間挑発し、破壊時または4秒後に1マス以内へ{p:140}魔法ダメージを与える。術者ごとに生存囮は最大{v:1/1/3}体。空きマスと召喚上限の範囲でのみ生成する。',
  '인접한 유효 빈칸에 각각 체력 {h:250}의 미끼를 최대 {v:1/1/3}개 설치합니다. 각 미끼는 2칸 내 도발 가능한 적 최대 2명을 1.5초 도발합니다. 파괴되거나 4초가 지나면 폭발해 1칸 내에 마법 피해 {p:140}을 줍니다. 시전자당 생존 미끼 최대 {v:1/1/3}개이며 빈칸과 소환 한도 내에서만 생성됩니다.'
 ],
};
