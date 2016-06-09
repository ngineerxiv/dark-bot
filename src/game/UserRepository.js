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

const MAX_HIT_POINT   = 3000;
const MAX_MAGIC_POINT = 1000;
const HUBOT_NODE_QUEST_USERS  = "HUBOT_NODE_QUEST_USERS";

function factoryUser(id, name, hitPoint, magicPoint) {
    const eq      = new Equipment(new Weapon(100, 12, new HitRate(95)));
    const p       = new Parameter(100, 50);
    return new User(id, name, hitPoint, magicPoint, eq, p);
}

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
                magicPoint: u.magicPoint.current
            }
        });
        this.brain.set(HUBOT_NODE_QUEST_USERS, us);
    }

    isBot(id) {
        return this.users[id] && this.users[id].is_bot;
    }

    get() {
        const savedUsers  = this.brain.get(HUBOT_NODE_QUEST_USERS) || {};
        return Object.keys(this.users).map((id) => {
            const user  = this.users[id];
            const saved = savedUsers[id];
            const hitPoint    = (saved && !isNaN(saved.hitPoint)) ? saved.hitPoint : MAX_HIT_POINT;
            const magicPoint    = (saved && !isNaN(saved.magicPoint)) ? saved.magicPoint : MAX_MAGIC_POINT;
            return factoryUser(
                user.id,
                user.name,
                new HitPoint(hitPoint, MAX_HIT_POINT),
                new MagicPoint(magicPoint, MAX_MAGIC_POINT)
            );
        })
    }
}

module.exports = UserRepositoryOnHubot;
