"use strict"

const Game      = require("node-quest");
const Spell     = Game.Spell;
const AttackEffect = Game.AttackEffect;

class SpellRepositoryOnMemory {
    constructor() {
        this.spells    = [
            new Spell("アルテマ", 5, new AttackEffect(800)),
            new Spell("メラ", 5, new AttackEffect(20)),
            new Spell("ザケル", 5, new AttackEffect(50)),
            new Spell("異議あり", 5, new AttackEffect(200)),
            new Spell("黒棺", 5, new AttackEffect(Infinity))
        ];
    }

    get() {
        return this.spells;
    }
}

module.exports = SpellRepositoryOnMemory;
