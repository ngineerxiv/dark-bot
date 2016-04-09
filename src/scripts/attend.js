//
//
//
//

"use strict"
const request = require("request")

const apiUrl = "https://ngineerxiv-dark.appspot.com/mokumoku/events"

const AttendWords = [
    "参加"
];

const NotAttendWords = [
    "不参加"
];

const HUBOT_ATTEND_KEY = "hubot-attend-keys-for-dark";

function updateEvents(url, logger, callback) {
    request(url, (err, res, body) => {
        err && logger.error(err);
        const events = JSON.parse(body);
        if(events.length <= 0) {
            return callback([]);
        }

        const sorted = events.sort((a, b) => {
            let d1 = new Date(a.startAt);
            let d2 = new Date(b.startAt);
            if(d1.getTime() < d2.getTime()) {
                return -1;
            } else if (d1.getTime() === d2.getTime()) {
                return 0;
            } else {
                return 1;
            }
        });
        return callback(sorted);
    });
}


module.exports = (robot => {
    let events = [];

    updateEvents(apiUrl, robot.logger, (updated) => {
        events = updated;
    });

    const load = function() {
        const attendees = robot.brain.get(HUBOT_ATTEND_KEY)
        return attendees ? attendees : {};
    };

    const save = function(attendees) {
        robot.brain.set(HUBOT_ATTEND_KEY, attendees);
    };

    const dateToKey = function(e) {
        const d = new Date(e.startAt);
        return `${d.getYear()}-${d.getMonth()}-${d.getDay()}`;
    }

    const addAttendee = function(userName, event) {
        const attendees = load();
        const key = dateToKey(event);
        const target    = attendees[key] ? attendees[key] : [];
        const old = target;
        const changed = old.indexOf(userName) === -1;
        target.push(userName);
        attendees[key] = target.filter((x, i, self) => self.indexOf(x) === i);
        return {
            after : attendees,
            changed: changed
        };
    };

    const removeAttendee = function(userName, event) {
        const attendees = load();
        const key       = dateToKey(event);
        const target    = attendees[key] ? attendees[key] : [];
        const old       = target;
        const changed   = old.indexOf(userName) !== -1
        attendees[key] = target.filter((x) => x !== userName);
        return {
            after : attendees,
            changed: changed
        };
    };

    const key = () => {
        const e = latest();
        return e ? dateToKey(e) : null;
    }

    const latest = () => {
        if(events && events.length !== 0) {
            return events[0];
        } else {
            return null;
        }
    }

    const status = () => {
        const event = latest();
        if ( event ) {
            const start  = new Date(event.startAt);
            return `${event.title} @ ${event.location}\n 開始: ${start}`;
        } else {
            return null;
        }
    }

    robot.hear(/.*/i, res => {
        if (res.message.room !== "mokumoku") {
            return;
        }
        updateEvents(apiUrl, robot.logger, (updated) => {
            events = updated
        });

        const event    = status();
        if(event === null) {
            return;
        }

        const tokens = (res.message.tokenized || []).map((t) => t.basic_form)
        const isAttend  = tokens.reduce((prev, cur) => {
            return prev || AttendWords.indexOf(cur) !== -1
        }, false)

        const notAttend = tokens.reduce((prev, cur) => {
            return prev || NotAttendWords.indexOf(cur) !== -1
        }, false)

        const notWord = tokens.reduce((prev, cur) => {
            return prev || (cur === "ない")
        }, false)

        // Event当日は無視
        // 次回・来週とかあったら見よう

        const userName = res.message.user.name;
        if ( isAttend && notAttend ) {
            robot.logger.info("参加か不参加か不明なケース")
            robot.logger.info(tokens)
        } else if ( (isAttend && !notWord) || (notAttend && notWord) ) {
            const l = latest();
            const result = addAttendee(userName, l);
            if(result.changed) {
                res.send(`${userName} joined! \n${event}`);
                save(result.after);
            }
        } else if ( (isAttend && notWord) || (notAttend && !notWord) ) {
            const l = latest();
            const result = removeAttendee(userName, l);
            if(result.changed) {
                res.send(`${userName} leaved! \n${event}`);
                save(result.after);
            }
        }
    })

    robot.respond(/moku/i, res => {
        const event     = status();
        const attendees = load();
        if(event !== null) {
            const k = key();
            const list = attendees[k] ? attendees[k] : [];
            const message = list.join(",");
            res.send(`直近のもくもく会: \n${event}\n参加者: ${message}`);
        } else {
            res.send("直近のもくもく会は見当たらないなぁ・・・");
        }
    });
})
