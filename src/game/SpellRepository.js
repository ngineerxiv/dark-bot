"use strict"

const request = require("request");
const Game      = require("node-quest");
const Spell     = Game.Spell;
const AttackEffect = Game.AttackEffect;

function factoryAttackSpellFromObject(obj) {
    let power = obj.power;
    power = typeof power === "number" ? power : Infinity;
    return new Spell(obj.name, obj.mp, new AttackEffect(power));
}

class SpellRepositoryOnHttp {
    constructor(url) {
        this.url = url;
        this.spells = [];
    }

    update(callback, errorCallback) {
        request(this.url, (err, res, body) => {
            err && errorCallback(err);
            try {
                const json = JSON.parse(body);
                this.spells = json.spells.attack.map((obj) => factoryAttackSpellFromObject(obj));
            } catch (e) {
                errorCallback(e)
            }
        });
    };

    get() {
        return this.spells;
    }
}

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
