// Description:
//   misc
//
// Commands:
//   色々反応する - すごい, 出勤, 帰った, 遅刻, おはよう
//

"use strict"


const uuid = require("node-uuid");

module.exports = (robot) => {
    robot.hear(/すごい/, (res) => {
        res.send(`https://pbs.twimg.com/media/C920YtzVwAAQZvX.jpg#${uuid.v4()}`);
    });

    robot.hear(/出勤/, (res) => {
        (new Date()).getDay() === 1 ?
            res.send(`https://pbs.twimg.com/media/C9AJZaFUAAANxq9.jpg#${uuid.v4()}`):
            res.send(`https://pbs.twimg.com/media/C8hNeWlV0AI6F90.jpg#${uuid.v4()}`);
    });

    robot.hear(/帰った/, (res) => {
        res.send(`https://pbs.twimg.com/media/C9I1iydVwAASPma.jpg#${uuid.v4()}`);
    });

    robot.hear(/遅刻/, (res) => {
        res.send(`https://pbs.twimg.com/media/C8wtqyoVYAAx5br.jpg#${uuid.v4()}`);
    });

    robot.hear(/おはよう/, (res) => {
        res.send(`https://pbs.twimg.com/media/C8mZoFoXoAMgt24.jpg#${uuid.v4()}`);
    });
}
