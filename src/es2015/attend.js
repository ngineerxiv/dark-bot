

const AttendWords = [
    "参加"
];

const NotAttendWords = [
    "不参加"
];

module.exports = (robot => {
    robot.hear(/.*/i, res => {
        if (res.message.room !== "mokumoku") {
            return;
        }
        // Event当日は無視
        // 次回・来週とかあったら見よう
        // 状態が変わらない場合は何も通知しない
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
        // 状態が変わらない場合は何も通知しない

        if ( isAttend && notAttend ) {
            robot.logger.info("参加か不参加か不明なケース")
            robot.logger.info(tokens)
        } else if ( (isAttend && !notWord) || (notAttend && notWord) ) {
            // TODO Impl
            res.send("参加")
        } else {
            // TODO Impl
            res.send("不参加")
        }
    })
})
