// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   cure {user} - cure
//   raise {user} - ふっかつ
//

"use strict"

const NodeQuest = require("node-quest");
const lang      = require("../game/lang/Ja.js");
const DarkGame  = require("../game/DarkGame.js");
const SpellRepository       = require("../game/SpellRepository.js");
const HitPointRepository    = require("../game/user/HitPointRepository.js");
const UserRepository        = require("../game/user/UserRepository.js");
const NegativeWordsRepository   = require("../game/NegativeWordsRepository.js");
const MonsterRepository         = require("../game/MonsterRepository.js");
const NegativeWords             = require("../game/NegativeWords.js");

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

module.exports = (robot) => {
    const UserExceptions  = NodeQuest.UserExceptions;
    const monsterRepository = new MonsterRepository();
    const game      = new NodeQuest.Game();
    const darkGame  = new DarkGame(
        game,
        new UserRepository(robot.adapter),
        new HitPointRepository(robot.brain),
        new MonsterRepository(),
        new SpellRepository()
    );
    const shakai    = monsterRepository.getByName("社会");

    robot.brain.once("loaded", (data) => darkGame.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        darkGame.attack(
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
        shakai.isDead() && shakai.cured(Infinity);
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
        if(result instanceof UserExceptions.NoTargetSpellException) {
            return;
        } else if (result instanceof UserExceptions.NoEnoughMagicPointException) {
            return res.send(lang.actor.nomagicpoint(actor));
        } else if (result instanceof UserExceptions.TargetDeadException) {
            return res.send(lang.target.dead(target));
        } else if (result instanceof Error) {
            // HACK UserExceptions.TargetDeadExceptionとして認識してくれなかったのでゴリ押し
            if (/(.*) is dead/.test(result.toString())) {
                return res.send(lang.target.dead(target));
            }
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
