// Description:
//   #timeline 用のscript
//   参加しているチャンネルへの投稿が全て#timelineに投稿される
//

"use strict"
let request = require("request");
let hubotSlack = require("hubot-slack");
let SlackTextMessage = hubotSlack.SlackTextMessage;
let timelineChannel  = process.env.TIMELINECHANNEL || "timeline";
let linkNames        = process.env.LINK_NAMES;
if (linkNames !== "0" && linkNames !== "1") {
    linkNames = 0;
};

module.exports = (robot => {
    let isPublic = function(channelId) {
        return channelId.substring(0,1) === 'C';
    }

    let blackList = [timelineChannel];

    let isBlackListChannel = (ch) => (blackList.indexOf(ch) !== -1);

    let isSlackTextMessage = (message) => (message instanceof SlackTextMessage);

    robot.hear(/(.+)/, res => {
        if ( !isSlackTextMessage(res.message) ) {
            return;
        }
        let channelId   = res.message.rawMessage.channel
        let channel     = res.envelope.room;
        let userId      = res.message.user.id;
        let userName    = res.message.user.name;
        let message     = res.message.text;
        let slack       = res.message.user.slack;
        let icon        = slack.profile.image_32;
        reloadUserImages(robot, userId, () => {
            let userImage   = robot.brain.data.userImages[userId]
            if(isPublic(channelId) && !isBlackListChannel(channel)) {
                message = message + ` (at <#${channelId}|${channel}> )`;
                message = encodeURIComponent(message)
                let req = res.http(`https://slack.com/api/chat.postMessage?token=${process.env.WEB_SLACK_TOKEN}&channel=%23${timelineChannel}&text=${message}&username=${userName}&link_names=${linkNames}&pretty=1&icon_url=${userImage}`).get();
                    req((err, res, body) => {
                        err && robot.logger.error(err);
                    });
            }
        })
    })

    let reloadUserImages = (robot, userId, callback) => {
        if (!robot.brain.data.userImages) {
            robot.brain.data.userImages = {};
        }
        if( !robot.brain.data.userImages[userId] ) {
            robot.brain.data.userImages[userId] = "";
        }
        if (robot.brain.data.userImages[userId] != "") {
            return callback();
        }
        let options = {
            url: `https://slack.com/api/users.list?token=${process.env.WEB_SLACK_TOKEN}&pretty=1`,
            timeout: 2000,
            headers: {}
        };

        request(options, (error, response, body) => {
            error && robot.logger.error(error);
            let json = JSON.parse(body);
            let i = 0;
            let len = json.members.length;
            while (i < len) {
                let image = json.members[i].profile.image_48
                robot.brain.data.userImages[json.members[i].id] = image
                ++i
            }
            callback();
        });
    }

})
