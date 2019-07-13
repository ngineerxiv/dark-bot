"use strict"
const assert    = require("power-assert");
const NodeQuest = require("node-quest");
const config = require("config");
const HUBOT_NODE_QUEST_USERS  = config.brainKeys.hubotNodeQuestUsers;
const DarkGame  = require("../../../src/game/DarkGame.js");
const lang      = require("../../../src/game/lang/Ja.js");
const MockBrain = require("../mock/Brain.js");
const MockRobot = require("../mock/Robot.js");
const UserRepository    = require("../../../src/game/UserRepository.js");
const BitnessRepository = require("../../../src/game/BitnessRepository.js");
const NodeCache = require('node-cache');

describe('DarkGame', () => {
    describe("#loadUsers", () => {
        const cache = new NodeCache();
        cache.set("slack_user_cache", [
            {"id": "a", "name": "hoge", is_bot: false},
            {"id": "b", "name": "fuga", is_bot: false},
            {"id": "c", "name": "piyo", is_bot: false}
        ]);
        const robot = new MockRobot(new MockBrain({
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
        }));

        const userRepository = new UserRepository(robot, cache);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const darkGame = new DarkGame(
            userRepository,
            bitnessRepository
        );

        it("should load users from repository", async () => {
            const actual = await darkGame.loadUsers();
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
    });

    describe("#attackToUser", () => {
        const initGame = () => {
            const cache = new NodeCache();
            cache.set("slack_user_cache", [
                {"id": "a", "name": "hoge", is_bot: false},
                {"id": "b", "name": "fuga", is_bot: false},
                {"id": "c", "name": "piyo", is_bot: false}
            ]);

            const robot = new MockRobot(new MockBrain({
                HUBOT_NODE_QUEST_USERS: {
                    "a": {
                        id: "a",
                        hitPoint: 10,
                        magicPoint: 10,
                    },
                    "b": {
                        id: "b",
                        hitPoint: 1,
                        magicPoint: 10,
                    }
                }
            }));
            const userRepository = new UserRepository(robot, cache);
            const bitnessRepository = new BitnessRepository(robot.brain);
            return new DarkGame(
                userRepository,
                bitnessRepository
            );
        };

        it("should attack to user and decrease hp", async () => {
            const darkGame = initGame();
            await darkGame.loadUsers()
            const actual = darkGame.attackToUser("hoge", "fuga", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userRepository.get()
            assert.equal(users.length, 3);
            // FIXME 命中率とかの関連でたまに落ちるのでHPが減ってるテストが書けない
        });

        it("should decrease hit point to 0 when user attacks 神父 and countered to user", async () => {
            const darkGame = initGame();
            await darkGame.loadUsers();
            const actual = darkGame.attackToUser("piyo", "神父", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userRepository.get()
            assert.deepEqual(users.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    hp: u.hitPoint.current,
                    mp: u.magicPoint.current
                }
            }), [
                {id: "a", name:"hoge", hp: 10, mp: 10},
                {id: "b", name:"fuga", hp: 1, mp:10},
                {id: "c", name:"piyo", hp: 0, mp:1000}
            ]);
        });

        it("should decrease magic point to 0 when user attacks 社会 and countered to user", async () => {
            const darkGame = initGame();
            await darkGame.loadUsers();
            const actual = darkGame.attackToUser("piyo", "社会", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userRepository.get()
            assert.deepEqual(users.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    hp: u.hitPoint.current,
                    mp: u.magicPoint.current
                }
            }), [
                {id: "a", name:"hoge", hp: 10, mp: 10},
                {id: "b", name:"fuga", hp: 1, mp:10},
                {id: "c", name:"piyo", hp: 5000, mp: 0}
            ]);

        });

    });

    describe("#castToUser", () => {
        const cache = new NodeCache();
        cache.set("slack_user_cache", [
            {"id": "a", "name": "hoge", is_bot: false},
            {"id": "b", "name": "fuga", is_bot: false},
            {"id": "c", "name": "piyo", is_bot: false}
        ]);
        const robot = new MockRobot(new MockBrain({
            HUBOT_NODE_QUEST_USERS: {
                "a": {
                    id: "a",
                    hitPoint: 10,
                    magicPoint: 10,
                },
                "b": {
                    id: "b",
                    hitPoint: 1,
                    magicPoint: 10,
                }
            }
        }));
        const userRepository = new UserRepository(robot, cache);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const darkGame = new DarkGame(
            userRepository,
            bitnessRepository
        );

        it("should cast to user and decrease hp", async () => {
            await darkGame.loadUsers()
            const actual = darkGame.castToUser("hoge", "fuga", "メラ", (message) => {});
            const users = userRepository.get()
            assert.deepEqual(users.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    hp: u.hitPoint.current,
                    mp: u.magicPoint.current
                }
            }), [
                {id: "a", name:"hoge", hp: 10, mp: 9},
                {id: "b", name:"fuga", hp: 0, mp:10},
                {id: "c", name:"piyo", hp: 5000, mp:1000}
            ]);
        });
    });

    describe("#cureAll", () => {
        const cache = new NodeCache();
        cache.set("slack_user_cache", [
            {"id": "a", "name": "hoge", is_bot: false},
            {"id": "b", "name": "fuga", is_bot: false},
            {"id": "c", "name": "piyo", is_bot: false}
        ]);
        const robot = new MockRobot(new MockBrain({
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
        }));
        const userRepository = new UserRepository(robot, cache);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const darkGame = new DarkGame(
            userRepository,
            bitnessRepository
        );

        it("should cure all users", async () => {
            await darkGame.loadUsers()
            const actual = darkGame.cureAll();
            const users = userRepository.get()
            assert.deepEqual(users.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    hp: u.hitPoint.current,
                    mp: u.magicPoint.current
                }
            }), [
                {id: "a", name:"hoge", hp: 5000, mp:10},
                {id: "b", name:"fuga", hp: 5000, mp:10},
                {id: "c", name:"piyo", hp: 5000, mp:1000}
            ]);
        });
    });

    describe("#cureMindAll", () => {
        const cache = new NodeCache();
        cache.set("slack_user_cache", [
            {"id": "a", "name": "hoge", is_bot: false},
            {"id": "b", "name": "fuga", is_bot: false},
            {"id": "c", "name": "piyo", is_bot: false}
        ]);
        const robot = new MockRobot(new MockBrain({
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
        }));
        const userRepository = new UserRepository(robot, cache);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const darkGame = new DarkGame(
            userRepository,
            bitnessRepository
        );

        it("should cure all user's mp", async () => {
            await darkGame.loadUsers()
            const actual = darkGame.cureMindAll();
            const users = userRepository.get()
            assert.deepEqual(users.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    hp: u.hitPoint.current,
                    mp: u.magicPoint.current
                }
            }), [
                {id: "a", name:"hoge", hp: 10, mp:1000},
                {id: "b", name:"fuga", hp: 0, mp:1000},
                {id: "c", name:"piyo", hp: 5000, mp:1000}
            ]);
        });
    });

    describe("#summon", () => {
        class MockTargetManager {
            get(callback) {
                return callback([]);
            }
        }
        const cache = new NodeCache();
        cache.set("slack_user_cache", [
            {"id": "a", "name": "hoge", is_bot: false},
            {"id": "b", "name": "fuga", is_bot: false},
            {"id": "c", "name": "piyo", is_bot: false}
        ]);
        const robot = new MockRobot(new MockBrain());
        const darkGame = new DarkGame(
            new UserRepository(robot, cache),
            new BitnessRepository(robot.brain)
        );

        it("should summon a monster", async () => {
            const monsterName = "憲兵";
            await darkGame.loadUsers()
            darkGame.summon(new MockTargetManager(), (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0)
            });
            const monster = darkGame.userManager.getByName(monsterName);
            assert.notEqual(monster, null);
            assert.equal(monster.name, monsterName);
        });
    });

});
