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
        const world = new User(0, "社会", 
            new HitPoint(Infinity, Infinity), 
            new MagicPoint(Infinity, Infinity), 
            new Equipment(new Weapon("権力", 300, 120, new HitRate(95), new Critical(20))), 
            new Parameter(100, 12),
            [
                new Spell("MPバスター", 0, new MindAttackEffect(Infinity, new MagicDrainFeedback()))
            ]
        );
        const priest = new User(0, "神父", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon("慈悲", 0, 0, new HitRate(100))), new Parameter(800, 10), [
                new Spell("レイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
                new Spell("神の裁き", 0, new AttackEffect(Infinity))
        ]);
        const holiday = new User(0, "休日", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon("", 0, 0, new HitRate(100))), new Parameter(Infinity, 0), [
            new Spell("アレイズ", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(Infinity)]),
            new Spell("フルケア", 100, new CureEffect(Infinity)),
            new Spell("MPバスター", 0, new MindAttackEffect(Infinity, new MagicDrainFeedback()))
        ]);
        const company = new User(0, "会社", new HitPoint(Infinity, Infinity), new MagicPoint(0, 0), new Equipment(new Weapon("", 0, 0, new HitRate(100))), new Parameter(0, 0), [
            new Spell("給与", 0, new MindCureEffect(300)),
            new Spell("弾圧", 0, [new AttackEffect(Infinity), new MindAttackEffect(Infinity)])
        ]);

        priest.counter = new Spell("神の裁き", 0, new AttackEffect(Infinity));
        world.counter = new Spell("MPバスター", 0, new MindAttackEffect(Infinity, new MagicDrainFeedback()));
        holiday.counter = new Spell("MPバスター", 0, new MindAttackEffect(Infinity, new MagicDrainFeedback()));
        company.counter = new Spell("弾圧", 0, [new AttackEffect(Infinity), new MindAttackEffect(Infinity)]);
        this.monsters = [world, priest, holiday, company];
        this.summoned = [];
    }

    get() {
        return this.monsters.concat(this.summoned);
    }

    getByName(name) {
        return this.monsters.filter((m) => m.name === name).pop() || null;
    }

    create(name) {
        const m = new User(0, name, new HitPoint(2000, 2000), new MagicPoint(1000, 1000), new Equipment(new Weapon("素手", 100, 50, new HitRate(90))), new Parameter(100, 20, 200, 0), [])
        m.hitPoint.on("changed", (data) => {
            if (data.next.empty()) {
                this.monsterRepository.remove(monsterName);
            }
        });
        this.summoned.push(m);
        return m;
    }

    remove(name) {
        this.summond = this.summoned.filter((m) => m.name !== name);
    }

}

module.exports = MonsterRepositoryOnMemory;
