"use strict";

const lang = require(`${__dirname}/lang/Ja.js`);

class DarkGame {
    constructor(game) {
        this.game = game;
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
            let results     = [];
            for(let i=0;i<n;i++) {
                results = results.concat([actor.attack(target)]);
            }
            let point = results.reduce((pre, cur) => pre + cur.attack.value, 0);
            point = isNaN(point) ? 0 : point;
            n === 1 ?
                messages.push(lang.attack.default(actor, target, point)):
                messages.push(lang.attack.multiple(actor, target, point, n));
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
}

module.exports = DarkGame;
