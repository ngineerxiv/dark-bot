// Description:
//   選ぶ
// Commands:
//   hubot 選んで ..... - 空白とかカンマ区切りの何かから選んでくれる
//

"use strict"
module.exports = (robot => {
    robot.respond(/選んで (.+)/i, res => {
        let items = res.match[1].split(/[　・,、\s]+/);
        let selected = res.random(items);
        res.send(`選ばれたのは "${selected}" でした。`);
    })
})
