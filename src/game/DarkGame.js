"use strict";

const Cron  = require("cron").CronJob;
const lang  = require(`${__dirname}/lang/Ja.js`);

class DarkGame {
    constructor(game, hitPointRepository, monsterRepository, spellRepository) {
        this.game = game;
        this.hitPointRepository = hitPointRepository;
        this.monsterRepository  = monsterRepository;
        this.spellRepository    = spellRepository;

        new Cron("0 0 * * 1",() => this.game.users.forEach((u) => u.cured(Infinity)), null, true, "Asia/Tokyo");
    }

    loadUsers(slackUsers) {
        const users = slackUsers.concat(this.monsterRepository.get());
        users.forEach((u) => {
            u.spells = this.spellRepository.get();
            u.hitPoint.on("changed", (data) => {
                this.hitPointRepository.save(this.game.users);
            });
        });
        this.game.setUsers(users);
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
