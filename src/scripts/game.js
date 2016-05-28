// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   cure {user} - cure
//   raise {user} - ふっかつ
//

"use strict"

const Cron      = require("cron").CronJob;
const NodeQuest = require("node-quest");
const UserStates  = NodeQuest.UserStates;
const Game      = NodeQuest.Game;
const DarkGame  = require("../game/DarkGame.js");
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const NegativeWordsRepository = require("../game/NegativeWordsRepository.js");
const MonsterRepository = require("../game/MonsterRepository.js");
const NegativeWords   = require("../game/NegativeWords.js");

const negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
const negativeWords   = new NegativeWords(negativeWordsRepository, console);
const spellRepository = new SpellRepository();
const monsterRepository = new MonsterRepository();
const game      = new Game();
const darkGame  = new DarkGame(game);
const lang      = require("../game/lang/Ja.js");
const hubotSlack = require("hubot-slack");
const SlackTextMessage = hubotSlack.SlackTextMessage;
const isSlackTextMessage = (message) => (message instanceof SlackTextMessage);

new Cron("0 0 * * 1", () => {
    game.users.forEach((u) => {
        u.cured(Infinity);
    });
}, null, true, "Asia/Tokyo");

new Cron("0 0 * * *", () => {
    game.users.forEach((u) => {
        u.magicPoint.changed(Infinity);
    });
}, null, true, "Asia/Tokyo");


module.exports = (robot) => {

    const userRepository  = new UserRepository(robot.brain, robot.adapter.client ? robot.adapter.client.users : {});
    const shakai = monsterRepository.getByName("社会");

    robot.brain.once("loaded", (data) => {
        const users = userRepository.get().concat(monsterRepository.get());
        users.forEach((u) => {
            u.spells = spellRepository.get();
            u.hitPoint.on("changed", (data) => {
                userRepository.save(game.users);
            });
            u.magicPoint.on("changed", (data) => {
                userRepository.save(game.users);
            });
        });
        game.setUsers(users);
    });

    robot.hear(/^attack (.+)/i, (res) => {
        const actor = game.findUser(res.message.user.name);
        if (!actor) {
            return
        }
        const target = game.findUser(res.match[1]);
        if (!target) {
            return res.send(lang.actor.notarget(actor));
        }
        const result = actor.attack(target)
        switch (result) {
            case UserStates.TargetDead:
                return res.send(lang.target.dead(target));
            case UserStates.ActorDead:
                return res.send(lang.actor.dead(target));
        }
        const hit   = result.attack.hit;
        const point = result.attack.value;
        hit ?
            res.send(lang.attack.default(actor, target, point)):
            res.send(lang.attack.miss(target));

    });

    robot.hear(/^status (.+)/i, (res) => {
        const target    = game.findUser(res.match[1])
        const message   = target ?
            lang.status.default(target) :
            lang.actor.notarget(target);
        res.send(message)
    });

    robot.hear(/spells/, (res) => {
        const actor = game.findUser(res.message.user.name);
        res.send(`使える魔法: ${actor.spells.map((s) => s.name).join(",")}`);
    });

    robot.hear(/.*/, (res) => {
        if ( shakai === null ) {
            return;
        }
        shakai.isDead() ? shakai.cured(Infinity): null;
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
        if(!isSlackTextMessage(res.message)) {
            return;
        }
        const messages = res.message.rawText.split(" ")
        if(messages.length < 2) {
            return;
        }

        const spellName = messages[0];
        const actor     = game.findUser(res.message.user.name);
        const target    = messages.splice(1).map(
            (name) => game.findUser(name)
        ).filter(
            (user) => user !== null
        ).pop();
        if (actor.spells.filter((s) => s.name === spellName).length <= 0) {
            return;
        } else if (!target) {
            return res.send(lang.actor.notarget(actor));
        }

        const result    = actor.cast(spellName, target);
        switch (result) {
            case UserStates.NoTargetSpell:
                return;
            case UserStates.NotEnoughMagicPoint:
                return res.send(lang.actor.nomagicpoint(actor));
            case UserStates.TargetDead:
                return res.send(lang.target.dead(target));
            case UserStates.ActorDead:
                return res.send(lang.actor.dead(actor));
        }
        res.send(lang.spell.cast(actor, spellName));
        if( result.effects.attack !== null ) {
            res.send(lang.target.damaged(result.target, result.effects.attack));
            result.target.isDead() && res.send(lang.attack.dead(result.target));
        }
        const statusEffectResult = result.effects.status.filter((e) => e.effective)
        if(result.effects.status.length > 0) {
            (statusEffectResult.length > 0) ?
                res.send(lang.raise.default(result.target)): 
                res.send(lang.actor.noeffect(result.actor));
        } else if( result.effects.cure !== null) {
            res.send(lang.cure.default(result.target));
        }
    });
}
