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
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const MonsterRepository = require("../game/MonsterRepository.js");
const UserLoader = require("../game/UserLoader.js");
const Battle    = require("../game/Battle.js");
const game      = new NodeQuest.Game();
const lang      = require("../game/lang/Ja.js");
const SlackTextMessage = require("hubot-slack").SlackTextMessage;
const negativeWords   = require("../game/NegativeWords.js").factory();
function isSlackTextMessage(message) {
    return message instanceof SlackTextMessage;
}

new Cron("0 0 * * 1", () => {
    game.users.forEach((u) => {
        u.cured(Infinity);
    });
}, null, true, "Asia/Tokyo");

new Cron("0 0 * * *", () => {
    game.users.forEach((u) => {
        u.magicPoint.change(Infinity);
    });
}, null, true, "Asia/Tokyo");


module.exports = (robot) => {

    const userRepository  = new UserRepository(robot.brain, robot.adapter.client ? robot.adapter.client.users : {});
    const monsterRepository = new MonsterRepository();
    const userLoader = new UserLoader(game, userRepository, monsterRepository, new SpellRepository());
    const battle = new Battle(game, lang);

    robot.brain.once("loaded", (data) => userLoader.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        const actor = game.findUser(res.message.user.name);
        if (!actor) {
            return
        }
        const target = game.findUser(res.match[1]);
        battle.attack(actor, target, (m) => res.send(m));
    });

    robot.hear(/^status (.+)/i, (res) => battle.status(game.findUser(res.match[1]), (m) => res.send(m)));

    robot.hear(/^神父 (.+)/, (res) => {
        const priest = monsterRepository.getByName("神父");
        const target = game.findUser(res.message.user.name);
        battle.cast(priest, target, "レイズ", (m) => res.send(m));
    });

    robot.hear(/.*/, (res) => {
        const shakai = monsterRepository.getByName("社会");
        const target = game.findUser(res.message.user.name)
        if ( !target || target.isDead() ) {
            return;
        }
        const count   = negativeWords.countNegativeWords((res.message.tokenized || []).map((t) => t.basic_form));
        if(count <= 0) {
            return
        }
        battle.multipleAttack(shakai, target, count, (m) => res.send(m));
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
        battle.cast(actor, target, spellName, (m) => res.send(m));
    });
}
