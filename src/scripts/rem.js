// Description:
//   misc
//
// Commands:
//   hubot remu - レムりん
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



const remu = [
    (name) => `今、一緒に逃げてしまったら、レムが一番好きな${name}さんを置き去りにしてしまうような気がしますから`,
    (name) => `なんですか${name}さん、そんな凛々しい目で見つめられると困ってしまいます`,
    (name) => `情けないと思うことと一緒にいることとは矛盾したりしませんよ`,
    (name) => `時間をかけてちゃんと向き合って、自分の気持ちを言葉にすれば、きっと分かってもらえます。${name}さんは素敵な人ですから`,
    (name) => `${name}さんがどんなに辛い思いをしたのか、なにを知ってそんなに苦しんでいるのか、レムにはわかりません。わかります、なんて軽はずみに言えることじゃないのもわかっています。でも、それでも、レムにだってわかっていることがあります。${name}さんは、途中でなにかを諦めるなんて、できない人だってことをです`,
    (name) => `レムは知っています。${name}さんは未来を望む時、その未来を笑って話せる人だって知っています。`,
    (name) => `レムは知っています。${name}さんが未来を、諦められない人だって、知っています。`,
    (name) => `レムは知っています。${name}さんがどんなに先の見えない暗闇の中でも、手を伸ばしてくれる勇気がある人だってことを。`,
    (name) => `諦めるのは簡単です。⋯でも、${name}さんには似合わない`,
    (name) => `レムは信じています。どんなに辛く苦しいことがあって、${name}さんが負けそうになってしまっても……世界中の誰も${name}さんを信じなくなって、${name}さん自身が自分のことを信じられなくなっても、レムは信じています。`,
    (name) => `${name}さんに頭をなでられるのが好きです。手のひらと髪の毛を通して、${name}さんと通じあっている気がするんです。`,
    (name) => `${name}さんの声が好きです。言葉一つ聴くたびに、心が温かくなるのを感じるんです。`,
    (name) => `${name}さんの目が好きです。普段は鋭いんですけど、誰かに優しくしようとしているとき、柔らかくなるその目が好きです。`,
    (name) => `${name}さんの指が好きです。男の子なのに綺麗な指をしていて、でも握るとやっぱり男の子なんだって思わせてくれる、強くて細い指なんです。`,
    (name) => `${name}さんの歩き方が好きです。一緒に隣を歩いていると、たまにちゃんとついてきているか確かめるみたいに振り向いてくれる、そんな歩き方が好きです。`,
    (name) => `一人で歩くのが大変なら、レムが支えます。「荷物を分けあって、お互いに支えながら歩こう」あの朝に、そう言ってくれましたよね。カッコいいところを見せてください${name}さん`
];

module.exports = (robot) => {
    const slack = init(process.env.WEB_SLACK_TOKEN);
    robot.respond(/rem$/i, (res) => {
        const message = res.random(remu)(res.message.user.name)
        const c = res.message.rawMessage.channel;
        slack.reqAPI("chat.postMessage", {
            channel: c,
            text: message,
            username: "レム",
            link_names: 0,
            pretty: 1,
            icon_emoji: ":rem:"
        }, (res) => {
            if(!res.ok) {
                robot.logger.error(`something ocuured ${res}`);
                return;
            }
        })
    })
}
