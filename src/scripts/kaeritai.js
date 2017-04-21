// Description:
//   misc
//
// Commands:
//   hubot poem - オサレポエム
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//   hubot goma - やればわかる
//   hubot isao - やればわかる
//

"use strict"


const uuid = require("node-uuid");

module.exports = (robot) => {
    robot.hear(/すごい/, (res) => {
        res.send(`https://pbs.twimg.com/media/C920YtzVwAAQZvX.jpg#${uuid.v4()}`);
    });

    robot.hear(/出勤/, (res) => {
        res.send(`https://pbs.twimg.com/media/C920YtzVwAAQZvX.jpg#${uuid.v4()}`);
    });

    robot.hear(/帰った/, (res) => {
        res.send(`https://pbs.twimg.com/media/C9I1iydVwAASPma.jpg#${uuid.v4()}`);
    });

    robot.hear(/遅刻/, (res) => {
        res.send(`https://pbs.twimg.com/media/C9a7ilTVYAIBE3Q.jpg#${uuid.v4()}`);
    });

    robot.hear(/おはよう/, (res) => {
        res.send(`https://pbs.twimg.com/media/C8mZoFoXoAMgt24.jpg#${uuid.v4()}`);
    });
}
