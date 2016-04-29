// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   cure {user} - cure
//   raise|ザオリク {user} - ふっかつ
//

"use strict"

const Cron      = require("cron").CronJob;
const DarkQuest = require("node-quest");
const Game      = DarkQuest.Game;
const Equipment = DarkQuest.Equipment;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const HitRate   = DarkQuest.HitRate;
const DarkGame  = require("../game/DarkGame.js");
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const NegativeWordsRepository = require("../game/NegativeWordsRepository.js");
const negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
const NegativeWords   = require("../game/NegativeWords.js");
const negativeWords   = new NegativeWords(negativeWordsRepository, console);
const spellRepository = new SpellRepository();
const game        = new Game();
const darkGame    = new DarkGame(game);
const shakai      = new User(0, "'社会'", game.defaultStatus(), new Equipment(new Weapon(30, 12, new HitRate(100))), game.defaultParameter());
const lang      = require("../game/lang/Ja.js");

new Cron("0 0 * * 1", () => {
    game.users.forEach((u) => {
        u.fullCare(u);
    });
}, null, true, "Asia/Tokyo");

module.exports = (robot) => {

    const userRepository  = new UserRepository(robot, spellRepository);
    darkGame.on("game-user-hp-changed", (data) => {
        return userRepository.save(game.users);
    });

    robot.brain.once("loaded", (data) => {
        game.setUsers(userRepository.get());
    });

    robot.hear(/^attack (.+)/i, (res) => {
        darkGame.attack(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach((m) => {
            res.send(m);
        });
    });

    robot.hear(/^cure (.+)/i, (res) => {
        darkGame.cure(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach((m) => {
            res.send(m);
        });
    });

    robot.hear(/^ザオリク (.+)/i, (res) => {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach((m) => {
            res.send(m);
        });
    });

    robot.hear(/^raise (.+)/i, (res) => {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach((m) => {
            res.send(m);
        });
    });

    robot.hear(/^status (.+)/i, (res) => {
        const target    = game.findUser(res.match[1])
        const message   = target ?
            lang.status.default(target) :
            lang.actor.notarget(actor);
        res.send(message)
    });

    robot.hear(/.*/, (res) => {
        const target = game.findUser(res.message.user.name)
        if ( !target || target.isDead() ) {
            return;
        }

        const tokens  = (res.message.tokenized || []).map((t) => {
            return t.basic_form;
        });
        const count   = negativeWords.countNegativeWords(tokens);
        if(count <= 0) {
            return
        }
        darkGame.attack(
            shakai, 
            target,
            count
        ).messages.forEach((m) => {
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
            return res.send(lang.actor.notarget(actor));
        }
        const targetBeforeHps = targets.map((u) => u.status.currentHp);
        const result    = actor.cast(spell, targets);
        if(!result) {
            return res.send(lang.actor.nomagicpoint(actor));
        }
        res.send(lang.spell.cast(actor, spellName));
        targets.forEach((user, idx) => {
            const before = targetBeforeHps[idx]
            const after  = result[idx].currentHp;
            res.send(lang.target.damaged(user, before, after))
            if(after === 0) {
                res.send(lang.attack.dead(user))
            }
        });
    });
}
