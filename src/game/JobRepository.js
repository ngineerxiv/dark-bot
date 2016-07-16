"use strict"

const Game      = require("node-quest");
const Job       = Game.Job;
const Spell     = Game.Spell;
const AttackEffect = Game.Effect.AttackEffect;
const CureEffect   = Game.Effect.CureEffect;
const StatusEffect = Game.Effect.StatusEffect;
const StatusValues = Game.StatusValues;
const ParameterAdjust = Game.Parameter;

class SpellRepositoryOnMemory {
    constructor() {
        this.jobs = [
            new Job("魔族", [
                    new Spell("ザケル", 10, new AttackEffect(90)),
                    new Spell("ザケルガ", 30, new AttackEffect(270)),
                    new Spell("テオザケル", 100, new AttackEffect(900)),
                    new Spell("バオウザケルガ", 200, new AttackEffect(1800)),
                    new Spell("シンベルワンバオウザケルガ", 500, new AttackEffect(4500)),
                    new Spell("シン・ベルワン・バオウ・ザケルガ", 500, new AttackEffect(4500))
            ], new ParameterAdjust(500, 200, -100, 0)),
            new Job("死神", [
                    new Spell("黒棺", 300, new AttackEffect(2500))
            ], new ParameterAdjust(200, 0, 200, 30)),
            new Job("社畜", [
                    new Spell("メラゾーマ", 20, new AttackEffect(175)),
                    new Spell("メラガイアー", 50, new AttackEffect(450)),
                    new Spell("アルテマ", 250, new AttackEffect(2200)),
                    new Spell("フレア", 200, new AttackEffect(1800)),
                    new Spell("異議あり", 10, new AttackEffect(100)),
            ], new ParameterAdjust(-200, 100, 500, 0)),
            new Job("光の戦士", [
                    new Spell("ケアルダ", 100, new CureEffect(900)),
                    new Spell("ケアルガ", 130, new CureEffect(1200)),
                    new Spell("ベホマ", 110, new CureEffect(999)),
                    new Spell("インデグニション", 100, new AttackEffect(900)),
                    new Spell("インディグニション", 100, new AttackEffect(900)),
                    new Spell("ホーリー", 180, new AttackEffect(1600)),
                    new Spell("アレイズ", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
                    new Spell("ザオリク", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)])
            ], new ParameterAdjust(300, 0, -100, 0))
        ];
    }

    getAll() {
        return this.jobs;
    }

    getByName(name) {
        return this.jobs.filter((j) => j.name === name).pop() || null;
    }
}

module.exports = SpellRepositoryOnMemory;
