"use strict"
const DarkQuest = require("node-quest");
const User      = DarkQuest.User;
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Status    = DarkQuest.Status;

class UserManager {
    constructor(slackUserRepository, userRepository, spellRepository, jobRepository, weaponRepository, monsterRepository) {
        this.users = [];
        this.slackUserRepository = slackUserRepository;
        this.userRepository     = userRepository;
        this.spellRepository    = spellRepository;
        this.jobRepository      = jobRepository;
        this.weaponRepository   = weaponRepository;
        this.monsterRepository  = monsterRepository;
    }

    getUsers() {
        return this.users;
    }

    getAllUsers() {
        const monsters = this.monsterRepository.get();
        return this.users.concat(monsters);
    }

    getByName(name) {
        const users = this.getAllUsers()
        const targets = users.filter((u) => u.name === name);
        return targets.length === 0 ? null : targets.pop();
    }

    load() {
        const slackUsers = this.slackUserRepository.load();
        this.users = slackUsers.map((slackUser) => {
            const saved = this.userRepository.getStatesById(slackUser.id);
            const job           = this.jobRepository.getByName(saved.jobName) || null;
            const weapon        = this.weaponRepository.getByName(saved.weaponName);
            const u = new User(
                slackUser.id, 
                slackUser.name, 
                saved.hitPoint, 
                saved.magicPoint, 
                new Equipment(weapon),
                new Parameter(100, 50, 200, 0),
                [],
                new Status(),
                job
            );

            u.hitPoint.on("changed", (data) => {
                this.userRepository.saveState(u);
            });
            u.magicPoint.on("changed", (data) => {
                this.userRepository.saveState(u);
            });

            u.on("jobChanged", (data) => {
                this.userRepository.saveState(u);
            });
            if (!slackUser.isBot) {
                u.spells = this.spellRepository.get();
            }
            return u;
        });
        return this.users;
    }

    save() {
        this.userRepository.saveAll(this.users);
    }
}

module.exports = UserManager;
