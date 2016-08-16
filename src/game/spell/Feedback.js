"use strict"

const Game      = require("node-quest");
const Feedback  = Game.Feedback;
const FeedbackResult = Game.FeedbackResult;

class DrainFeedback extends Feedback {
    apply(castResult) {
        return (actor) => {
            const result = actor.cured(castResult.attack.value || 0);
            return new FeedbackResult(0, result.value);
        }
    }
}

class MagicDrainFeedback extends Feedback {
    apply(castResult) {
        return (actor) => {
            const result = actor.mindCured(castResult.mindAttack.value || 0);
            return new FeedbackResult(0, 0, 0,result.value);
        }
    }
}

module.exports = {
    DrainFeedback: DrainFeedback,
    MagicDrainFeedback: MagicDrainFeedback
}
