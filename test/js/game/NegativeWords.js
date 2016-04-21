"use strict"
const assert = require("power-assert");

const NegativeWords = require("../../../src/game/NegativeWords.js");

describe('NegativeWords#countNegativeWords', () => {
    class MockNegativeWordsRepository {
        get(callback, errorCallback) {
            // do nothing
        }
    }
    let negativeWords = new NegativeWords(
        new MockNegativeWordsRepository(),
        console,
        ["ほげ"]
    );

    it("should be 1 when tokens include negative word", () => {
        assert.equal(negativeWords.countNegativeWords(["ほげ"]), 1);
    });

    it("should be 0 when tokens is undefined", () => {
        assert.equal(negativeWords.countNegativeWords(undefined), 0);
    });

    it("should be 0 when tokens has guess word", () => {
        let negativeWords = new NegativeWords(
            new MockNegativeWordsRepository(),
            console,
            ["つらい"]
        );
        assert.equal(negativeWords.countNegativeWords(["つらい", "そう"]), 0);
    });

    it("should be 0 when tokens has denial word", () => {
        let negativeWords = new NegativeWords(
            new MockNegativeWordsRepository(),
            console,
            ["つらい"]
        );
        assert.equal(negativeWords.countNegativeWords(["つらい", "ない"]), 0);
    });

    it("should be 1 when tokens has '帰れない'", () => {
        assert.equal(negativeWords.countNegativeWords(["帰れる", "ない"]), 1);
    });

    it("should be 1 when tokens has 'かえれない'", () => {
        assert.equal(negativeWords.countNegativeWords(["かえれる", "ない"]), 1);
    });
})

describe("NegativeWords#updateNegativeWords", () => {
    class MockNegativeWordsRepositoryWithUpdate {
        get(callback, errorCallback) {
            callback({negativeWords:["ほげ"]});
        }
    }

    let negativeWords = new NegativeWords(
        new MockNegativeWordsRepositoryWithUpdate(),
        console,
        ["ほげ"]
    );


    it("should update negative words when countNegativeWords is called", () => {
        negativeWords.countNegativeWords(["ほげ"])
        assert.notStrictEqual(negativeWords.negativeWords, ["ほげ"]);
    });


});

