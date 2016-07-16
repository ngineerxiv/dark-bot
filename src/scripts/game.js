// Description:
//   遊ぶ
// Commands:
//   hubot game help - RPG機能の説明が出る
//   game attack {user} - {user}への攻撃 '@' と ' ' は無視される e.g. attack @dark, attack dark
//   game status {user} - {user}のHP, MP, 使用可能な魔法, 社会から受けたつらさを確認する
//   game pray - 祈る。死んでいる時に祈りが届けば復活できる。(社会から受けたつらさを消費する)
//   game 神父 {user} - prayと同等の効果
//   game {spell} {user} - {spell}を唱えて{user}にかける。利用可能な{spell}はstatusで確認する
//   game job list - 転職可能なjob一覧が出る
//   game job change {job} - 転職する。(ただし社会から受けたつらさを消費する)
//

"use strict"

const DarkGame  = require("../game/DarkGame.js");
const UserRepository  = require("../game/UserRepository.js");
const BitnessRepository =require("../game/BitnessRepository.js");

module.exports = (robot) => {
    const darkGame = new DarkGame(
            new UserRepository(
                robot.brain, 
                robot.adapter.client ? robot.adapter.client.users : {}
                ),
            new BitnessRepository(robot.brain)
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

    robot.respond(/game help$/, (res) => {
        const gameHelps = robot.commands
            .sort()
            .filter((cmd) => /game/.test(cmd))
            .filter((cmd) => !/help/.test(cmd))
            .map((cmd) => cmd.replace(/game/, ""))
            .map((cmd) => cmd.trim())
            ;
        res.send(gameHelps.join("\n"));
    });
}
