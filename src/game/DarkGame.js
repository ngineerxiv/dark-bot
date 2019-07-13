"use strict"

const NodeQuest = require("node-quest");
const Cron      = require("cron").CronJob;
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const JobRepository   = require("../game/JobRepository.js");
const MonsterRepository = require("../game/MonsterRepository.js");
const MonsterFactory = require("../game/MonsterFactory.js");
const Battle    = require("../game/Battle.js");
const lang      = require("../game/lang/Ja.js");
const StatusValues = NodeQuest.StatusValues;
const negativeWords   = require("../game/NegativeWords.js").factory();
const UserManager = require("../game/UserManager.js");
const WeaponRepository = require("../game/WeaponRepository.js");
const AutoAction = require("../game/AutoAction.js");

class DarkGame {
    constructor(userRepository, bitnessRepository) {
        this.userRepository     = userRepository;
        this.spellRepository    = new SpellRepository();
        this.jobRepository      = new JobRepository();
        this.weaponRepository   = new WeaponRepository();
        this.monsterRepository  = new MonsterRepository();
        this.monsterFactory     = new MonsterFactory();
        this.userManager        = new UserManager(
            userRepository,
            this.spellRepository,
            this.jobRepository,
            this.weaponRepository,
            this.monsterRepository
        );
        this.battle             = new Battle(lang);
        this.cronJobs           = [
            new Cron("0 0 * * 1", () => this.cureAll(), null, true, "Asia/Tokyo"),
            new Cron("0 4 * * *", () => this.cureMindAll(), null, true, "Asia/Tokyo")
        ];
        this.bitnessRepository  = bitnessRepository;
        ["社会", "休日", "神父", "会社"].forEach((monsterName) => {
            const m = this.monsterFactory.factory(monsterName);
            this.monsterRepository.put(m);
        });
    }

    async loadUsers() {
        const users = await this.userManager.load();
        this.bitnessRepository.load();
        return users;
    }

    attackToUser(actorName, targetName, messageSender) {
        const actor = this.userManager.getByName(actorName);
        if (!actor) {
            this.loadUsers();
            return;
        }
        const target = this.userManager.getByName(targetName);
        const result = this.battle.attack(actor, target);
        return messageSender(result.messages.join("\n"));
    }

    castToUser(actorName, targetName, spellName, messageSender) {
        const actor  = this.userManager.getByName(actorName);
        if (!actor) {
            this.loadUsers();
            return;
        }
        const target = this.userManager.getByName(targetName);
        const result = this.battle.cast(actor, target, spellName);
        return messageSender(result.messages.join("\n"));
    }

    statusOfUser(targetName, messageSender) {
        const target = this.userManager.getByName(targetName);
        if ( !target ) {
            return messageSender(lang.actor.notarget(target));
        }
        const bitness = this.bitnessRepository.get(target.id);
        return messageSender([
                lang.status.default(target),
                lang.status.bitness(bitness)
        ].join("\n"));
    }

    listJobs(messageSender) {
        return messageSender(lang.job.list(this.jobRepository.getAll().map((j) => j.name).join(",")));
    }

    changeJob(targetName, jobName, messageSender) {
        const target    = this.userManager.getByName(targetName);
        if ( !target) {
            this.loadUsers();
            return;
        }
        const job       = this.jobRepository.getByName(jobName);
        if ( !job ) {
            return messageSender(lang.job.notfound(jobName));
        }

        const bitness = this.bitnessRepository.get(target.id);
        const requiredBitness = 2000;
        let message;
        if( bitness < requiredBitness ) {
            message = lang.job.notenough(bitness, requiredBitness);
        } else {
            target.changeJob(job);
            target.emit("jobChanged", {
                target: target,
                job: job
            });
            this.bitnessRepository.decrease(target.id, requiredBitness);
            message = lang.job.changed(target, job);
        }
        return messageSender(message);
    }


    cureAll() {
        const holiday   = this.monsterRepository.getByName("休日");
        const users = this.userManager.getAllUsers()
        users.forEach((u) => {
            holiday.cast("アレイズ", u);
            holiday.cast("フルケア", u);
        })
    }

    cureMindAll() {
        const users = this.userManager.getAllUsers()
        users.forEach((u) => u.mindCured(Infinity))
    }

    prayToPriest(actorName, messageSender) {
        const priest = this.monsterRepository.getByName("神父");
        const target = this.userManager.getByName(actorName);
        let message = "";
        if( this.bitnessRepository.get(target.id) < 300 ) {
            message = lang.bitness.notenough();
        } else {
            const result = this.battle.cast(priest, target, "レイズ");
            this.bitnessRepository.decrease(target.id, 300);
            message = result.messages.join("\n");
        }
        return messageSender(message);
    }

    async takePainByWorld(targetName, kuromojiFormedMessages, messageSender) {
        const shakai = this.monsterRepository.getByName("社会");
        const target = this.userManager.getByName(targetName)
        if ( !target || target.isDead() ) {
            await this.loadUsers();
            return;
        }
        const count = negativeWords.countPain(kuromojiFormedMessages);
        if(count <= 0) {
            return
        }
        const result = this.battle.multipleAttack(shakai, target, count);
        const damage = result.result.filter((r) => typeof r !== 'symbol').filter((r) => r.attack.hit).reduce((pre, cur) => pre + cur.attack.value, 0);
        this.bitnessRepository.increase(target.id, damage);
        return messageSender(result.messages.join("\n"));
    }

    payDay(targetName, messageSender) {
        const requiredBitness = 500;
        const target = this.userManager.getByName(targetName);
        if ( !target ) {
            return messageSender(lang.actor.notarget(target));
        }
        const bitness = this.bitnessRepository.get(target.id);
        const company = this.monsterRepository.getByName("会社");
        let message = "";
        if( this.bitnessRepository.get(target.id) < requiredBitness ) {
            message = lang.bitness.notenough();
        } else {
            const result = this.battle.cast(company, target, "給与");
            this.bitnessRepository.decrease(target.id, requiredBitness);
            message = result.messages.join("\n");
        }

        return messageSender(message);
    }

    summon(targetManager, messageSender) {
        const monsterName = "憲兵";
        if (this.userManager.getByName(monsterName)) {
            return messageSender("召喚に失敗した");
        }
        const m = this.monsterFactory.factory(monsterName);
        this.monsterRepository.put(m);
        const action = new AutoAction(targetManager, this.battle, messageSender, this.userManager);
        action.act(m);
        messageSender(lang.summon.default(monsterName));
    }

}

module.exports = DarkGame;
