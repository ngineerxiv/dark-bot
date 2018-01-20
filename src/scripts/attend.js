// Description:
//   もくもく会用
//
// Notes:
//   #mokumoku 
//
// Commands:
//   参加 - 最新のもくもく会に参加
//   不参加 - 最新のもくもく会に不参加
//   hubot moku - 今のイベントの参加者と日程を確認する
//

"use strict"

const ApiClient          = require("../core/api/Client.js");
const EventServer        = require("../mokumoku/EventServer.js");
const AttendeeRepository = require("../mokumoku/AttendeeRepository.js");
const AttendChecker      = require("../mokumoku/AttendChecker.js");

const status = (event) => {
    const start  = new Date(event.startAt);
    return `${event.title} on ${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`;
}

module.exports = (robot => {
    const repository    = new AttendeeRepository(robot.brain, "hubot-attend-keys-for-dark");
    const cli           = new ApiClient("https://ngineerxiv-dark.appspot.com/mokumoku/events")
    const eventServer   = new EventServer(cli, repository);
    const checker       = new AttendChecker(["参加"], ["不参加"], "ない");

    // TODO Event当日は無視
    // TODO 次回・来週とかあったら見よう
    robot.hear(/.*/i, res => {
        if (res.message.room !== "mokumoku") {
            return;
        }
        const event    = eventServer.latestEvent();
        if(event === null) {
            return;
        }

        const tokens = (res.message.tokenized || []).map((t) => t.basic_form)
        const checkResult = checker.check(tokens);

        const userName = res.message.user.name;
        if ( checkResult.ambiguous ) {
            robot.logger.info("参加か不参加か不明なケース")
            robot.logger.info(tokens)
        } else if ( checkResult.isAttend ) {
            const result = eventServer.attend(userName, eventServer.latestEvent());
            result.changed && res.send(`*${userName} joined!* -> ${status(event)}`)
        } else if ( checkResult.notAttend ) {
            const result = eventServer.leave(userName, eventServer.latestEvent());
            result.changed && res.send(`*${userName} left!* <- ${status(event)}`);
        }
    })

    robot.respond(/moku/i, res => {
        const event     = eventServer.latestEvent();
        if(event !== null) {
            const members = eventServer.attendees(event);
            res.send(`直近のもくもく会 ~~ *${event.title}* ~~\n参加者: ${members.length}人 ( ${members.join(",")} )\n場所: ${event.location}\n備考: ${event.description}`);
        } else {
            res.send("直近のもくもく会は見当たらないなぁ・・・");
        }
    });
})
