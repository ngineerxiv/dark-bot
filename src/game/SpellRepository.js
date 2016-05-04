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
            new Spell("アルテマ", 130, new AttackEffect(1500)),
            new Spell("黒棺", 5, new AttackEffect(2500)),
            new Spell("メラ", 2, new AttackEffect(10)),
            new Spell("メラミ", 6, new AttackEffect(80)),
            new Spell("メラゾーマ", 10, new AttackEffect(175)),
            new Spell("メラガイアー", 45, new AttackEffect(250)),
            new Spell("ザケル", 5, new AttackEffect(50)),
            new Spell("ザケルガ", 10, new AttackEffect(200)),
            new Spell("テオザケル", 100, new AttackEffect(300)),
            new Spell("バオウザケルガ", 200, new AttackEffect(1800)),
            new Spell("異議あり", 5, new AttackEffect(100)),
            new Spell("cure", 5, new CureEffect(100)),
            new Spell("ケアル", 5, new CureEffect(100)),
            new Spell("ケアルラ", 20, new CureEffect(500)),
            new Spell("ケアルガ", 50, new CureEffect(1200)),
            new Spell("raise", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
            new Spell("レイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)])
            new Spell("アレイズ", 40, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)])
        ];
    }

    get() {
        return this.spells;
    }
}

module.exports = SpellRepositoryOnMemory;
