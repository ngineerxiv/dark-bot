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
const AttackEffect = DarkQuest.Effect.AttackEffect;
const CureEffect   = DarkQuest.Effect.CureEffect;
const StatusEffect = DarkQuest.Effect.StatusEffect;
const StatusValues = DarkQuest.StatusValues;

class MonsterRepositoryOnMemory {
    constructor() {
        const world = new User(0, "社会", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(300, 120, new HitRate(100))), new Parameter(100, 12));
        const priest = new User(0, "神父", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(0, 0, new HitRate(100))), new Parameter(800, 10), [
                new Spell("レイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
                new Spell("神の裁き", 0, new AttackEffect(Infinity))
        ]);
        const holiday = new User(0, "休日", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(0, 0, new HitRate(100))), new Parameter(Infinity, 0), [
            new Spell("アレイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
            new Spell("フルケア", 100, new CureEffect(Infinity))
        ]);

        priest.counter = new Spell("神の裁き", 0, new AttackEffect(Infinity));
        this.monsters = [world, priest, holiday];
    }

    get() {
        return this.monsters;
    }

    getByName(name) {
        return this.monsters.filter((m) => m.name === name).pop() || null;
    }

}

module.exports = MonsterRepositoryOnMemory;
