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
const UserRepository  = require("../game/UserRepository.js");
const BitnessRepository =require("../game/BitnessRepository.js");

module.exports = (robot) => {
    const bitnessRepository = new BitnessRepository(robot.brain);
    const userRepository    = new UserRepository(robot);
    const darkGame = new DarkGame(
        userRepository,
        bitnessRepository
    );

    const senderName = (res) => {
        if (res.message.user.name === undefined) {
            return null;
        }
        return res.message.user.name;
    }

    robot.brain.once("loaded", (data) => darkGame.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.attackToUser(n.replace(/@/g, ""), res.match[1].trim().replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/^status (.+)/i, (res) => {
        darkGame.statusOfUser(res.match[1].trim().replace(/@/g, ""), (m) => res.send(m))
    });

    robot.hear(/^pray$/i, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.prayToPriest(n.replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/^神父 (.+)/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.prayToPriest(n.replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/.*/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.takePainByWorld(
                n.replace(/@/g, ""),
                (res.message.tokenized || []),
                (m) => res.send(m)
                )
    });

    robot.hear(/(.+)/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        const messages = (res.message.text || "").split(" ");
        (messages.length >= 2) && darkGame.castToUser(
                n.replace(/@/g, ""),
                messages[1].trim().replace(/@/g, ""),
                messages[0],
                (m) => res.send(m)
                );
    });

    robot.hear(/^job list/, (res) => {
        darkGame.listJobs((m) => res.send(m));
    });

    robot.hear(/^job change (.+)$/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.changeJob(
                n.replace(/@/g, ""),
                res.match[1].trim().replace(/@/g, ""),
                (m) => res.send(m)
                );
    })

    robot.hear(/^給料日$/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }

        darkGame.payDay(
                n.replace(/@/g, ""),
                (m) => res.send(m)
                );
    })

    robot.hear(/^おちんぎん$/, (res) => {
        const n = senderName(res)
        if (n === null)  {
            return;
        }
        darkGame.payDay(
                n.replace(/@/g, ""),
                (m) => res.send(m)
                );
    })
}
