"use strict"

const Game      = require("node-quest");
const Job       = Game.Job;
const Spell     = Game.Spell;
const AttackEffect = Game.Effect.AttackEffect;
const CureEffect   = Game.Effect.CureEffect;
const StatusEffect = Game.Effect.StatusEffect;
const MindAttackEffect = Game.Effect.MindAttackEffect;
const StatusValues = Game.StatusValues;
const ParameterAdjust = Game.Parameter;
const Feedback = require("./spell/Feedback.js");
const DrainFeedback = Feedback.DrainFeedback;
const MagicDrainFeedback = Feedback.MagicDrainFeedback;

class SpellRepositoryOnMemory {
    constructor() {
        this.jobs = [
            new Job("魔族", [
                    new Spell("ザケル", 10, new AttackEffect(90)),
                    new Spell("ザケルガ", 30, new AttackEffect(270)),
                    new Spell("テオザケル", 100, new AttackEffect(900)),
                    new Spell("バオウザケルガ", 200, new AttackEffect(1800)),
                    new Spell("シンベルワンバオウザケルガ", 500, new AttackEffect(4500)),
                    new Spell("シン・ベルワン・バオウ・ザケルガ", 500, new AttackEffect(4500)),
                    new Spell("サイフォジオ", 120, new CureEffect(1000)),
                    new Spell("レイス", 20, new AttackEffect(180)),
                    new Spell("ギガノレイス", 50, new AttackEffect(450))
            ], new ParameterAdjust(500, 200, -100, 0)),
            new Job("死神", [
                    new Spell("破道の一", 20, new AttackEffect(180)),
                    new Spell("破道の四", 25, new AttackEffect(200)),
                    new Spell("破道の三十三", 40, new AttackEffect(360)),
                    new Spell("赤火砲", 40, new AttackEffect(360)),
                    new Spell("破道の六十三", 100, new AttackEffect(1000)),
                    new Spell("雷吼炮", 100, new AttackEffect(1000)),
                    new Spell("破道の七十三", 120, new AttackEffect(1300)),
                    new Spell("双蓮蒼火墜", 120, new AttackEffect(1300)),
                    new Spell("破道の九〇", 300, new AttackEffect(2500)),
                    new Spell("黒棺", 300, new AttackEffect(2500)),
                    new Spell("破道の九十一", 250, new AttackEffect(2000)),
                    new Spell("千手皎天汰炮", 220, new AttackEffect(2000)),
                    new Spell("破道の九十六", 250, new AttackEffect(2200)),
                    new Spell("一刀火葬", 250, new AttackEffect(2200))
            ], new ParameterAdjust(200, 0, 200, 30)),
            new Job("黒魔道士", [
                    new Spell("メラゾーマ", 50, new AttackEffect(450)),
                    new Spell("メラガイアー", 100, new AttackEffect(900)),
                    new Spell("ファイア", 10, new AttackEffect(90)),
                    new Spell("ファイラ", 30, new AttackEffect(270)),
                    new Spell("ファイガ", 100, new AttackEffect(900)),
                    new Spell("ファイジャ", 200, new AttackEffect(1800)),
                    new Spell("ブリザド", 10, new AttackEffect(90)),
                    new Spell("ブリザラ", 30, new AttackEffect(270)),
                    new Spell("ブリザガ", 100, new AttackEffect(900)),
                    new Spell("ブリザジャ", 200, new AttackEffect(1800)),
                    new Spell("サンダー", 10, new AttackEffect(90)),
                    new Spell("サンダラ", 30, new AttackEffect(270)),
                    new Spell("サンダガ", 100, new AttackEffect(900)),
                    new Spell("サンダジャ", 200, new AttackEffect(1800)),
                    new Spell("ドレイン", 20, new AttackEffect(180, new DrainFeedback())),
                    new Spell("アスピル", 20, new MindAttackEffect(180, new MagicDrainFeedback(), (x) => parseInt(x / 10))),
                    new Spell("マホトラ", 10, new MindAttackEffect(90, new MagicDrainFeedback(), (x) => parseInt(x / 10))),
                    new Spell("メテオ", 270, new AttackEffect(2400)),
                    new Spell("アルテマ", 330, new AttackEffect(3000)),
                    new Spell("メルトン", 300, new AttackEffect(2700)),
                    new Spell("フレア", 250, new AttackEffect(2200)),
            ], new ParameterAdjust(500, 0, -400, 50)),
            new Job("白魔道士", [
                    new Spell("ケアルダ", 100, new CureEffect(900)),
                    new Spell("ケアルガ", 130, new CureEffect(1200)),
                    new Spell("ケアルジャ", 200, new CureEffect(1800)),
                    new Spell("フルケア", 400, new CureEffect(Infinity)),
                    new Spell("バギ", 10, new AttackEffect(90)),
                    new Spell("バギマ", 30, new AttackEffect(270)),
                    new Spell("バギクロス", 100, new AttackEffect(900)),
                    new Spell("ベホマ", 110, new CureEffect(999)),
                    new Spell("ホーリー", 180, new AttackEffect(1600)),
                    new Spell("アレイズ", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
                    new Spell("ザオリク", 300, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)])
            ], new ParameterAdjust(500, 0, -400, 50)),
            new Job("社畜", [
                    new Spell("異議あり", 100, new AttackEffect(900)),
                    new Spell("進捗どうですか", 120, new AttackEffect(1000)),
                    new Spell("圧倒的成長", 150, new AttackEffect(1200)),
                    new Spell("モンスター", 50, new CureEffect(500)),
                    new Spell("華金", 100, new CureEffect(900)),
                    new Spell("眠眠打破", 80, new CureEffect(800)),
                    new Spell("Redbull", 120, new CureEffect(1000)),
                    new Spell("レッドブル", 120, new CureEffect(1000))
            ], new ParameterAdjust(-400, 100, 700, 0)),
            new Job("光の戦士", [
                    new Spell("ケアルダ", 100, new CureEffect(900)),
                    new Spell("ケアルガ", 130, new CureEffect(1200)),
                    new Spell("ケアルジャ", 200, new CureEffect(1800)),
                    new Spell("ベホマ", 110, new CureEffect(999)),
                    new Spell("バギ", 10, new AttackEffect(90)),
                    new Spell("バギマ", 30, new AttackEffect(270)),
                    new Spell("バギクロス", 100, new AttackEffect(900)),
                    new Spell("インデグニション", 100, new AttackEffect(900)),
                    new Spell("インディグニション", 100, new AttackEffect(900)),
                    new Spell("ホーリー", 270, new AttackEffect(2500))
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
