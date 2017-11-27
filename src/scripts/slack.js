// Description:
//   選ぶ
// Commands:
//   hubot 選んで ..... - 空白とかカンマ区切りの何かから選んでくれる
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

