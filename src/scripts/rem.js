// Description:
//   misc
//
// Commands:
//   hubot remu - レムりん
//

"use strict"


const remu = [
    (name) => `今、一緒に逃げてしまったら、レムが一番好きな${name}さんを置き去りにしてしまうような気がしますから`,
    (name) => `なんですか${name}さん、そんな凛々しい目で見つめられると困ってしまいます`,
    (name) => `情けないと思うことと一緒にいることとは矛盾したりしませんよ`,
    (name) => `はい、レムは${name}さんを信じています`,
    (name) => `時間をかけてちゃんと向き合って、自分の気持ちを言葉にすれば、きっと分かってもらえます。${name}さんは素敵な人ですから`,
    (name) => `${name}さんがどんなに辛い思いをしたのか、なにを知ってそんなに苦しんでいるのか、レムにはわかりません。わかります、なんて軽はずみに言えることじゃないのもわかっています。でも、それでも、レムにだってわかっていることがあります。${name}さんは、途中でなにかを諦めるなんて、できない人だってことをです`,
    (name) => `レムは知っています。${name}さんは未来を望む時、その未来を笑って話せる人だって知っています。`,
    (name) => `レムは知っています。${name}さんが未来を、諦められない人だって、知っています。`,
    (name) => `レムは知っています。${name}さんがどんなに先の見えない暗闇の中でも、手を伸ばしてくれる勇気がある人だってことを。`

];

module.exports = (robot) => {
    robot.respond(/rem$/i, (res) => {
        const message = res.random(remu)(res.message.user.name)
        const c = res.message.rawMessage.channel;
        let req = res.http(`https://slack.com/api/chat.postMessage?token=${process.env.WEB_SLACK_TOKEN}&channel=${c}&text=${message}&username=dark&link_names=0&pretty=1&icon_emoji=:rem:`).get();
        req((err, res, body) => {
            err && robot.logger.error(err);
        });
    })
}
