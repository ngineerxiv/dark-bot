"use strict"

const NodeCache = require('node-cache');
const config = require("config");
const HUBOT_NODE_QUEST_USERS  = config.brainKeys.hubotNodeQuestUsers;
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

const ttlSec = 2 * 60 * 60;
const UserCacheKey = 'slack_user_cache'

class UserRepositoryOnHubot {
    constructor(robot, cache = new NodeCache()) {
        this.robot = robot;
        this.users = [];
        this.cache = cache;
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
        this.robot.brain.set(HUBOT_NODE_QUEST_USERS, us);
    }

    async load(jobRepository, weaponRepository) {
        const loaded = await this.loadUsersFromSlack();
        const savedUserStates = this.robot.brain.get(HUBOT_NODE_QUEST_USERS) || {};
        const users = loaded.map((user) => {
            const userId = user.id;
            const userName = user.name;
            const isBot = user.is_bot;
            const saved = savedUserStates[userId];
            const hitPoint      = (saved && !isNaN(saved.hitPoint)) ? saved.hitPoint : MAX_HIT_POINT;
            const magicPoint    = (saved && !isNaN(saved.magicPoint)) ? saved.magicPoint : MAX_MAGIC_POINT;
            const job           = (saved && saved.jobName)? jobRepository.getByName(saved.jobName) : null;
            const u = new User(
                userId,
                userName,
                new HitPoint(hitPoint, MAX_HIT_POINT),
                new MagicPoint(magicPoint, MAX_MAGIC_POINT),
                new Equipment(new Weapon("素手", 100, 50, new HitRate(90), new Critical(10))),
                new Parameter(100, 50, 200, 0),
                [],
                new Status(),
                job
            );

            u.isBot = isBot;
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

        })
        this.users = users;
        return this.users;
    }

    get() {
        return this.users;
    }

    async loadUsersFromSlack() {
        const cached = this.cache.get(UserCacheKey)
        if (cached !== undefined) {
            return cached;
        }
        const webClient = this.robot.adapter.client.web;
        const response = await webClient.users.list();
        const users = response.members;
        this.cache.set(UserCacheKey, users, ttlSec);
        return users;
    }
}

module.exports = UserRepositoryOnHubot;
