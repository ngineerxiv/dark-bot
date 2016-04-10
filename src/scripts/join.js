// Description:
//   join all channels
//
// Notes:
//   #timeline 用
//
// Commands:
//   hubot join all - 存在する全てのpublicチャンネルに参加する
//

"use strict"

const slackAPI = require('slackbotapi');

const init = function(token) {
    if ( token === undefined ) {
        return new Error(`WEB_SLACK_TOKEN cannot be empty! value: undefined`);
    }
    try {
        return new slackAPI({
            'token': token,
            'logging': false,
            'autoReconnect': true
        });
    } catch (e) {
        return e;
    }
};

module.exports = (robot => {
    const slack = init(process.env.WEB_SLACK_TOKEN);

    robot.respond(/join all/i, res => {
        if (slack instanceof Error) {
            robot.logger.error(slack);
            robot.emit("error", slack);
            return res.send("Something ocuured to slack api client!");
        }

        const bot = slack.getUser(robot.name);
        slack.reqAPI("channels.list",{
            exclude_archived: 1
        }, (listResponse) => {
            if(!listResponse.ok) {
                robot.logger.error(`something ocuured ${listResponse}`);
                return;
            }
            listResponse.channels
                .filter((ch) => (ch.id.substring(0, 1) === 'C') )
                .forEach((ch) => {
                    slack.reqAPI("channels.invite", {
                        channel: ch.id,
                        user: bot.id
                    }, (inviteResponse) => {
                        if( inviteResponse.ok ) {
                            res.send(`joined <#${ch.id}|${ch.name}>`)
                        } else {
                            if (inviteResponse.error !== 'already_in_channel' ) {
                                robot.logger.error(`failed to join to ${ch.name}`);
                                robot.logger.error(inviteResponse);
                            };
                        }
                    });
                });
        });
    })
})
