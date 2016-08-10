"use strict"

const Game      = require("node-quest");
const Weapon    = Game.Weapon;
const HitRate   = Game.HitRate;
const Critical  = Game.Critical;

class WeaponRepositoryOnMemory {
    constructor() {
        this.weapons = [
            new Weapon("素手", 100, 50, new HitRate(90), new Critical(10))
        ];
    }

    getByName(name) {
        return this.weapons.filter((j) => j.name === name).pop() || null;
    }
}

module.exports = WeaponRepositoryOnMemory;
