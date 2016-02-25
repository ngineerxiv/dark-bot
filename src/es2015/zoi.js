// Description:
//   新規参加者用挨拶スクリプト
//

let uuid = require("node-uuid");

module.exports = (robot => {
    const urataku = 'U034TCZKE';
    const targets = [1,1,1,1,1,2,3];
    let zoi = (res) => {
        let filtered = targets;
        try {
            if(res.message.user.id === urataku) {
                filtered = filtered.filter(elm => elm !== 1);
            }
        } catch (e) {
            robot.logger.error(e);
        }
        let selected = res.random(filtered);
        res.send(`http://yamiga.waka.ru.com/images/zoi${selected}.jpg?cb=${uuid.v4()}`);
    };

    robot.respond(/zoi/i, res => {
        zoi(res);
    })

    robot.respond(/ぞい/i, res => {
        zoi(res);
    })

    // TODO dark image がんばるぞいに引っかかるの部分の修正
    robot.hear(/.*頑張るぞい$/i, res => {
        zoi(res);
    });

    robot.hear(/.*がんばるぞい$/i, res => {
        zoi(res);
    });
})
