let request = require("request");

module.exports = (robot => {
    let isPublic = function(channelId) {
        return channelId.substring(0,1) === 'C';
    }

    robot.hear(/(.+)/, res => {
        let channelId   = res.message.rawMessage.channel
        let channel     = res.envelope.room;
        let userId      = res.message.user.id;
        let userName    = res.message.user.name;
        let message     = res.message.text;
        let slack= res.message.user.slack;
        let icon = slack.profile.image_32;
        reloadUserImages(robot, userId)
        let userImage   = robot.brain.data.userImages[userId]
        if(isPublic(channelId)) {
            message = encodeURIComponent(message)
            let linkNames = 1;
            let timelineChannel = 'timeline';
            let request = res.http(`https://slack.com/api/chat.postMessage?token=${process.env.WEB_SLACK_TOKEN}&channel=%23${timelineChannel}&text=${message}%20(at%20%23${channel}%20)&username=${userName}&link_names=${linkNames}&pretty=1&icon_url=${userImage}`).get();
            request((err, res, body) => {
                err && robot.logger.error(err);
            });
        }
    })

    let reloadUserImages = (robot, userId) => {
        if (!robot.brain.data.userImages) {
            robot.brain.data.userImages = {};
        }
        if( !robot.brain.data.userImages[userId] ) {
            robot.brain.data.userImages[userId] = "";
        }
        if (robot.brain.data.userImages[userId] != "") {
            return;
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
        });
    }

})
