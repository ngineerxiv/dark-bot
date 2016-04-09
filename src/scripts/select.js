// Description:
//   選ぶ
//

"use strict"
module.exports = (robot => {
    robot.respond(/選んで (.+)/i, res => {
        let items = res.match[1].split(/[　・,、\s]+/);
        let selected = res.random(items);
        res.send(`選ばれたのは "${selected}" でした。`);
    })
})
