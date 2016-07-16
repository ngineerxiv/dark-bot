"use strict"

const uuid = require("node-uuid");
const Game      = require("node-quest");
const Spell     = Game.Spell;
const AttackEffect = Game.Effect.AttackEffect;
const CureEffect   = Game.Effect.CureEffect;
const StatusEffect = Game.Effect.StatusEffect;
const StatusValues = Game.StatusValues;

class SpellRepositoryOnMemory {
    constructor() {
        this.spells    = [
            new Spell("メラ", 1, new AttackEffect(10)),
            new Spell("メラミ", 8, new AttackEffect(80)),
            new Spell("ケアル", 10, new CureEffect(100)),
            new Spell("ケアルラ", 50, new CureEffect(500)),
            new Spell("ホイミ", 3, new CureEffect(30)),
            new Spell("ベホイミ", 10, new CureEffect(90)),
            new Spell("レイズ", 50, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)])
        ];

        this.chants = {
            "黒棺": () =>  {
                const url = Math.random() > 0.5 ? 
                    `http://yamiga.waka.ru.com/images/hado90.jpg?cb=${uuid.v4()}`: 
                    `http://yamiga.waka.ru.com/images/hado90AA.jpg?cb=${uuid.v4()}`;
                return `滲み出す混濁の紋章\n不遜なる狂気の器\n湧き上がり・否定し・痺れ・瞬き・眠りを妨げる\n爬行する鉄の王女\n絶えず自壊する泥の人形\n結合せよ\n反発せよ\n地に満ち己の無力を知れ\n\n破道の九十　『黒棺』\n\n ${url}`
            }
        };
    }

    get() {
        return this.spells;
    }

    getChant(spellName) {
        const chant = this.chants[spellName];
        return chant ?
            chant():
            null;
    }
}

module.exports = SpellRepositoryOnMemory;
