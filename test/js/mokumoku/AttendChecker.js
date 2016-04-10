"use strict"
const assert = require("power-assert");

const AttendChecker = require("../../../src/mokumoku/AttendChecker.js");

describe('AttendChecker', () => {
    describe("#check", () => {
        it("should return true as isAttend when attend word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["参加"]);
            assert.equal(result.isAttend, true);
        })

        it("should return false as notAttend when attend word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["参加"]);
            assert.equal(result.notAttend, false);
        })

        it("should return false as isAttend when denial word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["参加", "ない"]);
            assert.equal(result.isAttend, false);
        })

        it("should return true as notAttend when not attend word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["不参加"]);
            assert.equal(result.notAttend, true);
        })

        it("should return false as isAttend when not attend word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["不参加"]);
            assert.equal(result.isAttend, false);
        })

        it("should return false as notAttend when denial word is included", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["不参加", "ない"]);
            assert.equal(result.notAttend, false);
        })


        it("should be ambiguous when attendWords and notAttendWords are included at the same time", () => {
            const a = new AttendChecker(["参加"], ["不参加"], "ない");
            const result = a.check(["参加","不参加"]);
            assert.equal(result.ambiguous, true);
        });
    });
})
