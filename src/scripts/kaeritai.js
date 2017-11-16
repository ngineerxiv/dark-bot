// Description:
//   misc
//
// Commands:
//   色々反応する - すごい, 出勤, 帰った, 遅刻, おはよう
//

"use strict"


const Url = require('../lib/Url');

module.exports = (robot) => {
    robot.hear(/^すごい$/, (res) => {
        res.send(Url.apply('https://pbs.twimg.com/media/C920YtzVwAAQZvX.jpg', '#'));
    });

    robot.hear(/^出勤$/, (res) => {
        (new Date()).getDay() === 1 ?
            res.send(Url.apply('https://pbs.twimg.com/media/C9AJZaFUAAANxq9.jpg', '#'):
            res.send(Url.apply('https://pbs.twimg.com/media/C8hNeWlV0AI6F90.jpg', '#');
    });

    robot.hear(/^帰った$/, (res) => {
        res.send(Url.apply('https://pbs.twimg.com/media/C9I1iydVwAASPma.jpg', '#'));
    });

    robot.hear(/遅刻/, (res) => {
        res.send(Url.apply('https://pbs.twimg.com/media/C8wtqyoVYAAx5br.jpg', '#'));
    });

    robot.hear(/おはよう/, (res) => {
        res.send(Url.apply('https://pbs.twimg.com/media/C8mZoFoXoAMgt24.jpg', '#'));
    });

    robot.hear(/^帰る$/, (res) => {
        res.send(Url.apply('https://pbs.twimg.com/media/C9HxdfrVYAA-Dth.jpg', '#'));
    });
}
