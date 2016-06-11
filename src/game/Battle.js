"use strict"

const NodeQuest = require("node-quest");
const UserStates  = NodeQuest.UserStates;

class Battle {
    constructor(game, lang) {
        this.game = game;
        this.lang = lang;
    }

    attack(actor, target, messageSender) {
        if (!target) {
            return messageSender(this.lang.actor.notarget(actor));
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
        return messageSender(messages.join("\n"));
    }

    cast(actor, target, spellName, messageSender) {
        if (actor.spells.filter((s) => s.name === spellName).length <= 0) {
            return;
        } else if (!target) {
            return messageSender(this.lang.actor.notarget(actor));
        }

        const result    = actor.cast(spellName, target);
        let messages = [];
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
        return messageSender(messages.join("\n"));
    }

    status(target, messageSender) {
        const message   = target ?
            this.lang.status.default(target) :
            this.lang.actor.notarget(target);
        return messageSender(message)
    }
}

module.exports = Battle;
