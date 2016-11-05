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
        constructor() {
            this.users = {};
        }

        set(k, v) {
            this.users[k] = v;
        }

        get(k) {
            return this.users[k];
        }
    }

    it("should save and get", () => {
        const users = {
            "a": {"id": "a", "name": "hoge"},
            "b": {"id": "b", "name": "fuga"},
            "c": {"id": "c", "name": "piyo"}
        };
        const r = new UserRepository(new MockBrain());
        r.load([
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
        ], new JobRepository(), new WeaponRepository());
        const actual = r.get();
        assert.equal(Object.keys(actual).length, 2);
    })


});

