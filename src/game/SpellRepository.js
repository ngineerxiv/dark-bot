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
            new Spell("アルテマ", 250, new AttackEffect(2200)),
            new Spell("フレア", 200, new AttackEffect(1800)),
            new Spell("ホーリー", 180, new AttackEffect(1600)),
            new Spell("黒棺", 300, new AttackEffect(2500)),
            new Spell("メラ", 1, new AttackEffect(10)),
            new Spell("メラミ", 8, new AttackEffect(80)),
            new Spell("メラゾーマ", 20, new AttackEffect(175)),
            new Spell("メラガイアー", 50, new AttackEffect(450)),
            new Spell("ザケル", 10, new AttackEffect(90)),
            new Spell("ザケルガ", 30, new AttackEffect(270)),
            new Spell("テオザケル", 100, new AttackEffect(900)),
            new Spell("バオウザケルガ", 200, new AttackEffect(1800)),
            new Spell("シンベルワンバオウザケルガ", 500, new AttackEffect(4500)),
            new Spell("シン・ベルワン・バオウ・ザケルガ", 500, new AttackEffect(4500)),
            new Spell("異議あり", 10, new AttackEffect(100)),
            new Spell("インデグニション", 100, new AttackEffect(900)),
            new Spell("インディグニション", 100, new AttackEffect(900)),
            new Spell("ケアル", 10, new CureEffect(100)),
            new Spell("ケアルラ", 50, new CureEffect(500)),
            new Spell("ケアルダ", 100, new CureEffect(900)),
            new Spell("ケアルガ", 130, new CureEffect(1200)),
            new Spell("ホイミ", 3, new CureEffect(30)),
            new Spell("ベホイミ", 10, new CureEffect(90)),
            new Spell("ベホマ", 110, new CureEffect(999)),
            new Spell("レイズ", 50, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
            new Spell("アレイズ", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
            new Spell("ザオリク", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
        ];
    }

    get() {
        return this.spells;
    }
}

module.exports = SpellRepositoryOnMemory;
