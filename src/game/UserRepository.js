"use strict"

const HUBOT_NODE_QUEST_USERS  = "HUBOT_NODE_QUEST_USERS";
const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const Critical  = DarkQuest.Critical;

const MAX_HIT_POINT   = 5000;
const MAX_MAGIC_POINT = 1000;

class UserRepositoryOnHubot {
    constructor(brain) {
        this.brain = brain;
        this.users = [];
    }

    save() {
        const us = {};
        this.users.forEach((u) => {
            us[u.id] = {
                hitPoint: u.hitPoint.current,
                magicPoint: u.magicPoint.current,
                jobName: (u.job ? u.job.name : null)
            }
        });
        this.brain.set(HUBOT_NODE_QUEST_USERS, us);
    }

    load(idToSlackUser, jobRepository, weaponRepository) {
        const savedUserStates = this.brain.get(HUBOT_NODE_QUEST_USERS) || {};
        const users =  Object.keys(idToSlackUser).map((id) => {
            const user  = idToSlackUser[id];
            const saved = savedUserStates[id];
            const hitPoint      = (saved && !isNaN(saved.hitPoint)) ? saved.hitPoint : MAX_HIT_POINT;
            const magicPoint    = (saved && !isNaN(saved.magicPoint)) ? saved.magicPoint : MAX_MAGIC_POINT;
            const job           = saved ? jobRepository.getByName(saved.jobName) : null;
            const weapon        = weaponRepository.getByName("素手");
            const u = new User(
                user.id, 
                user.name, 
                new HitPoint(hitPoint, MAX_HIT_POINT), 
                new MagicPoint(magicPoint, MAX_MAGIC_POINT), 
                new Equipment(new Weapon("素手", 100, 50, new HitRate(90), new Critical(10))),
                new Parameter(100, 50, 200, 0),
                [],
                new Status(),
                job
            );

            u.isBot = idToSlackUser[id] && idToSlackUser[id].is_bot;
            u.hitPoint.on("changed", (data) => {
                this.save();
            });
            u.magicPoint.on("changed", (data) => {
                this.save();
            });

            u.on("jobChanged", (data) => {
                this.save();
            });

            return u;
        });
        this.users = users;
        return this.users;
    }

    get() {
        return this.users;
    }
}

module.exports = UserRepositoryOnHubot;
