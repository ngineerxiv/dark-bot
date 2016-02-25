// Description:
//   新規参加者用挨拶スクリプト
//

module.exports = (robot => {
    const targets = [1,1,1,1,1,2,3];
    robot.respond(/zoi/i, res => {
        let selected = res.random(targets);
        res.send(`http://yamiga.waka.ru.com/images/zoi${selected}.jpg`);
    })

    robot.hear(/.*[がんばる|頑張る]ぞい/i, res => {
        let selected = res.random(targets);
        res.send(`http://yamiga.waka.ru.com/images/zoi${selected}.jpg`);
    });
})
