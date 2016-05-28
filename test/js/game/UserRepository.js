"use strict"
const assert = require("power-assert");

const UserRepository = require("../../../src/game/UserRepository.js");
const DarkQuest = require("node-quest");
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;


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
        const r = new UserRepository(new MockBrain(), users);
        r.save([
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
        const actual = r.get();
        assert.equal(actual.length, 3);
        const vals = actual.map((u) => [
            u.id,
            u.name,
            u.hitPoint.current
        ]);
        assert.deepEqual(vals, [
                ["a", "hoge", 10],
                ["b", "fuga", 0],
                ["c", "piyo", 3000]
        ]);
    })


});

