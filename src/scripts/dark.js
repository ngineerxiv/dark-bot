// Description:
//   misc
//
// Commands:
//   hubot poem - オサレポエム
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//   hubot goma - やればわかる
//   hubot isao - やればわかる
//

"use strict"

const config = require("config");
const Levenshtein = require("levenshtein");
const sqlite3 = require("sqlite3").verbose();
const sqliteDBPath = process.env.KUSOKORA_DB_PATH
const db = new sqlite3.Database(sqliteDBPath || ':memory:');
const KusokoraRepository = require("../dark/KusokoraRepository");
const kusokoraRepository = new KusokoraRepository(db);
const Url = require('../lib/Url');
const format = require('string-template');

const gomas = [
    () => Url.apply('http://yamiga.waka.ru.com/images/goma/01.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/goma/02.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/goma/03.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/goma/04.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/goma/05.jpg'),
    () => "```\n　　　CH \n　　　／＼ \n　　／　＼＼ \nHC／　　　＼＼CH \n ｜｜C6H6　　｜ \n ｜｜　´д｀｜ \nHC＼　　　／／CH \n　　＼　／／ \n　　　＼／ \n　　　CH\n```"
];
const isaos = [
    () => Url.apply('https://36.media.tumblr.com/3df68abdd9a1eb7a0fbda4dacb9930af/tumblr_ns5chdb0Vm1un4u6lo1_1280.jpg', '#'),
    () => Url.apply('https://camo.githubusercontent.com/4a011f97909b89a26822ee21e921eb7012e9df18/68747470733a2f2f34302e6d656469612e74756d626c722e636f6d2f31346231333736396364336238303235623163653338626238626238626261352f74756d626c725f6e75313538697269536c31756e3475366c6f315f313238302e6a7067'),
    () => Url.apply('https://68.media.tumblr.com/b167d3c40341868491fc56266994b24a/tumblr_oibhhjbqwM1un4u6lo1_400.gif', '#'),
    () => Url.apply('https://68.media.tumblr.com/76e4c36e209a9709f1e66831f8c78d97/tumblr_oo2ynnnv3x1un4u6lo1_400.gif', '#'),
];

const nayus = [
    ":nayu: 「宇宙規模で見れば3000行のコミットなんて些細な物」"
];

const kirins = [
    () => ":kirin: 「名言 :ha: :tsukureru: 」",
    () => Url.apply('https://78.media.tumblr.com/285789508369fafedf077149d14cbb40/tumblr_ozeltfR7SE1wi2duuo1_1280.png'),
    () => Url.apply('https://78.media.tumblr.com/48b7fb2197972dbf5962c6ce4896e12c/tumblr_ozemn25ogo1r4buwio1_1280.png'),
];

const tries = [
    () => Url.apply('https://cdn.hotolab.net/images/lgtm_mrtry.gif'),
];

module.exports = (robot) => {

    robot.respond(/poem$/i, (res) => {
        res.send(res.random(config.poem))
    })

    robot.hear(/なん(\.|。|・)*だと(\.|。|・)*$/i, (res) => {
        res.send(Url.apply('http://yamiga.waka.ru.com/images/nandato.png'));
    })

    robot.respond(/炎上 (.+) (.+)/i, (res) => {
        const text1 = encodeURIComponent(res.match[1])
        const text2 = encodeURIComponent(res.match[2])
        res.send(`https://enjo-generator.herokuapp.com/api/create-enjo?text1=${text1}&text2=${text2}`);
    })

    robot.respond(/距離 (.+) (.+)/i, (res) => {
        const l = new Levenshtein(res.match[1],res.match[2]);
        res.send(`距離: ${l.distance}`);
    });

    robot.respond(/goma$/i, (res) => {
        res.send((res.random(gomas))())
    })

    robot.respond(/isao$/i, (res) => {
        res.send((res.random(isaos))())
    })

    robot.respond(/PAPIX$/i, (res) => {
        kusokoraRepository.getAll((urls) => {
            if (urls.length > 0) {
                const url = res.random(urls);
                res.send(Url.apply(url, '#'));
            }
        });
    });

    robot.respond(/stenyan (.+)$/, (res) => {
        const target = res.match[1];
        res.send(`ウェーイww君${target}っぽいね？てかLINEやってる？笑`);
    });

    robot.respond(/NAYU$/i, (res) => {
        res.send(res.random(nayus));
    });

    robot.respond(/KIRIN$/i, (res) => res.send( (res.random(kirins))()) );

    robot.respond(/KIRIN (\d+)$/i, (res) => {
        const n = res.match[1];
        const x = parseFloat(n);
        const y = x / 140000;
        res.send(`${n}円は${y}きりん`);
    })

    robot.respond(/MRTRY$/i, (res) => res.send( (res.random(tries))() ));

    robot.respond(/TRY$/i, (res) => res.send( (res.random(tries))() ));

    robot.hear(/^di (.+)$/, (res) => {
        const message = res.message;
        const matched = res.match[1];
        message.text = `${robot.name} image ${matched}`;
    });

    robot.hear(/^5000兆円欲しい$/i, (res) => {
        res.send(':5: :0: :0sono1: :0sono2: :chou: :en: :ho: :shi: :ii:');
    });

    robot.hear(/^大丈夫？$/, (res) => {
        res.send(
            res.random([
                ':oppai: :momu: :hatena:'
            ])
        );
    });

    robot.hear(/^もむ$/, (res) => {
        res.send(':atamanowaruihito: :momu:  :momu: :exclamation:');
    });

    const templates = [
        ':robot_face: 「この時の {name} はあんなことになるとは思ってなかったのであった」',
        ':robot_face: 「{n} 年前の俺もそうしたくないと思ってはいたんだ・・・」',
        ':atamanowaruihito: 「フラグ」',
        ':atamanowaruihito: 「エターナルフォースブリザード」',
        ':robot_face: 「素晴らしい！！この研究は大成功だ！！！もう{action}さなくていい薬が完成したぞ！」',
        ':robot_face: 「何、バカなことを言ってるんだ？もう二度と絶対に{action}すなんてことするわけないだろう」'
    ];

    robot.hear(/^もう(.+)したくない$/, (res) => {
        // FIXME shell adapterだと多分コケる
        const message = res.random(templates);
        const name = res.message.user.name;
        const action = res.match[1];
        const n = parseInt(Math.random() * 10);

        const m = format(message, {
            name: name,
            n: n,
            action: action
        });
        res.send(m);
    });

}
