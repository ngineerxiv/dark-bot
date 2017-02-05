"use strict"

const Game      = require("node-quest");
const Weapon    = Game.Weapon;
const HitRate   = Game.HitRate;
const Critical  = Game.Critical;
const defaultWeapon = new Weapon("素手", 100, 50, new HitRate(90), new Critical(10)); 

class WeaponRepositoryOnMemory {
    constructor() {
        this.weapons = [
            new Weapon("素手", 100, 50, new HitRate(90), new Critical(10))
        ];
    }

    getByName(name) {
        return this.weapons.filter((j) => j.name === name).pop() || defaultWeapon;
    }
}

module.exports = WeaponRepositoryOnMemory;
