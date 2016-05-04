"use strict"

const Game      = require("node-quest");
const Spell     = Game.Spell;
const AttackEffect = Game.Effect.AttackEffect;
const CureEffect   = Game.Effect.CureEffect;
const StatusEffect = Game.Effect.StatusEffect;
const StatusValues = Game.StatusValues;

class SpellRepositoryOnMemory {
    constructor() {
        this.spells    = [
            new Spell("アルテマ", 5, new AttackEffect(800)),
            new Spell("メラ", 5, new AttackEffect(20)),
            new Spell("ザケル", 5, new AttackEffect(50)),
            new Spell("異議あり", 5, new AttackEffect(200)),
            new Spell("黒棺", 5, new AttackEffect(Infinity)),
            new Spell("cure", 5, new CureEffect(100)),
            new Spell("raise", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)])
        ];
    }

    get() {
        return this.spells;
    }
}

module.exports = SpellRepositoryOnMemory;
