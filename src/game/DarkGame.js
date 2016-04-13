"use strict"

const INITIAL_ATTACK_DAMANE   = 70;
const INITIAL_CURE_POINT      = 30;
const EventEmitter = require('eventemitter2').EventEmitter2;

class DarkGame extends EventEmitter {
    constructor(game) {
        super();
        this.game = game;
        this.game.on("user-hp-changed", (data) =>  this.emit("game-user-hp-changed", data));
    }

    attack(actor, target, n) {
        n = n || 1;
        let messages = [];
        if(actor === null || target === null) {
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push(`[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`);
        } else if (target.isDead()) {
            messages.push(`[DEAD] こうかがない・・・${target.name}はただのしかばねのようだ・・・`);
        } else {
            const before      = target.status.currentHp;
            let after;
            let afterStatus;
            if ( n === 1 ) {
                afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
                after       = afterStatus.currentHp;
                messages.push(`[ATTACK] ${actor.name}のこうげき！${target.name}に${(before - after)}のダメージ！ 残り:${after} / ${this.game.maxHp}`);
            } else if (n > 0) {
                for(let i=0;i<n;i++) {
                    afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
                }
                after       = afterStatus.currentHp
                messages.push(`[ATTACK] ${actor.name}の${n}れんぞくこうげき！${target.name}に${(before - after)}のダメージ！ 残り:${after} / ${this.game.maxHp}`);
            }
            if (target.isDead()) {
                messages.push(`[DEAD] ${target.name}はしんでしまった`)
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
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push( `[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`);
        } else if (target.isDead()) {
            messages.push( "[DEAD] しかし こうかがなかった・・・");
        } else {
            actor.cure(target, INITIAL_CURE_POINT);
            messages.push(`[CURE] ${target.name}のキズがかいふくした！残り: ${target.status.currentHp} / ${this.game.maxHp}`);
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
            messages.push("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            messages.push( `[DEAD] おぉ${actor.name}！死んでしまうとはふがいない`);
        } else {
            if(!target.isDead()) {
                messages.push("しかし なにも おこらなかった！");
            } else {
                actor.fullCare(target);
                messages.push(`[CURE] ${target.name}はいきかえった！`);
            }
        };
        return {
            actor: actor,
            target: target,
            messages: messages
        };
    }
    status(target) {
        let messages = [];
        if(target === null) {
            messages.push("しかし だれもいなかった・・・");
        } else {
            messages.push(`現在のHP: ${target.status.currentHp} / ${this.game.maxHp}`);
        };
        return {
            target: target,
            messages: messages
        };
    }
}

module.exports = DarkGame;
