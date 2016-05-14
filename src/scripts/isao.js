// Description:
//   いさお
//
// Commands:
//   hubot isao - やればわかる
//

"use strict"

const uuid = require("node-uuid");
const isaos = [
    () => `https://36.media.tumblr.com/3df68abdd9a1eb7a0fbda4dacb9930af/tumblr_ns5chdb0Vm1un4u6lo1_1280.jpg?cb=${uuid.v4()}`,
    () => `https://camo.githubusercontent.com/4a011f97909b89a26822ee21e921eb7012e9df18/68747470733a2f2f34302e6d656469612e74756d626c722e636f6d2f31346231333736396364336238303235623163653338626238626238626261352f74756d626c725f6e75313538697269536c31756e3475366c6f315f313238302e6a7067?cb=${uuid.v4()}`
];
module.exports = (robot) => {
    robot.respond(/isao$/i, (res) => {
        res.send((res.random(isaos))())
    })
}
