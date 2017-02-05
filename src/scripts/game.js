// Description:
//   遊ぶ
// Commands:
//   attack {user} - {user}への攻撃 '@' と ' ' は無視される e.g. attack @dark, attack dark
//   status {user} - {user}のHP, MP, 使用可能な魔法, 社会から受けたつらさを確認する
//   pray - 祈る。死んでいる時に祈りが届けば復活できる。(社会から受けたつらさを消費する)
//   神父 {user} - prayと同等の効果
//   {spell} {user} - {spell}を唱えて{user}にかける。利用可能な{spell}はstatusで確認する
//   job list - 転職可能なjob一覧が出る
//   job change {job} - 転職する。(ただし社会から受けたつらさを消費する)
//

"use strict"

const DarkGame  = require("../game/DarkGame.js");
const SlackUserRepository = require("../game/SlackUserRepository");
const UserRepository  = require("../game/UserRepositoryOnHubot.js");
const BitnessRepository =require("../game/BitnessRepository.js");
const SlackAPI = require('slackbotapi');

const init = function(token) {
    if ( token === undefined ) {
        return new Error(`WEB_SLACK_TOKEN cannot be empty! value: undefined`);
    }
    try {
        return new SlackAPI({
            'token': token,
            'logging': false,
            'autoReconnect': true
        });
    } catch (e) {
        return e;
    }
};
module.exports = (robot) => {
    const slackApi = init(process.env.WEB_SLACK_TOKEN);

    class TargetManagerOnSlackApi {
        constructor(slackApi) {
            this.slackApi = slackApi;
            this.targetChannel = null;
        }

        init(callback) {
            if (this.targetChannel) {
                callback();
                return;
            }
            this.slackApi.reqAPI("channels.list", {}, (res) => {
                this.targetChannel = res.channels.filter((c) => c.name === "prison").pop();
                callback();
            });
        }

        get(callback) {
            this.init(() => {
                this.slackApi.reqAPI("channels.info", {
                    channel: this.targetChannel.id
                }, (res) => {
                    callback(res.channel.members);
                });
            });
        }
    }
    const targetManager = new TargetManagerOnSlackApi(slackApi);


    const bitnessRepository = new BitnessRepository(robot.brain);
    const userRepository    = new UserRepository(robot);
    const slackUserRepository = new SlackUserRepository(robot.adapter);
    const darkGame = new DarkGame(
        slackUserRepository,
        userRepository,
        bitnessRepository
    );

    robot.brain.once("loaded", (data) => darkGame.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        darkGame.attackToUser(res.message.user.name.replace(/@/g, ""), res.match[1].trim().replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/^status (.+)/i, (res) => {
        darkGame.statusOfUser(res.match[1].trim().replace(/@/g, ""), (m) => res.send(m))
    });

    robot.hear(/^pray$/i, (res) => {
        darkGame.prayToPriest(res.message.user.name.replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/^神父 (.+)/, (res) => {
        darkGame.prayToPriest(res.message.user.name.replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/.*/, (res) => {
        darkGame.takePainByWorld(
                res.message.user.name.replace(/@/g, ""), 
                (res.message.tokenized || []),
                (m) => res.send(m)
                )
    });

    robot.hear(/(.+)/, (res) => {
        const messages = (res.message.text || "").split(" ");
        (messages.length >= 2) && darkGame.castToUser(
                res.message.user.name.replace(/@/g, ""),
                messages[1].trim().replace(/@/g, ""),
                messages[0],
                (m) => res.send(m)
                );
    });

    robot.hear(/^job list/, (res) => {
        darkGame.listJobs((m) => res.send(m));
    });

    robot.hear(/^job change (.+)$/, (res) => {
        darkGame.changeJob(
                res.message.user.name.replace(/@/g, ""), 
                res.match[1].trim().replace(/@/g, ""), 
                (m) => res.send(m)
                );
    })

    robot.hear(/^給料日$/, (res) => {
        darkGame.payDay(
                res.message.user.name.replace(/@/g, ""), 
                (m) => res.send(m)
                );
    })

    robot.hear(/^おちんぎん$/, (res) => {
        darkGame.payDay(
                res.message.user.name.replace(/@/g, ""), 
                (m) => res.send(m)
                );
    })

    robot.hear(/^summon$/, (res) => {
        darkGame.summon(targetManager, (m) => res.send(m));
    });


    robot.router.get("/game/api/v1/users", (req, res) => {
        const allUsers = darkGame.userManager.getAllUsers();
        const users = allUsers.map((user) => {
            const u = Object.assign({}, user);
            u.spells = user.getLearnedSpells();
            u.bitness = bitnessRepository.get(u.id) || 0;
            return u;
        });
        res.end(JSON.stringify(users, (k, v) => {
            if ( v === Infinity ) {
                return "Infinity";
            }
            return v;
        }));
    });
}
