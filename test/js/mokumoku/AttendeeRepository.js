"use strict"
const assert = require("power-assert");

const AttendeeRepository = require("../../../src/mokumoku/AttendeeRepository.js");
const Brain = require("../mock/Brain.js");

describe('AttendeeRepository', () => {
    describe("#list", () => {
        it("should return empty list when no one are added", () => {
            const rep = new AttendeeRepository(new Brain(), "hoge")
            const event = {
                title: "title",
                description: "desc",
                startAt: "2016-04-23T05:00:00.000",
                location: "loc"
            }
            assert(rep.list(event).length === 0);
        })

        it("should return a list including an attendee when one is added", () => {
            const rep = new AttendeeRepository(new Brain(), "hoge")
            const event = {
                title: "title",
                description: "desc",
                startAt: "2016-04-23T05:00:00.000",
                location: "loc"
            }
            rep.add("user", event)
            assert(rep.list(event).indexOf("user") === 0);
        });

        it("should return an empty list when one is added but the target event is different", () => {
            const rep = new AttendeeRepository(new Brain(), "hoge")
            const event = {
                title: "title",
                description: "desc",
                startAt: "2016-04-23T05:00:00.000",
                location: "loc"
            }
            const other = {
                title: "title",
                description: "desc",
                startAt: "2016-04-09T05:00:00.000",
                location: "loc"
            }

            rep.add("user", event)
            assert(rep.list(other).length === 0);
        });

        it("should return an empty list when one is added and the one is removed", () => {
            const rep = new AttendeeRepository(new Brain(), "hoge")
            const event = {
                title: "title",
                description: "desc",
                startAt: "2016-04-23T05:00:00.000",
                location: "loc"
            }
            rep.add("user", event);
            rep.remove("user", event);
            assert(rep.list(event).length === 0);
        });
    });
})
