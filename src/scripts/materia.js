// Description:
//   くっくっくっ・・・黒マテリア
//   くっくっくっ・・・メテオ呼ぶ
//

const uuid = require("node-uuid");
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
    () => `http://yamiga.waka.ru.com/images/cloud.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/cloud.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/cloud.jpg?cb=${uuid.v4()}`,
    () => "ックパッド"
];

module.exports = (robot) => {
    robot.hear(/((く|ク)(っ|ッ){0,1}){3}(\.|。|・)*$/i, (res) => {
        const msg = res.random(targets);
        res.send(msg());
    })
}
