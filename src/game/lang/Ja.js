module.exports = {
  actor: {
    notarget: (actor) => "しかし だれもいなかった・・・",
    dead: (actor) => `[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`,
    noeffect: (actor) => "しかし なにも おこらなかった！",
    nomagicpoint: (actor) => "MPが足りない！",
    counter: (actor) => `${actor.name} の反撃！`,
    feedback: {
        damaged : (actor, p) => `${actor.name}に ${p} のダメージ！ 残り：${actor.hitPoint.current} / ${actor.hitPoint.max}`,
        cured: (actor, p) => `${actor.name}のキズがかいふくした！残り：${actor.hitPoint.current} / ${actor.hitPoint.max}`,
        mindDamaged : (actor, p) => `${actor.name}のMPに ${p} のダメージ！ 残り：${actor.magicPoint.current} / ${actor.magicPoint.max}`,
        mindCured: (actor, p) => `${actor.name}のMPがかいふくした！残り：${actor.magicPoint.current} / ${actor.magicPoint.max}`

    }
  },
  target: {
    dead: (target) => `[DEAD] こうかがない・・・${target.name}はただのしかばねのようだ・・・`,
    noeffect: (target) => "[DEAD] しかし こうかがなかった・・・",
    damaged: (target, point) => `${target.name}に ${point} のダメージ！ 残り: ${target.hitPoint.current} / ${target.hitPoint.max}`
  },
  attack: {
    default: (actor, target, point) => `[ATTACK] ${actor.name}のこうげき！${target.name}に${point}のダメージ！ 残り:${target.hitPoint.current} / ${target.hitPoint.max}`,
    multiple: (actor, target, point, n) => `[ATTACK] ${actor.name}の${n}れんぞくこうげき！${target.name}に${point}のダメージ！ 残り:${target.hitPoint.current} / ${target.hitPoint.max}`,
    critical: (actor, target, point) => `[ATTACK] ${actor.name}のこうげき！かいしんのいちげき！${target.name}に${point}のダメージ！ 残り:${target.hitPoint.current} / ${target.hitPoint.max}`,
    dead: (target) => `[DEAD] ${target.name}はしんでしまった`,
    miss: (target) => `[MISS] ${target.name}はひらりと身をかわした`
  },
  cure: {
    default: (target) => `[CURE] ${target.name}のキズがかいふくした！残り: ${target.hitPoint.current} / ${target.hitPoint.max}`
  },
  mind: {
      attack: (target, p) => `${target.name}のMPに ${p} のダメージ！ 残り：${target.magicPoint.current} / ${target.magicPoint.max}`,
      cure: (target) => `${target.name}のMPがかいふくした！残り：${target.magicPoint.current} / ${target.magicPoint.max}`
  },
  raise: {
    default: (target) => `[CURE] ${target.name}は いきかえった！`
  },
  status: {
    default: (target) => [
             `現在のHP: ${target.hitPoint.current} / ${target.hitPoint.max}`,
             `現在のMP: ${target.magicPoint.current} / ${target.magicPoint.max}`,
             `使える魔法: ${target.getLearnedSpells().map((s) => s.name).join(",")}`,
             `現在の職業: ${target.job ? target.job.name : "無職"}`
    ].join("\n"),
    bitness: (value) => `社会から受けたつらさ: ${value}`
  },
  spell: {
    cast: (actor, spellName) => `${actor.name} は ${spellName} をとなえた！`
  },
  bitness: {
    notenough: () => "しかし いのりはとどかなかった"
  },
  job: {
    list: (joinedJobNames) => `転職可能なJob一覧: ${joinedJobNames}`,
    notfound: (jobName) => `職業 "${jobName}"はみつからなかった・・・`,
    notenough: (currentBitness, requiredBitness) => `社会から受けたつらさが足りない！ 現在: ${currentBitness}, 必要な量: ${requiredBitness}`,
    changed: (target, job) => `${target.name} は "${job.name}" に転職した！`
  },
  summon: {
      default: (name) => `${name}を召喚した。`
  }

}
