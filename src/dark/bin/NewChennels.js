var slackAPI = require('slackbotapi');
var token = process.env.WEB_SLACK_TOKEN;
var request = require('request');

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

slack.on('message', function (data) {
    var ch = slack.getChannel(data.channel);
    var option  = {
        uri: "http://waka.ru.com/api/dark/slack/" + ch.name,
        form: {
            number: 1
        }
    };
    request.post(option, function(error, response, body){
//        TODO エラーハンドリングまわり
        if (!error && response.statusCode == 200) {
            // do nothing
        } else {
            console.log('error: '+ response.statusCode);
        }
    });
});

