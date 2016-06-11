"use strict"

class Battle {
    constructor(game, lang) {
        this.game = game;
        this.lang = lang;
    }

    attack(actor, target) {

    }

    status(target, messageSender) {
        const message   = target ?
            this.lang.status.default(target) :
            this.lang.actor.notarget(target);
        return messageSender(message)
    }
}

module.exports = Battle;
