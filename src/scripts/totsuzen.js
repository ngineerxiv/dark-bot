// Description:
//   
//
// Commands:
//   hubot 突然の {text} - 突然
//

"use strict"
const eastasianwidth = require('eastasianwidth');
const strpad = (str, count) => new Array(count + 1).join(str)

module.exports = (robot) => {
    robot.respond(/突然の (.+)$/i, (msg) => {
        const message = msg.match[1].replace(/^\s+|\s+$/g, '')
        const length = Math.floor(eastasianwidth.length(message) / 2)
        const suddendeath = [
            `＿${strpad('人', length + 2)}＿`,
            `＞　${message}　＜`,
            `￣Y${strpad('^Y', length)}￣`
        ];
        msg.send(suddendeath.join("\n"))
    })
}
