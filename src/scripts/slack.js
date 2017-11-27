// Description:
//   Slack用の機能
// Commands:
//   hubot channel id - 今いるSlackのChannelIDを教えてくれる
//

"use strict"
const HubotSlack = require("hubot-slack");
const SlackBot = HubotSlack.SlackBot;

module.exports = (robot => {
    if (!(robot.adapter instanceof SlackBot)) {
        robot.logger.info("robot.adapter is not Slack Adapter.");
        robot.logger.info("don't read slack.js");
        return;
    }

    robot.respond(/channel id/i, (res) => {
        res.send(res.message.rawMessage.channel)
    });
});

