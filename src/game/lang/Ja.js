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
    damaged: (target, point) => `${target.name}に ${point} のダメージ！ 残り: ${target.hitPoint.current} / ${target.hitPoint.max}`
  },
  attack: {
    default: (actor, target, point) => `[ATTACK] ${actor.name}のこうげき！${target.name}に${point}のダメージ！ 残り:${target.hitPoint.current} / ${target.hitPoint.max}`,
    multiple: (actor, target, point, n) => `[ATTACK] ${actor.name}の${n}れんぞくこうげき！${target.name}に${point}のダメージ！ 残り:${target.hitPoint.current} / ${target.hitPoint.max}`,
    dead: (target) => `[DEAD] ${target.name}はしんでしまった`,
    miss: (target) => `[MISS] ${target.name}はひらりと身をかわした`
  },
  cure: {
    default: (target) => `[CURE] ${target.name}のキズがかいふくした！残り: ${target.hitPoint.current} / ${target.hitPoint.max}`
  },
  raise: {
    default: (target) => `[CURE] ${target.name}は いきかえった！`
  },
  status: {
    default: (target) => `現在のHP: ${target.hitPoint.current} / ${target.hitPoint.max} \n 現在のMP: ${target.magicPoint.current} / ${target.magicPoint.max}`
  },
  spell: {
    cast: (actor, spellName) => `${actor.name} は ${spellName} をとなえた！`
  }

}
