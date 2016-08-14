"use strict"

const Game      = require("node-quest");
const Feedback  = Game.Feedback;
const FeedbackResult = Game.FeedbackResult;

class DrainFeedback extends Feedback {
    apply(castResult) {
        return (actor) => {
            const result = actor.cured(castResult.attack.value);
            return new FeedbackResult(0, result.value);
        }
    }
}

module.exports = {
    DrainFeedback: DrainFeedback
}
