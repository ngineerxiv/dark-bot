// Description:
//   今日も一日頑張るぞい
// Commands:
//   hubot zoi - がんばるぞい
//   hubot ぞい - がんばるぞい
//

"use strict"

const uuid = require("node-uuid");

module.exports = (robot => {
    const urataku = 'U034TCZKE';
    const targets = [1,1,1,1,1,1,1,1,1,1,,2,2,3];
    const zoi = (res) => {
        const filtered = targets;
        try {
            if(res.message.user.id === urataku) {
                filtered = filtered.filter(elm => elm !== 1);
            }
        } catch (e) {
            robot.logger.error(e);
        }
        const selected = res.random(filtered);
        res.send(`http://yamiga.waka.ru.com/images/zoi${selected}.jpg?cb=${uuid.v4()}`);
    };

    robot.respond(/zoi/i, res => {
        zoi(res);
    })

    robot.respond(/ぞい/i, res => {
        zoi(res);
    })


    const zoi1 = new RegExp(`^[^${robot.name}]*頑張るぞい$`, "i");
    const zoi2 = new RegExp(`^[^${robot.name}]*がんばるぞい$`, "i");
    robot.hear(zoi1, res => zoi(res));
    robot.hear(zoi2, res => zoi(res));
})
