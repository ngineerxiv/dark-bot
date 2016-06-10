"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const Spell     = DarkQuest.Spell;
const CureEffect   = DarkQuest.Effect.CureEffect;
const StatusEffect = DarkQuest.Effect.StatusEffect;
const StatusValues = DarkQuest.StatusValues;

class MonsterRepositoryOnMemory {
    constructor() {
        this.monsters = [
            new User(0, "社会", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(300, 120, new HitRate(100))), new Parameter(100, 12)),
            new User(0, "神父", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(0, 0, new HitRate(100))), new Parameter(800, 10), [new Spell("レイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)])])
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
