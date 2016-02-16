module.exports = (robot => {
    let isPublic = function(channelId) {
        return channelId.substring(0,1) === 'C';
    }

    robot.hear(/(.+)/, res => {
        let channel = res.message.rawMessage.channel;
        let user = res.message.rawMessage.user;
        let text = res.message.text;
        let slack= res.message.user.slack;
        let icon = slack.profile.image_32;
        if(isPublic(channel)) {
            res.send(text + ' by ' + user  + ' ( at ' + channel + ')');
            console.log(res);
            console.log(user);
            console.log(text);
            console.log(icon);

        }
    })
})
