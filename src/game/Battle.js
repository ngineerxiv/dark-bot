"use strict"

const NodeQuest = require("node-quest");
const UserStates  = NodeQuest.UserStates;
const SpellRepository = require("./SpellRepository.js");
const spellRepository = new SpellRepository();

class Battle {
    constructor(game, lang) {
        this.game = game;
        this.lang = lang;
    }

    attack(actor, target) {
        if (!target) {
            return {
                messages: [this.lang.actor.notarget(actor)],
                result: null,
                counter: null
            }
        }
        const result = actor.attack(target);
        let messages = [];
        switch (result) {
            case UserStates.TargetDead:
                messages.push(this.lang.target.dead(target));
                break;
            case UserStates.ActorDead:
                messages.push(this.lang.actor.dead(actor));
                break;
            default:
                const hit   = result.attack.hit;
                const point = result.attack.value;
                hit ?
                    messages.push(this.lang.attack.default(actor, target, point)):
                    messages.push(this.lang.attack.miss(target));
                target.isDead() && messages.push(this.lang.attack.dead(target));
                break;
        }
        let counterResult = null;
        if ( !target.isDead() && target.counter ) {
            messages.push(this.lang.actor.counter(target));
            const counter = target.counter.name ?
                this.cast(target, actor, target.counter.name):
                this.attack(target, actor);
            counterResult = counter.result;
            messages = messages.concat(counter.messages);
        }

        return {
            messages: messages,
            result: result,
            counter: counterResult
        };
    }

    // TODO actorが死んでいる時の処理
    // 現状モンスターしか使わないAPIなので、問題ないがUserが使う際には必要
    // returnの値も適当なのでFIXME
    multipleAttack(actor, target, n) {
        const results           = Array(n).fill(1).map((i) => actor.attack(target))
        const attackedResults   = results.filter((r) => typeof r !== 'symbol').filter((r) => r.attack.hit);
        const point             = attackedResults.reduce((pre, cur) => pre + cur.attack.value, 0);
        let messages = [];
        if( attackedResults.length > 0 ) {
            n === 1 ?
                messages.push(this.lang.attack.default(actor, target, point)):
                messages.push(this.lang.attack.multiple(actor, target, point, n));
            target.isDead() && messages.push(this.lang.attack.dead(target));
        } else {
            messages.push(this.lang.attack.miss(target));
        }
        return {
            messages: messages,
            result: results,
            counter: null,
        };
    }

    cast(actor, target, spellName) {
        if (actor.spells.filter((s) => s.name === spellName).length <= 0) {
            return {
                messages: [],
                result: null,
                counter: null
            };
        } else if (!target) {
            return {
                messages: [this.lang.actor.notarget(actor)],
                result: null,
                counter: null
            };
        }

        let messages = [];
        const chant = spellRepository.getChant(spellName);
        chant && messages.push(chant);
        const result    = actor.cast(spellName, target);
        switch (result) {
            case UserStates.NoTargetSpell:
                break;
            case UserStates.NotEnoughMagicPoint:
                messages.push(this.lang.actor.nomagicpoint(actor));
                break;
            case UserStates.TargetDead:
                messages.push(this.lang.target.dead(target));
                break
            case UserStates.ActorDead:
                messages.push(this.lang.actor.dead(actor));
                break;
            default:
                messages.push(this.lang.spell.cast(actor, spellName));
                if( result.effects.attack !== null ) {
                    messages.push(this.lang.target.damaged(result.target, result.effects.attack));
                    result.target.isDead() && messages.push(this.lang.attack.dead(result.target));
                }
                const statusEffectResult = result.effects.status.filter((e) => e.effective)
                    if(result.effects.status.length > 0) {
                        (statusEffectResult.length > 0) ?
                            messages.push(this.lang.raise.default(result.target)): 
                            messages.push(this.lang.actor.noeffect(result.actor));
                    } else if( result.effects.cure !== null) {
                        messages.push(this.lang.cure.default(result.target));
                    }
        }
        let counterResult = null;
        if ( !target.isDead() && target.counter ) {
            messages.push(this.lang.actor.counter(target));
            const counter = target.counter.name ?
                this.cast(target, actor, target.counter.name):
                this.attack(target, actor);
            messages = messages.concat(counter.messages);
            counterResult = counter.result;
        }

        return {
            messages: messages,
            result: result,
            counter: counterResult
        };
    }
}

module.exports = Battle;
