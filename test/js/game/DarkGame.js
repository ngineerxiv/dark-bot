"use strict"
const assert    = require("power-assert");
const NodeQuest = require("node-quest");
const config = require("config");
const HUBOT_NODE_QUEST_USERS  = config.brainKeys.hubotNodeQuestUsers;
const DarkGame  = require("../../../src/game/DarkGame.js");
const lang      = require("../../../src/game/lang/Ja.js");
const MockBrain = require("../mock/Brain.js");
const MockRobot = require("../mock/Robot.js");
const UserRepository    = require("../../../src/game/UserRepositoryOnHubot.js");
const BitnessRepository = require("../../../src/game/BitnessRepository.js");
const SlackUserRepository = require("../../../src/game/SlackUserRepository");

describe('DarkGame', () => {
    describe("#loadUsers", () => {
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
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });

        const userRepository = new UserRepository(robot);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const slackUserRepository = new SlackUserRepository(robot.adapter);
        const darkGame = new DarkGame(
            slackUserRepository,
            userRepository,
            bitnessRepository
        );

        it("should load users from repository", () => {
            const actual = darkGame.loadUsers();
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
            }), {
                "a": {"id": "a", "name": "hoge"},
                "b": {"id": "b", "name": "fuga"},
                "c": {"id": "c", "name": "piyo"}
            });
            const userRepository = new UserRepository(robot);
            const bitnessRepository = new BitnessRepository(robot.brain);
            const slackUserRepository = new SlackUserRepository(robot.adapter);
            return new DarkGame(
                slackUserRepository,
                userRepository,
                bitnessRepository
            );
        };

        it("should attack to user and decrease hp", () => {
            const darkGame = initGame();
            darkGame.loadUsers()
            const actual = darkGame.attackToUser("hoge", "fuga", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userManager.getUsers()
            assert.equal(users.length, 3);
            // FIXME 命中率とかの関連でたまに落ちるのでHPが減ってるテストが書けない
        });

        it("should decrease hit point to 0 when user attacks 神父 and countered to user", () => {
            const darkGame = initGame();
            darkGame.loadUsers();
            const actual = darkGame.attackToUser("piyo", "神父", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userManager.getUsers()
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

        it("should decrease magic point to 0 when user attacks 社会 and countered to user", () => {
            const darkGame = initGame();
            darkGame.loadUsers();
            const actual = darkGame.attackToUser("piyo", "社会", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const users = darkGame.userManager.getUsers()
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

        it("user's hit point should be saved on damaged", () => {
            const darkGame = initGame();
            darkGame.loadUsers();
            const before = darkGame.userManager.userRepository.getStatesById("c");
            const actual = darkGame.attackToUser("piyo", "神父", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const user = darkGame.userManager.userRepository.getStatesById("c");
            assert.equal(user.hitPoint.current, 0);
        });

        it("user's magic point should be saved on damaged", () => {
            const darkGame = initGame();
            darkGame.loadUsers();
            const before = darkGame.userManager.userRepository.getStatesById("c");
            const actual = darkGame.attackToUser("hoge", "社会", (message) => {
                assert.notEqual(message, undefined);
                assert.ok(message.length > 0);
            });
            const user = darkGame.userManager.userRepository.getStatesById("a");
            assert.equal(user.magicPoint.current, 0);
        });
    });

    describe("#castToUser", () => {
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
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });
        const userRepository = new UserRepository(robot);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const slackUserRepository = new SlackUserRepository(robot.adapter);
        const darkGame = new DarkGame(
            slackUserRepository,
            userRepository,
            bitnessRepository
        );

        it("should cast to user and decrease hp", () => {
            darkGame.loadUsers()
            const actual = darkGame.castToUser("hoge", "fuga", "メラ", (message) => {});
            const users = darkGame.userManager.getUsers()
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
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });
        const userRepository = new UserRepository(robot);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const slackUserRepository = new SlackUserRepository(robot.adapter);
        const darkGame = new DarkGame(
            slackUserRepository,
            userRepository,
            bitnessRepository
        );

        it("should cure all users", () => {
            darkGame.loadUsers()
            const actual = darkGame.cureAll();
            const users = darkGame.userManager.getUsers()
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
        }), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });
        const userRepository = new UserRepository(robot);
        const bitnessRepository = new BitnessRepository(robot.brain);
        const slackUserRepository = new SlackUserRepository(robot.adapter);
        const darkGame = new DarkGame(
            slackUserRepository,
            userRepository,
            bitnessRepository
        );

        it("should cure all user's mp", () => {
            darkGame.loadUsers()
            const actual = darkGame.cureMindAll();
            const users = darkGame.userManager.getUsers()
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
        const robot = new MockRobot(new MockBrain(), {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        });
        const darkGame = new DarkGame(
            new SlackUserRepository(robot.adapter),
            new UserRepository(robot),
            new BitnessRepository(robot.brain)
        );

        it("should summon a monster", () => {
            const monsterName = "憲兵";
            darkGame.loadUsers()
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
