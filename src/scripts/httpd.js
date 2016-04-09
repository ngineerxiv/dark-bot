// Description:
//   監視用
//

"use strict"

const spawn = require('child_process').spawn

module.exports = (robot) => {
    robot.router.get("/hubot/version", (req, res) => {
        res.end(robot.version);
    })

    robot.router.get("/hubot/ping", (req, res) => {
        res.end("PONG")
    });
}
