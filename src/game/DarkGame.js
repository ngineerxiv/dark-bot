var INITIAL_ATTACK_DAMANE   = 70;
var INITIAL_CURE_POINT      = 30;
var EventEmitter = require('eventemitter2').EventEmitter2;

var DarkGame = function(game) {
    EventEmitter.call(this);

    this.attack = function(actor, target, n) {
        n = n !== undefined ? n : 1;
        var messages = [];
        if(actor === null || target === null) {
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push("[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else if (target.isDead()) {
            messages.push("[DEAD] こうかがない・・・" + target.name + "はただのしかばねのようだ・・・");
        } else {
            var before      = target.status.currentHp;
            
            if ( n === 1 ) {
            var afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);

            var after       = afterStatus.currentHp
            messages.push("[ATTACK] " + actor.name + "のこうげき！" + target.name + "に" + (before - after) + "のダメージ！ 残り:" + after + " / " + target.status.maxHp);
            } else if (n > 0) {
                var afterStatus
                for(var i=0;i<n;i++) {
                    afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
                }
                var after       = afterStatus.currentHp
                messages.push("[ATTACK] " + actor.name + "の" + n + "れんぞくこうげき！" + target.name + "に" + (before - after) + "のダメージ！ 残り:" + after + " / " + target.status.maxHp);
            }
            if (target.isDead()) {
                messages.push("[DEAD] " + target.name + "はしんでしまった")
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
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else if (target.isDead()) {
            messages.push( "[DEAD] しかし こうかがなかった・・・");
        } else {
            actor.cure(target, INITIAL_CURE_POINT);
            messages.push("[CURE] " + target.name + "のキズがかいふくした！残り: " + target.status.currentHp + " / " + target.status.maxHp);
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
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else {
            if(!target.isDead()) {
                messages.push("しかし なにも おこらなかった！");
            } else {
                actor.fullCare(target);
                messages.push("[CURE] " + target.name + "は いきかえった！");
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
            messages.push("しかし だれもいなかった・・・");
        } else {
            messages.push("現在のHP: " + target.status.currentHp + " / " + target.status.maxHp);
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
