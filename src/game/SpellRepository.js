"use strict"

const Game      = require("node-quest");
const Spell     = Game.Spell;
const AttackEffect = Game.Effect.AttackEffect;
const CureEffect   = Game.Effect.CureEffect;
const StatusEffect = Game.Effect.StatusEffect;
const StatusValues = Game.StatusValues;
const Feedback     = Game.Feedback;
const FeedbackResult    = Game.FeedbackResult;
const Url = require("../lib/Url");

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
            "破道の三十三": () => `君臨者よ\n血肉の仮面・万象・羽搏き・ヒトの名を冠す者よ\n真理と節制\n罪知らぬ夢の壁に僅かに爪を立てよ\n\n破道の三十三　『蒼火墜』`,
            "破道の六十三": () => `散在する獣の骨\n尖塔・紅晶・鋼鉄の車輪\n動けば風\n止まれば空\n槍打つ音色が虚城に満ちる\n\n破道の六十三　『雷吼炮』`,
            "破道の七十三": () => `血肉の仮面\n万象・羽搏き・ヒトの名を冠す者よ\n蒼火の壁に双蓮を刻む\n大火の淵を遠天にて待つ\n\n破道の七十三　『双蓮蒼火墜』`,
            "破道の九〇": () => "滲み出す混濁の紋章\n不遜なる狂気の器\n湧き上がり・否定し・痺れ・瞬き・眠りを妨げる\n爬行する鉄の王女\n絶えず自壊する泥の人形\n結合せよ\n反発せよ\n地に満ち己の無力を知れ\n\n破道の九十　『黒棺』",
            "黒棺": () =>  {
                const url = Math.random() > 0.5 ? 
                    (Url.apply('http://yamiga.waka.ru.com/images/hado90.jpg')):
                    (Url.apply('http://yamiga.waka.ru.com/images/hado90AA.jpg'));
                return `滲み出す混濁の紋章\n不遜なる狂気の器\n湧き上がり・否定し・痺れ・瞬き・眠りを妨げる\n爬行する鉄の王女\n絶えず自壊する泥の人形\n結合せよ\n反発せよ\n地に満ち己の無力を知れ\n\n破道の九十　『黒棺』\n\n ${url}`
            },
            "破道の九一": () => `千手の涯\n届かざる闇の御手\n映らざる天の射手\n光を落とす道\n火種を煽る風\n集いて惑うな\n我が指を見よ\n光弾・八身・九条・天経・疾宝・大輪・灰色の砲塔\n弓引く彼方\n皎皎として消ゆ\n\n破道の九十一　『千手皎天汰炮』`,
            "千手皎天汰炮": () => `千手の涯\n届かざる闇の御手\n映らざる天の射手\n光を落とす道\n火種を煽る風\n集いて惑うな\n我が指を見よ\n光弾・八身・九条・天経・疾宝・大輪・灰色の砲塔\n弓引く彼方\n皎皎として消ゆ\n\n破道の九十一　『千手皎天汰炮』`,
            "インデグニション": () => "天光満つる処に我は在り 黄泉の門開く処に汝在り 出でよ 神の雷",
            "インディグニション": () => "天光満つる処に我は在り 黄泉の門開く処に汝在り 出でよ 神の雷"
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
