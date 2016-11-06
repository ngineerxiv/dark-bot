"use strict"
const assert = require("power-assert");
const config = require("config");
const HUBOT_NODE_QUEST_USERS  = config.brainKeys.hubotNodeQuestUsers;
const UserRepository = require("../../../src/game/UserRepository.js");
const DarkQuest = require("node-quest");
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const JobRepository   = require("../../../src/game/JobRepository.js");
const WeaponRepository = require("../../../src/game/WeaponRepository.js");
const MockBrain = require("../mock/Brain.js");
const MockRobot = require("../mock/Robot.js");

describe('UserRepository', () => {
    it("should load", () => {
        const mockRobot = new MockRobot(new MockBrain({
            HUBOT_NODE_QUEST_USERS: {
                "a": {
                    id: "a",
                    hitPoint: 10,
                    magicPoint: 10,
                },
                "b": {
                    id: "b",
                    hitPoint: 0,
                    magicPoint: 10,
                }
            }
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });

        const r = new UserRepository(mockRobot);
        const actual = r.load(new JobRepository(), new WeaponRepository());
        assert.equal(Object.keys(actual).length, 3);
        assert.deepEqual(actual.map((u) => {
            return {
                id: u.id,
                name: u.name,
                hp: u.hitPoint.current,
                mp: u.magicPoint.current
            }
        }), [
            {id: "a", name:"hoge", hp: 10, mp:10},
            {id: "b", name:"fuga", hp: 0, mp:10},
            {id: "c", name:"piyo", hp: 5000, mp:1000}
        ]);

    });

    it("should save and get", () => {
        const mockRobot = new MockRobot(new MockBrain({
            HUBOT_NODE_QUEST_USERS: {
                "a": {
                    id: "a",
                    hitPoint: 10,
                    magicPoint: 10,
                },
                "b": {
                    id: "b",
                    hitPoint: 0,
                    magicPoint: 10,
                }
            }
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });

        const r = new UserRepository(mockRobot);
        r.load(new JobRepository(), new WeaponRepository());
        const users = r.get();
        const user = users.filter((u) => u.name === "hoge").pop(); 
        user.cured(100);
        r.save();


        r.load(new JobRepository(), new WeaponRepository());
        const actual = r.get();
        assert.equal(Object.keys(actual).length, 3);
        assert.deepEqual(actual.map((u) => {
            return {
                id: u.id,
                name: u.name,
                hp: u.hitPoint.current,
                mp: u.magicPoint.current
            }
        }), [
            {id: "a", name:"hoge", hp: 110, mp:10},
            {id: "b", name:"fuga", hp: 0, mp:10},
            {id: "c", name:"piyo", hp: 5000, mp:1000}
        ]);
    })
});

