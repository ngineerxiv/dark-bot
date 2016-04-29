var INITIAL_ATTACK_DAMANE   = 70;
var INITIAL_CURE_POINT      = 30;
var EventEmitter = require('eventemitter2').EventEmitter2;
const lang = require(`${__dirname}/lang/Ja.js`);

var DarkGame = function(game) {
    EventEmitter.call(this);

    this.attack = function(actor, target, n) {
        n = n !== undefined ? n : 1;
        var messages = [];
        if(actor === null || target === null) {
            messages.push(lang.actor.notarget(actor));
        } else if (actor.isDead() ) {
            messages.push(lang.actor.dead(actor));
        } else if (target.isDead()) {
            messages.push(lang.target.dead(target));
        } else {
            var before      = target.status.currentHp;
            if ( n === 1 ) {
            var afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);

            var after       = afterStatus.currentHp
            messages.push(lang.attack.default(actor, target, before, after));
            } else if (n > 0) {
                var afterStatus
                for(var i=0;i<n;i++) {
                    afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
                }
                var after       = afterStatus.currentHp
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
    };

    this.cure = function(actor, target) {
        var messages = [];
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
    };

    this.raise = function(actor, target) {
        var messages = [];
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
    };

    this.status = function(target) {
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

    game.on("user-hp-changed", function(data) {
        this.emit("game-user-hp-changed", data);
    });
}

DarkGame.prototype = Object.create(EventEmitter.prototype);

module.exports = DarkGame;
