// Description:
//   新規参加者用挨拶スクリプト
//

var slackAPI = require('slackbotapi');
var token = process.env.WEB_SLACK_TOKEN;
var slack = new slackAPI({
    'token': token,
    'logging': true,
    'autoReconnect': true
});


module.exports = (robot => {
    robot.respond(/join all/i, res => {

        res.send('joined all channels')
    })
})
