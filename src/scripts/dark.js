// Description:
//   dark bot
//
// Commands:
//   hubot poem - オサレポエム
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//

"use strict"

const uuid = require("node-uuid");
const json = require('../../settings/poems.json')
const Levenshtein = require("levenshtein");
module.exports = (robot) => {

    robot.respond(/poem$/i, (res) => {
        res.send(res.random(json.poem))
    })

    robot.hear(/なん(\.|。|・)*だと(\.|。|・)*$/i, (res) => {
        res.send(`http://yamiga.waka.ru.com/images/nandato.png?cb=${uuid.v4()}`);
    })

    robot.respond(/炎上 (.+) (.+)/i, (res) => {
        const text1 = encodeURIComponent(res.match[1])
        const text2 = encodeURIComponent(res.match[2])
        res.send(`https://enjo-generator.herokuapp.com/api/create-enjo?text1=#{text$}&text2=${text2}`);
    })

    robot.respond(/距離 (.+) (.+)/i, (res) => {
        const l = new Levenshtein(res.match[1],res.match[2]);
        res.send(`距離: ${l.distance}`);
    });
}
