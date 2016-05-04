"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;

const MAX_HP          = 3000;
const HUBOT_NODE_QUEST_USERS_HP  = "HUBOT_NODE_QUEST_USERS_HP";

function factoryUser(id, name, hitPoint, magicPoint) {
    const eq      = new Equipment(new Weapon(100, 12, new HitRate(100)));
    const p       = new Parameter(100, 50);
    return new User(id, name, hitPoint, magicPoint, eq, p);
}

class UserRepositoryOnHubot {
    constructor(robot) {
        this.robot = robot;
    }

    save(users) {
        const us = {};
        users.forEach((u) => {
            us[u.id] = u.hitPoint.current;
        });
        this.robot.brain.set(HUBOT_NODE_QUEST_USERS_HP, us);
    }

    get() {
        const savedUsers  = this.robot.brain.get(HUBOT_NODE_QUEST_USERS_HP) || {};
        const us  = this.robot.adapter.client.users;
        return Object.keys(us).map((id) => {
            const user  = us[id];
            const hp    = (!isNaN(savedUsers[id])) ? savedUsers[id] : MAX_HP;
            const hitPoint = new HitPoint(hp, MAX_HP);
            const magicPoint = new MagicPoint(Infinity, Infinity);
            return factoryUser(user.id, user.name, hitPoint, magicPoint);
        })
    }
}

module.exports = UserRepositoryOnHubot;
