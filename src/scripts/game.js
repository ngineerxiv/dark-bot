// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   status {user} - HP,MP,使える魔法の確認
//

"use strict"

const DarkGame  = require("../game/DarkGame.js");
const UserRepository  = require("../game/UserRepository.js");

module.exports = (robot) => {
    const darkGame = new DarkGame(new UserRepository(
                robot.brain, 
                robot.adapter.client ? robot.adapter.client.users : {}
                ));

    robot.brain.once("loaded", (data) => darkGame.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        darkGame.attackToUser(res.message.user.name, res.match[1], (m) => res.send(m));
    });

    robot.hear(/^status (.+)/i, (res) => {
        darkGame.statusOfUser(res.match[1], (m) => res.send(m))
    });

    robot.hear(/^神父 (.+)/, (res) => {
        darkGame.prayToPriest(res.message.user.name, (m) => res.send(m));
    });

    robot.hear(/.*/, (res) => {
        darkGame.takePainByWorld(
                res.message.user.name, 
                (res.message.tokenized || []).map((t) => t.basic_form),
                (m) => res.send(m)
                )
    });

    robot.hear(/(.+)/, (res) => {
        const messages = (res.message.rawText || "").split(" ");
        (messages.length >= 2) && darkGame.castToUser(
                res.message.user.name,
                messages[1],
                messages[0],
                (m) => res.send(m)
                );
    });
}
