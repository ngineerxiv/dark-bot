// Description:
//   新規参加者用挨拶スクリプト
//

"use strict"

const hello   = require('../../settings/hello.json')
const message = hello.message.join("\n")

module.exports = (robot => {
    robot.respond(/helloworld/i, res => {
        res.send(message)
    })
})
