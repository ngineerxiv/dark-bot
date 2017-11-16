// Description:
//   くっくっくっ・・・黒マテリア
//   くっくっくっ・・・メテオ呼ぶ
//

const Url = require('../lib/Url');

const targets = [
    () => "黒マテリア",
    () => "黒マテリア",
    () => "黒マテリア",
    () => "黒マテリア",
    () => "黒マテリア",
    () => "黒マテリア",
    () => "メテオ呼ぶ",
    () => "メテオ呼ぶ",
    () => "メテオ呼ぶ",
    () => Url.apply('http://yamiga.waka.ru.com/images/cloud.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/cloud.jpg'),
    () => Url.apply('http://yamiga.waka.ru.com/images/cloud.jpg'),
    () => "ックパッド"
];

module.exports = (robot) => {
    robot.hear(/((く|ク)(っ|ッ){0,1}){3}(\.|。|・)*$/i, (res) => {
        const msg = res.random(targets);
        res.send(msg());
    })
}
