module.exports = {
  actor: {
    notarget: (actor) => "しかし だれもいなかった・・・",
    dead: (actor) => `[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`,
    noeffect: (actor) => "しかし なにも おこらなかった！",
    nomagicpoint: (actor) => "MPが足りない！",
    counter: (actor) => `${actor.name} の反撃！`
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
    default: (target) => [
             `現在のHP: ${target.hitPoint.current} / ${target.hitPoint.max}`,
             `現在のMP: ${target.magicPoint.current} / ${target.magicPoint.max}`,
             `使える魔法: ${target.spells.map((s) => s.name).join(",")}`
    ].join("\n")
  },
  spell: {
    cast: (actor, spellName) => `${actor.name} は ${spellName} をとなえた！`
  },

}
