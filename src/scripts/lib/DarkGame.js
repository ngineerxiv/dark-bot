var INITIAL_ATTACK_DAMANE   = 70;
var INITIAL_CURE_POINT      = 30;

var DarkGame = function(game) {
    this.attack = function(attacker, attacked) {
        var messages = [];
        if(attacker === null || attacked === null) {
            messages.push("しかし だれもいなかった・・・");
        } else if (attacker.isDead() ) {
            messages.push("[DEAD] おぉ" + attacker.name + "！死んでしまうとはふがいない");
        } else if (attacked.isDead()) {
            messages.push("[DEAD] こうかがない・・・" + attacked.name + "はただのしかばねのようだ・・・");
        } else {
            var before      = attacked.status.currentHp;
            var afterStatus = attacker.attack(attacked, INITIAL_ATTACK_DAMANE);
            var after       = afterStatus.currentHp
            messages.push("[ATTACK] " + attacker.name + "のこうげき！" + attacked.name + "に" + (before - after) + "のダメージ！ 残り:" + after + " / " + game.maxHp);
            if (attacked.isDead()) {
                messages.push("[DEAD] " + attacked.name + "はしんでしまった")
            }
        };
        return {
            actor: attacker,
            target: attacker,
            messages: messages
        };
    };

    this.multipleAttack = function(attacker, attacked, n) {
        var messages = [];
        if(attacker === null || attacked === null) {
            messages.push("しかし だれもいなかった・・・");
        } else if (attacker.isDead() ) {
            messages.push("[DEAD] おぉ" + attacker.name + "！死んでしまうとはふがいない");
        } else if (attacked.isDead()) {
            messages.push("[DEAD] こうかがない・・・" + attacked.name + "はただのしかばねのようだ・・・");
        } else {
            var before      = attacked.status.currentHp;
            var afterStatus
            for(var i=0;i<n;i++) {
                afterStatus = attacker.attack(attacked, INITIAL_ATTACK_DAMANE);
            }
            var after       = afterStatus.currentHp
            messages.push("[ATTACK] " + attacker.name + "の" + n + "れんぞくこうげき！" + attacked.name + "に" + (before - after) + "のダメージ！ 残り:" + after + " / " + game.maxHp);
            if (attacked.isDead()) {
                messages.push("[DEAD] " + attacked.name + "はしんでしまった")
            }
        };
        return {
            actor: attacker,
            target: attacker,
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
            messages.push("[CURE] " + target.name + "のキズがかいふくした！残り: " + target.status.currentHp + " / " + game.maxHp);
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
            messages.push("現在のHP: " + target.status.currentHp + " / " + game.maxHp);
        };
        return {
            target: target,
            messages: messages
        };
    }
}

module.exports = DarkGame;
