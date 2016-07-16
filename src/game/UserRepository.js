"use strict"

const HUBOT_NODE_QUEST_USERS  = "HUBOT_NODE_QUEST_USERS";

class UserRepositoryOnHubot {
    constructor(brain, users) {
        this.brain = brain;
        this.users = users || {};
    }

    save(users) {
        const us = {};
        users.forEach((u) => {
            us[u.id] = {
                hitPoint: u.hitPoint.current,
                magicPoint: u.magicPoint.current,
                jobName: (u.job ? u.job.name : null)
            }
        });
        this.brain.set(HUBOT_NODE_QUEST_USERS, us);
    }

    isBot(id) {
        return this.users[id] && this.users[id].is_bot;
    }

    getAllUsers() {
        return this.users;
    }

    get() {
        return this.brain.get(HUBOT_NODE_QUEST_USERS) || {};
    }
}

module.exports = UserRepositoryOnHubot;
