var slackAPI = require('slackbotapi');
var token = process.env.WEB_SLACK_TOKEN;
if (!token) {
    console.error("slack web api token is not set");
    console.error("please `export WEB_SLACK_TOKEN`");
    process.exit(1);
}
var slack = new slackAPI({
    'token': token,
    'logging': true,
    'autoReconnect': true
});

slack.on('channel_created', function (data) {
    var data = {
        channel: "#new_channels",
        username: "yaruo",
        text: "新しいチャンネルが作られたみたいだお <#" + data.channel.id + "|" + data.channel.name +">",
        icon_url: "http://yamiga.waka.ru.com/images/yaruo.jpg"
    };
    slack.reqAPI("chat.postMessage",data);
});

