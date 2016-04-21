// Description:
//   は俺の嫁.com
//
// Commands:
//   hubot 小路綾 - 小路綾.は俺の嫁.com
//   hubot 小野寺小咲 - 小野寺小咲.は俺の嫁.com
//   hubot 筒隠月子 - 筒隠月子.は俺の嫁.com
//   hubot 流子|御船流子 - 御船流子.は俺の嫁.com
//   hubot エリオ|藤和エリオ - 藤和エリオ.は俺の嫁.com

const punycode = require('punycode')
const random = (max) => {
    rand = 1 + Math.floor(Math.random() * max)
    return ('00' + rand).slice(-3)
}

const orenoyome = (msg, yome, logger) => (msg.http("http://は俺の嫁.com/resource.json").get()) ((err, res, body) => {
    if (err) {
        logger.error(err);
        msg.send(err);
    } else {
        const resources = JSON.parse(body)
        const max       = resources[yome]
        const encoded   = `xn--${punycode.encode(yome)}`
        const domain    = `${encoded}.xn--u9jb933vm9i.com`
        const url       = `http://${ domain }/images/${ random(max) }.jpg`
        msg.send(url)
    }
})
module.exports = (robot) => {
  robot.respond (/小路綾/i, (msg) => orenoyome(msg, '小路綾', robot.logger))

  robot.respond (/小野寺小咲/i, (msg) => orenoyome(msg, '小野寺小咲', robot.logger))

  robot.respond (/筒隠月子/i, (msg) => orenoyome(msg, '筒隠月子', robot.logger))

  robot.respond (/(流子|御船流子)/i, (msg) => orenoyome(msg, '御船流子', robot.logger))

  robot.respond (/(エリオ|藤和エリオ)/i, (msg) => orenoyome(msg, '藤和エリオ', robot.logger))

  robot.respond (/(orenoyome|俺の嫁) list/i, (msg) => {
    (msg.http("http://は俺の嫁.com/resource.json").get()) ( (err, res, body) => {
        if (err) {
            robot.logger.error(err);
            msg.send(err)
        } else {
            const resources = JSON.parse(body)
            helps = (Object.keys(resources)).map((name) => "dark " + name)
            msg.send(helps.join("\n"))
        }
    })
  })
}
