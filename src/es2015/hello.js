// Description:
//   新規参加者用挨拶スクリプト
//

hello   = require('../settings/hello.json')
message = hello.message.join("\n")

module.exports = (robot) => {
  robot.respond(/helloworld/i, (res) => res.send(message))
}
