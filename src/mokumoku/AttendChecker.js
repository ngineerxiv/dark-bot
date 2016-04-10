"use strict";

class AttendChecker {
    constructor(attendWords, notAttendWords, denial) {
        this.attendWords = attendWords;
        this.notAttendWords = notAttendWords;
        this.denialWord = denial;
    }

    check(tokens) {
        const isAttendSimple  = tokens.reduce((prev, cur) => {
            return prev || this.attendWords.indexOf(cur) !== -1
        }, false)

        const notAttendSimple = tokens.reduce((prev, cur) => {
            return prev || this.notAttendWords.indexOf(cur) !== -1
        }, false)

        const notWord = tokens.reduce((prev, cur) => {
            return prev || (cur === this.denialWord)
        }, false)

        return {
            ambiguous: isAttendSimple && notAttendSimple,
            isAttend: (isAttendSimple && !notWord) || (notAttendSimple && notWord),
            notAttend: (isAttendSimple && notWord) || (notAttendSimple && !notWord)
        };
    }
}

module.exports = AttendChecker;
