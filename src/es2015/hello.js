// Description:
//   新規参加者用挨拶スクリプト
//

let hello   = require('../settings/hello.json')
let message = hello.message.join("\n")

module.exports = (robot => {
    robot.respond(/helloworld/i, res => {
        res.send(message)
    })
})
