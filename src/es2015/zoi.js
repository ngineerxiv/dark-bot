// Description:
//   新規参加者用挨拶スクリプト
//

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
        res.send(`http://yamiga.waka.ru.com/images/zoi${selected}.jpg`);
    };

    robot.respond(/[zoi|ぞい]/i, res => {
        zoi(res);
    })

    robot.hear(/.*[がんばる|頑張る]ぞい/i, res => {
        zoi(res);
    });
})
