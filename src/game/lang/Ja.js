module.exports = {
  actor: {
    notarget: (actor) => "しかし だれもいなかった・・・",
    dead: (actor) => `[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`,
    noeffect: (actor) => "しかし なにも おこらなかった！",
    nomagicpoint: (actor) => "MPが足りない！"
  },
  target: {
    dead: (target) => `[DEAD] こうかがない・・・${target.name}はただのしかばねのようだ・・・`,
    noeffect: (target) => "[DEAD] しかし こうかがなかった・・・",
    damaged: (target, point) => `${target.name}に ${point} のダメージ！ 残り: ${target.status.currentHp} / ${target.status.maxHp}`
  },
  attack: {
    default: (actor, target, point) => `[ATTACK] ${actor.name}のこうげき！${target.name}に${point}のダメージ！ 残り:${target.status.currentHp} / ${target.status.maxHp}`,
    multiple: (actor, target, point, n) => `[ATTACK] ${actor.name}の${n}れんぞくこうげき！${target.name}に${point}のダメージ！ 残り:${target.status.currentHp} / ${target.status.maxHp}`,
    dead: (target) => `[DEAD] ${target.name}はしんでしまった`
  },
  cure: {
    default: (target) => `[CURE] ${target.name}のキズがかいふくした！残り: ${target.status.currentHp} / ${target.status.maxHp}`
  },
  raise: {
    default: (target) => `[CURE] ${target.name}は いきかえった！`
  },
  status: {
    default: (target) => `現在のHP: ${target.status.currentHp} / ${target.status.maxHp}`
  },
  spell: {
    cast: (actor, spellName) => `[ATTACK] ${actor.name} は ${spellName} をとなえた！`
  }

}
