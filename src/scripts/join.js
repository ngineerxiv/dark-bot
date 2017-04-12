// Description:
//   join all channels
//
// Notes:
//   #timeline 用
//
// Commands:
//   hubot join list - 参加していないchannelを表示する
//

"use strict"

const slackAPI = require('slackbotapi');

const init = function(token) {
    if ( token === undefined ) {
        return new Error(`HUBOT_SLACK_TOKEN cannot be empty! value: undefined`);
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
    const slack = init(process.env.HUBOT_SLACK_TOKEN);

    robot.respond(/join list/i, res => {
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
            const message = listResponse.channels
                .filter((ch) => (ch.id.substring(0, 1) === 'C') )
                .filter((ch) => (ch.members.indexOf(bot.id) === -1))
                .map((ch) => `<#${ch.id}|${ch.name}>`)
                .join(", ");
            res.send([
                "参加していないチャンネル",
                message
            ].join("\n"));
        });
    })
})
