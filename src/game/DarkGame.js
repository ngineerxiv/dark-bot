"use strict"

const NodeQuest = require("node-quest");
const Cron      = require("cron").CronJob;
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const MonsterRepository = require("../game/MonsterRepository.js");
const Battle    = require("../game/Battle.js");
const lang      = require("../game/lang/Ja.js");
const negativeWords   = require("../game/NegativeWords.js").factory();

class DarkGame {
    constructor(userRepository) {
        this.game = new NodeQuest.Game();
        this.userRepository = userRepository;
        this.monsterRepository = new MonsterRepository();
        this.spellRepository = new SpellRepository();
        this.battle = new Battle(this.game, lang);
        this.jobs = [
            new Cron("0 0 * * 1", () => this.game.users.forEach((u) => u.cured(Infinity)), null, true, "Asia/Tokyo"),
            new Cron("0 0 * * *", () => this.game.users.forEach((u) => u.magicPoint.change(Infinity)), null, true, "Asia/Tokyo")
        ];
    }

    loadUsers() {
        const users = this.userRepository.get();
        const monsters = this.monsterRepository.get();
        users.forEach((u) => {
            if (!this.userRepository.isBot(u.id)) {
                u.spells = this.spellRepository.get();
            }
            u.hitPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
            u.magicPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
        });
        this.game.setUsers(users.concat(monsters));
        return this.game;
    }

    attackToUser(actorName, targetName, messageSender) {
        const actor = this.game.findUser(actorName);
        if (!actor) {
            return
        }
        const target = this.game.findUser(targetName);
        const result = this.battle.attack(actor, target);
        return messageSender(result.messages.join("\n"));
    }

    castToUser(actorName, targetName, spellName, messageSender) {
        const actor  = this.game.findUser(actorName);
        const target = this.game.findUser(targetName);
        const result = this.battle.cast(actor, target, spellName);
        return messageSender(result.messages.join("\n"));
    }

    statusOfUser(targetName, messageSender) {
        const target = this.game.findUser(targetName);
        const message = target ?
            lang.status.default(target) :
            lang.actor.notarget(target);
        return messageSender(message);
    }

    prayToPriest(actorName, messageSender) {
        const priest = this.monsterRepository.getByName("神父");
        const target = this.game.findUser(actorName);
        const result = this.battle.cast(priest, target, "レイズ");
        return messageSender(result.messages.join("\n"));
    }

    takePainByWorld(targetName, basicFormedMessages, messageSender) {
        const shakai = this.monsterRepository.getByName("社会");
        const target = this.game.findUser(targetName)
        if ( !target || target.isDead() ) {
            return;
        }
        const count   = negativeWords.countNegativeWords(basicFormedMessages);
        if(count <= 0) {
            return
        }
        const result = this.battle.multipleAttack(shakai, target, count);
        return messageSender(result.messages.join("\n"));
    }
}

module.exports = DarkGame;
