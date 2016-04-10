require("../helper.js")


const TextMessage = require('hubot/src/message').TextMessage

describe('game.js', () => {
    "use strict"
    let robot = {}
    let user  = [
        {"id": 1, "name": "hoge"},
        {"id": 2, "name": "fuga"}
    ]
    let adapter = {}

    shared_context.robot_is_running((ret) => {
        robot = ret.robot
        adapter = ret.adapter
    });

    beforeEach(() => {
        require('../../src/scripts/game.js')(robot)
    });
})
