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

const load = function(robot) {
    return robot.brain.get(HUBOT_ATTEND_KEY);
};

const save = function(robot, attendees) {
    robot.brain.set(HUBOT_ATTEND_KEY, attendees);
};


module.exports = (robot => {
    let events = load(robot);
    let attendees = {};

    const filterDuplicate = function(arr) {
        return arr.filter((x, i, self) => self.indexOf(x) === i);
    }

    const dateToKey = function(startAt) {
        const d = new Date(startAt);
        return `${d.getYear()}-${d.getMonth()}-${d.getDay()}`;
    }

    const addAttendee = function(userName, startAt) {
        const key = dateToKey(startAt);
        let target = attendees[key];
        target = target || [];
        const old = target;
        const changed = old.indexOf(userName) === -1;
        target.push(userName);
        attendees[key] = filterDuplicate(target);
        return {
            after : attendees,
            changed: changed
        };
    };

    const removeAttendee = function(userName, startAt) {
        const key = dateToKey(startAt);
        let target = attendees[key];
        target = target || [];
        const old = target;
        const changed = old.indexOf(userName) !== -1
        target = target.filter((x) => x !== userName);
        attendees[key] = target;
        return {
            after : attendees,
            changed: changed
        };
    };

    const status = function() {
        if(events && events.length !== 0) {
            const latest = events[0];
            const start  = new Date(latest.startAt);
            return `${latest.title} @ ${latest.location}\n 開始: ${start}`;
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
            const result = addAttendee(userName);
            if(result.changed) {
                res.send(`${userName} joined! \n${event}`);
                save(robot, attendees);
            }

        } else {
            const result = removeAttendee(userName);
            if(result.changed) {
                res.send(`${userName} leaved! \n${event}`);
                save(robot, attendees);
            }
        }
    })

    robot.respond(/mokumoku/i, res => {
        const event = status();
        if(event !== null) {
            res.send(`直近のもくもく会: \n${event}`);
        } else {
            res.send("直近のもくもく会は見当たらないなぁ・・・");
        }
    });
})
