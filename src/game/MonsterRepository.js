"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const Critical  = DarkQuest.Critical;
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const Spell     = DarkQuest.Spell;
const AttackEffect = DarkQuest.Effect.AttackEffect;
const CureEffect   = DarkQuest.Effect.CureEffect;
const StatusEffect = DarkQuest.Effect.StatusEffect;
const MindAttackEffect = DarkQuest.Effect.MindAttackEffect;
const MindCureEffect = DarkQuest.Effect.MindCureEffect;
const StatusValues = DarkQuest.StatusValues;
const Feedback = require("./spell/Feedback.js");
const DrainFeedback = Feedback.DrainFeedback;
const MagicDrainFeedback = Feedback.MagicDrainFeedback;

class MonsterRepositoryOnMemory {
    constructor() {
        this.monsters = [];
    }

    get() {
        return this.monsters;
    }

    getByName(name) {
        return this.get().filter((m) => m.name === name).pop() || null;
    }

    put(monster) {
        monster.hitPoint.on("changed", (data) => {
            if (data.next.empty()) {
                this.remove(monster.name);
            }
        });
        this.monsters = this.monsters.concat([monster]);
        return this.monsters;
    }

    remove(name) {
        this.monsters = this.monsters.filter((m) => m.name !== name);
    }

}

module.exports = MonsterRepositoryOnMemory;
