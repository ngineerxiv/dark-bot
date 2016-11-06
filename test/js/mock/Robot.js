"use strict"

class Robot {
    constructor(brain, users) {
        this.brain = brain;
        this.adapter = {
            client: {
                users: users
            }
        };
    }

}

module.exports = Robot;
