"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;

class MonsterRepositoryOnMemory {
    constructor() {
        this.monsters = [
            new User(0, "社会", new Status(Infinity, Infinity, Infinity, Infinity), new Equipment(new Weapon(100, 12, new HitRate(100))), new Parameter(100, 12))
        ];
    }

    get() {
        return this.monsters;
    }

    getByName(name) {
        return this.monsters.filter((m) => m.name === name).pop() || null;
    }

}

module.exports = MonsterRepositoryOnMemory;
