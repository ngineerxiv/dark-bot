// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   status {user} - HP,MP,使える魔法の確認
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
        darkGame.attackToUser(res.message.user.name.replace(/@/g, ""), res.match[1].replace(/@/g, ""), (m) => res.send(m));
    });

    robot.hear(/^status (.+)/i, (res) => {
        darkGame.statusOfUser(res.match[1].replace(/@/g, ""), (m) => res.send(m))
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
                messages[1].replace(/@/g, ""),
                messages[0],
                (m) => res.send(m)
                );
    });
}
