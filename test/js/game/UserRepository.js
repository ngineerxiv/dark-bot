"use strict"
const assert = require("power-assert");

const UserRepository = require("../../../src/game/UserRepository.js");
const DarkQuest = require("node-quest");
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const JobRepository   = require("../../../src/game/JobRepository.js");
const WeaponRepository = require("../../../src/game/WeaponRepository.js");

describe('UserRepository', () => {
    class MockBrain {
        constructor(users) {
            this.users = users || {};
        }

        set(k, v) {
            this.users[k] = v;
        }

        get(k) {
            return this.users[k];
        }
    }

    it("should load", () => {
        const mockRobot = {
            brain: new MockBrain(),
            adapter: {
                client: {
                    users: {
                        "a": {"id": "a", "name": "hoge"},
                        "b": {"id": "b", "name": "fuga"},
                        "c": {"id": "c", "name": "piyo"}
                    }
                }
            }
        };

        const r = new UserRepository(mockRobot, [
            {
                id: "a",
                hitPoint: {
                    current:10
                },
                magicPoint: {
                    current: 10
                }
            },
            {
                id: "b",
                hitPoint: {
                    current: 0
                },
                magicPoint: {
                    current: 10
                }
            }
        ]);
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
            {id: "a", name:"hoge", hp: 5000, mp:1000},
            {id: "b", name:"fuga", hp: 5000, mp:1000},
            {id: "c", name:"piyo", hp: 5000, mp:1000}
        ]);

    });

    it("should save and get", () => {
        const mockRobot = {
            brain: new MockBrain(),
            adapter: {
                client: {
                    users: {
                        "a": {"id": "a", "name": "hoge"},
                        "b": {"id": "b", "name": "fuga"},
                        "c": {"id": "c", "name": "piyo"}
                    }
                }
            }
        };

        const r = new UserRepository(mockRobot, [
            {
                id: "a",
                hitPoint: {
                    current:10
                },
                magicPoint: {
                    current: 10
                }
            },
            {
                id: "b",
                hitPoint: {
                    current: 0
                },
                magicPoint: {
                    current: 10
                }
            }
        ]);
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
            {id: "a", name:"hoge", hp: 10, mp:10},
            {id: "b", name:"fuga", hp: 0, mp:10},
            {id: "c", name:"piyo", hp: 5000, mp:1000}
        ]);
    })


});

