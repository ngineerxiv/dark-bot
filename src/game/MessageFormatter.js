"use strict"

const formatter = require("string-template");

class MessageFormatter {
    constructor(messages) {
        this.messages = messages || messagesFormats;
    }

    apply(format, params) {
        return formatter(format, {
            actor: params.actor.name,
            actorCurrentHitPoint: params.actor.hitPoint.current,
            target: params.target.name,
            point: point,
            // TODO
        });
    }
}

const messagesFormats = {
    actor: {
        notarget: "しかし だれもいなかった・・・",
        dead: "[DEAD] おぉ{actor}！死んでしまうとはふがいない",
        noeffect: "しかし なにも おこらなかった！",
        nomagicpoint: "MPが足りない！",
        counter: "{actor} の反撃！",
        feedback: {
            damaged : "{actor}に {point} のダメージ！ 残り：{actorCurrentHitPoint} / {actorMaxHitPoint}",
            cured: "{actor}のキズがかいふくした！残り：{actorCurrentHitPoint} / {actorMaxHitPoint}",
            mindDamaged :"{actor}のMPに {point} のダメージ！ 残り：{actorCurrentMagicPoint} / {actorMaxMagicPoint}",
            mindCured: "{actor}のMPがかいふくした！残り：{actorCurrentMagicPoint} / {actorMaxMagicPoint}"
        }
    },
    target: {
        dead: "[DEAD] こうかがない・・・{target}はただのしかばねのようだ・・・",
        noeffect: "[DEAD] しかし こうかがなかった・・・",
        damaged: "{target}に {point} のダメージ！ 残り: {targetCurrentHitPoint} / {targetMaxHitPoint}"
    },
    attack: {
        default: "[ATTACK] {actor}のこうげき！{target}に{point}のダメージ！ 残り:{targetCurrentHitPoint} / {targetMaxHitPoint}",
        multiple: "[ATTACK] {actor}の{n}れんぞくこうげき！{target}に{point}のダメージ！ 残り:{targetCurrentHitPoint} / {targetMaxHitPoint}",
        critical: "[ATTACK] {actor}のこうげき！かいしんのいちげき！{target}に{point}のダメージ！ 残り:{targetCurrentHitPoint} / {targetMaxHitPoint}",
        dead: "[DEAD] {target}はしんでしまった",
        miss: "[MISS] {target}はひらりと身をかわした"
    },
    cure: {
        default: "[CURE] {target}のキズがかいふくした！残り: {targetCurrentHitPoint} / {targetMaxHitPoint}"
    },
    mind: {
        attack: "{target}のMPに {point} のダメージ！ 残り：{targetCurrentMagicPoint} / {targetMaxMagicPoint}",
        cure: "{target}のMPがかいふくした！残り：{targetCurrentMagicPoint} / {targetMaxMagicPoint}"
    },
    raise: {
        default: "[CURE] {target}は いきかえった！"
    },
    status: {
        default: "現在のHP: {targetCurrentHitPoint} / {targetMaxHitPoint}\n現在のMP: {targetCurrentMagicPoint} / {targetMaxMagicPoint}\n使える魔法: {learnedSpells}\n現在の職業: {currentJob}"
        bitness: "社会から受けたつらさ: {currentBitness}"
    },
    spell: {
        cast: "{actor} は {spellName} をとなえた！"
    },
    bitness: {
        notenough: "しかし いのりはとどかなかった"
    },
    job: {
        list: "転職可能なJob一覧: {allJobs}",
        notfound: '職業 "{jobName}"はみつからなかった・・・',
        notenough: "社会から受けたつらさが足りない！ 現在: {currentBitness}, 必要な量: {requiredBitness}",
        changed: (target, job) => '{target} は "{jobName}" に転職した！'
    },
    summon: {
        default: "{monster}を召喚した。"
    }
}

module.exports = MessageFormatter;
