global.expect = require('chai').expect

global.shared_context = {}
global.shared_context.robot_is_running = (callback) => {
    "use strict"
    const helper = require('hubot-mock-adapter-helper')
    let robot = null

    beforeEach((done) => {
        helper.setupRobot((ret) => {
            robot = ret.robot
            callback(ret)
            return done()
        })
    })

    afterEach(() => robot.shutdown())
}

