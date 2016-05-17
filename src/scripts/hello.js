// Description:
//   新規参加者用挨拶スクリプト
//

"use strict"

module.exports = (robot => {
    robot.respond(/helloworld/i, (res) => {
        const req = res.http(`https://slack.com/api/channels.list?token=${process.env.WEB_SLACK_TOKEN}&exclude_archived=1`).get();
        req((err, response, body) => {
            err && robot.logger.error(err);
            const json = JSON.parse(body);
            res.send(json.channels.map((ch) => {
                return `<#${ch.id}|${ch.name}>: ${ch.topic.value}\n\t${ch.purpose.value}`;
            }).join("\n"));
        });
    })
})
