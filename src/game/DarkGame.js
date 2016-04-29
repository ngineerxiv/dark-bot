"use strict";

const INITIAL_ATTACK_DAMANE   = 70;
const INITIAL_CURE_POINT      = 30;
const EventEmitter = require('eventemitter2').EventEmitter2;
const lang = require(`${__dirname}/lang/Ja.js`);

class DarkGame extends EventEmitter {
    constructor(game) {
        super();
        this.game = game;
        game.on("user-hp-changed", function(data) {
            this.emit("game-user-hp-changed", data);
        });
    }

    attack(actor, target, n) {
        n = n !== undefined ? n : 1;
        let messages = [];
        if(actor === null || target === null) {
            messages.push(lang.actor.notarget(actor));
        } else if (actor.isDead()) {
            messages.push(lang.actor.dead(actor));
        } else if (target.isDead()) {
            messages.push(lang.target.dead(target));
        } else {
            let before      = target.status.currentHp;
            if ( n === 1 ) {
            let afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);

            let after       = afterStatus.currentHp
            messages.push(lang.attack.default(actor, target, before, after));
            } else if (n > 0) {
                let afterStatus
                for(let i=0;i<n;i++) {
                    afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
                }
                let after       = afterStatus.currentHp
                messages.push(lang.attack.multiple(actor, target, before, after));
            }
            if (target.isDead()) {
                messages.push(lang.target.dead(target))
            }
        };
        return {
            actor: actor,
            target: target,
            messages: messages
        };
    }

    cure(actor, target) {
        let messages = [];
        if(actor === null || target === null) {
            messages.push(lang.actor.notarget(actor));
        } else if (actor.isDead() ) {
            messages.push(lang.actor.dead(actor));
        } else if (target.isDead()) {
            messages.push(lang.target.noeffect(target));
        } else {
            actor.cure(target, INITIAL_CURE_POINT);
            messages.push(lang.cure.default(target));
        };
        return {
            actor: actor,
            target: target,
            messages: messages
        };
    }

    raise(actor, target) {
        let messages = [];
        if(actor === null || target === null) {
            messages.push(lang.actor.notarget(actor));
        } else if (actor.isDead() ) {
            messages.push(lang.actor.dead(actor));
        } else {
            if(!target.isDead()) {
                messages.push(lang.actor.noeffect(actor));
            } else {
                actor.fullCare(target);
                messages.push(lang.raise.default(target));
            }
        };
        return {
            actor: actor,
            target: target,
            messages: messages
        };
    }

    status(target) {
        var messages = [];
        if(target === null) {
            messages.push(lang.actor.notarget(actor));
        } else {
            messages.push(lang.status.default(target));
        };
        return {
            target: target,
            messages: messages
        };
    }
}

module.exports = DarkGame;
