"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;

const MAX_HP          = 3000;
const HUBOT_NODE_QUEST_USERS_HP  = "HUBOT_NODE_QUEST_USERS_HP";

function factoryUser(id, name, status, spells) {
    const eq      = new Equipment(new Weapon(100, 12, new HitRate(100)));
    const p       = new Parameter(50, 10);
    return new User(id, name, status, eq, p, spells);
}

class UserRepositoryOnHubot {
    constructor(robot, spellRepository) {
        this.robot = robot;
        this.spellRepository = spellRepository;
    }

    save(users) {
        const us = {};
        users.forEach((u) => {
            us[u.id] = u.status.currentHp;
        });
        robot.brain.set(HUBOT_NODE_QUEST_USERS_HP, us);
    }

    get() {
        const savedUsers  = this.robot.brain.get(HUBOT_NODE_QUEST_USERS_HP) || {};
        const us  = this.robot.adapter.client.users;
        return Object.keys(us).map((id) => {
            const user  = us[id];
            const hp    = (!isNaN(savedUsers[id])) ? savedUsers[id] : MAX_HP;
            const st    = new Status(hp, MAX_HP, Infinity, Infinity);
            return factoryUser(user.id, user.name, st, this.spellRepository.get());
        })
    }

}

module.exports = UserRepositoryOnHubot;
