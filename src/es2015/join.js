// Description:
//   join all channels
//

var slackAPI = require('slackbotapi');
var token = process.env.WEB_SLACK_TOKEN;
var slack = new slackAPI({
    'token': token,
    'autoReconnect': true
});


module.exports = (robot => {
    robot.respond(/join all/i, res => {
        let bot = slackAPI.getUser(robot.name);
        slack.reqAPI("channels.list",{
            exclude_archived: 1
        }, (listResponse) => {
            if(!listResponse.ok) {
                robot.logger.error(`something ocuured ${listResponse}`);
                return;
            }
            listResponse.channels
                .filter((ch) => (ch.substring(0, 1) === 'C') )
                .forEach((ch) => {
                    slack.reqAPI("channels.invite", {
                        channel: ch.id,
                        user: bot.id
                    }, (inviteResponse) => {
                        if( inviteResponse.ok ) {
                            res.send(`joined #${ch.name}`)
                        } else {
                            robot.logger.error(`failed to join to ${ch}`);
                            robot.logger.error(inviteResponse);
                        }
                    });
                });
        });
    })
})
