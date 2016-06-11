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
const SpellRepository = require("../game/SpellRepository.js");
const UserRepository  = require("../game/UserRepository.js");
const NegativeWordsRepository = require("../game/NegativeWordsRepository.js");
const MonsterRepository = require("../game/MonsterRepository.js");
const NegativeWords   = require("../game/NegativeWords.js");
const UserLoader = require("../game/UserLoader.js");

const negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
const negativeWords   = new NegativeWords(negativeWordsRepository, console);
const spellRepository = new SpellRepository();
const monsterRepository = new MonsterRepository();
const game      = new Game();
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
        u.magicPoint.change(Infinity);
    });
}, null, true, "Asia/Tokyo");


module.exports = (robot) => {

    const userRepository  = new UserRepository(robot.brain, robot.adapter.client ? robot.adapter.client.users : {});
    const userLoader = new UserLoader(game, userRepository, monsterRepository, spellRepository);

    robot.brain.once("loaded", (data) => userLoader.loadUsers());

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
                return res.send(lang.actor.dead(actor));
        }
        const hit   = result.attack.hit;
        const point = result.attack.value;
        hit ?
            res.send(lang.attack.default(actor, target, point)):
            res.send(lang.attack.miss(target));

        target.isDead() && res.send(lang.attack.dead(target));
    });

    robot.hear(/^status (.+)/i, (res) => {
        const target    = game.findUser(res.match[1])
        const message   = target ?
            lang.status.default(target) :
            lang.actor.notarget(target);
        res.send(message)
        target && res.send(`使える魔法: ${target.spells.map((s) => s.name).join(",")}`);
    });

    robot.hear(/^神父 (.+)/, (res) => {
        const priest = monsterRepository.getByName("神父");
        const target = game.findUser(res.message.user.name);
        if ( !target.isDead() ) {
            return;
        }
        const result    = priest.cast("レイズ" , target);
        switch (result) {
            case UserStates.NoTargetSpell:
                return;
            case UserStates.NotEnoughMagicPoint:
                return res.send(lang.actor.nomagicpoint(priest));
            case UserStates.ActorDead:
                return res.send(lang.actor.dead(priest));
        }
        res.send(lang.spell.cast(priest, "レイズ"));

        const statusEffectResult = result.effects.status.filter((e) => e.effective);
        if(result.effects.status.length > 0) {
            (statusEffectResult.length > 0) ?
                res.send(lang.raise.default(result.target)): 
                res.send(lang.actor.noeffect(result.actor));
        }
    });

    robot.hear(/.*/, (res) => {
        const shakai = monsterRepository.getByName("社会");
        if ( shakai === null ) {
            return;
        }
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

        const results           = Array(count).fill(1).map((i) => shakai.attack(target))
        const attackedResults   = results.filter((r) => typeof r !== 'symbol').filter((r) => r.attack.hit);
        const point             = attackedResults.reduce((pre, cur) => pre + cur.attack.value, 0);
        if( attackedResults.length > 0 ) {
            count === 1 ?
                res.send(lang.attack.default(shakai, target, point)):
                res.send(lang.attack.multiple(shakai, target, point, count));
            target.isDead() && res.send(lang.attack.dead(target));
        } else {
            res.send(lang.attack.miss(target));
        }
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
