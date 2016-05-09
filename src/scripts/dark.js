// Description:
//   dark bot
//
// Commands:
//   hubot poem - オサレポエム
//   hubot rule - ngineerxivのSlack内ルール
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//

"use strict"

const uuid = require("node-uuid");
const json = require('../../settings/poems.json')
const rules = [
    "1. 採用活動はPrivate Messageで行わないこと (基本的には #job で行って欲しい) \n\tもしDMなどであった場合、 #general や #yami で晒すか 管理者の誰か @arata とかにPrivate Messageしましょう。 \n\t※ #job で決まった何かについて連絡する場合はこの限りではないです。",
    "その他\n\tそれ以外は許可いりません。自らの責任で適当にやってみてから考えましょう。\n\t例) 絵文字の追加・チャンネル作成・野良イベントへの友人のコミュニティ外からの参加",
    "\nruled at 2016/05/05"
];
module.exports = (robot) => {

    robot.respond(/poem$/i, (res) => {
        res.send(res.random(json.poem))
    })

    robot.respond(/rule$/i, (res) => {
        res.send(rules.join("\n"));
    });

    robot.hear(/なん(\.|。|・)*だと(\.|。|・)*$/i, (res) => {
        res.send(`http://yamiga.waka.ru.com/images/nandato.png?cb=${uuid.v4()}`);
    })

    robot.respond(/炎上 (.+) (.+)/i, (res) => {
        const text1 = encodeURIComponent(res.match[1])
        const text2 = encodeURIComponent(res.match[2])
        res.send(`https://enjo-generator.herokuapp.com/api/create-enjo?text1=${text1}&text2=${text2}`);
    })
}
