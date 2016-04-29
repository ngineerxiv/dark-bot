// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   cure {user} - cure
//   raise|ザオリク {user} - ふっかつ
//

"use strict"

const Cron = require("cron").CronJob;
const DarkQuest = require("node-quest");
const Game      = DarkQuest.Game;
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const Spell     = DarkQuest.Spell;
const AttackEffect = DarkQuest.AttackEffect;
const DarkGame  = require("../game/DarkGame.js");
const NegativeWords   = require("../game/NegativeWords.js");
const NegativeWordsRepository = require("../game/NegativeWordsRepository.js");

const spells    = [
    new Spell("アルテマ", 5, new AttackEffect(800)),
    new Spell("メラ", 5, new AttackEffect(20)),
    new Spell("ザケル", 5, new AttackEffect(50)),
    new Spell("異議あり", 5, new AttackEffect(200)),
    new Spell("黒棺", 5, new AttackEffect(Infinity))
];

const negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
const negativeWords   = new NegativeWords(negativeWordsRepository, console);
const MAX_HP          = 1000;
const HUBOT_NODE_QUEST_USERS_HP  = "HUBOT_NODE_QUEST_USERS_HP";

const toGameUser = function(users, savedUsers) {
    return Object.keys(users).map(function(id) {
        const user    = users[id];
        const eq      = new Equipment(new Weapon(30, 12, new HitRate(100)));
        const p       = new Parameter(20, 10);
        const hp      = (savedUsers && savedUsers[id] && !isNaN(savedUsers[id])) ? savedUsers[id] : MAX_HP;
        const st      = new Status(game, hp, MAX_HP, Infinity, Infinity);
        return new User(user.id, user.name, st, eq, p, spells);
    });
};
const game        = new Game();
const darkGame    = new DarkGame(game);
const shakai      = new User(0, "'社会'", game.defaultStatus(), new Equipment(new Weapon(30, 12, new HitRate(100))), game.defaultParameter());

new Cron("0 0 * * 1", function() {
    game.users.forEach(function(u) {
        u.fullCare(u);
    });
}, null, true, "Asia/Tokyo");

module.exports = function(robot) {

    darkGame.on("game-user-hp-changed", function(data) {
        const us = {};
        game.users.forEach(function(u) {
            us[u.id] = u.status.currentHp;
        });
        robot.brain.set(HUBOT_NODE_QUEST_USERS_HP, us);
    });

    robot.brain.once("loaded", (data) => {
        const savedUsers  = robot.brain.get(HUBOT_NODE_QUEST_USERS_HP) || {};
        const users       = robot.adapter.client ? toGameUser(robot.adapter.client.users, savedUsers) : [];
        game.setUsers(users);
    });

    robot.hear(/^attack (.+)/i, (res) => {
        darkGame.attack(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^cure (.+)/i, (res) => {
        darkGame.cure(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^ザオリク (.+)/i, (res) => {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^raise (.+)/i, (res) => {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^status (.+)/i, (res) => {
        darkGame.status(
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/.*/, (res) => {
        const target = game.findUser(res.message.user.name)
        if ( !target || target.isDead() ) {
            return;
        }

        const tokens  = (res.message.tokenized || []).map(function(t) {
            return t.basic_form;
        });
        darkGame.attack(
            shakai, 
            target,
            negativeWords.countNegativeWords(tokens)
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/(.+)/, (res) => {
        const messages = res.message.rawText.split(" ")
        if(messages.length < 2) {
            return;
        }

        const spellName = messages[0];
        const targets   = messages.splice(1).map(
            (name) => game.findUser(name)
        ).filter(
            (user) => user !== null
        );

        const actor = game.findUser(res.message.user.name);
        const spell = actor.findSpell(spellName.toString());

        if(!spell) {
            return;
        }

        if(targets.length === 0) {
            return res.send("しかし だれもいなかった・・・");
        }
        const targetBeforeHps = targets.map((u) => u.status.currentHp);
        const result    = actor.cast(spell, targets);
        if(!result) {
            return res.send("MPが足りない！")
        }
        res.send(`[ATTACK] ${actor.name} は ${spellName} をとなえた！`);
        targets.forEach((user, idx) => {
            const before = targetBeforeHps[idx]
            const after  = result[idx].currentHp;
            res.send(`${user.name}に ${(before - after)} のダメージ！ 残り: ${after} / ${user.status.maxHp}`)
            if(after === 0) {
                res.send(`[DEAD] ${user.name}はしんでしまった`)
            }
        });
    });
}
