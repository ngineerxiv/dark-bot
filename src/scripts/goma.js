// Description:
//   コスプレ
//
// Commands:
//   hubot goma - 
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//

"use strict"

const benzen = "```\n　　　CH \n　　　／＼ \n　　／　＼＼ \nHC／　　　＼＼CH \n ｜｜C6H6　　｜ \n ｜｜　´д｀｜ \nHC＼　　　／／CH \n　　＼　／／ \n　　　＼／ \n　　　CH\n```";
const uuid = require("node-uuid");
const gomas = [
    () => `http://yamiga.waka.ru.com/images/goma/01.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/02.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/03.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/04.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/05.jpg?cb=${uuid.v4()}`,
    () => benzen
];
module.exports = (robot) => {
    robot.respond(/goma$/i, (res) => {
        res.send((res.random(gomas))())
    })
}
