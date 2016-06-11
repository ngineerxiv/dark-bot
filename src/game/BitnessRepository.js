"use strict"

const HUBOT_NODE_QUEST_BITNESS = "HUBOT_NODE_QUEST_BITNESS";

class BitnessRepositoryOnRobot {
    constructor(brain) {
        this.brain = brain;
    }

    load() {
        this.data = this.brain.get(HUBOT_NODE_QUEST_BITNESS) || {};
    }

    increase(key, val) {
        const value = this.data[key] || 0;
        this.data[key] = value + val;
        this.save();
    }

    decrease(key, val) {
        const value = this.data[key] || 0;
        this.data[key] = Math.max(value - val, 0);
        this.save();
    }

    get(key) {
        return this.data[key] || 0;
    }

    save() {
        this.brain.set(HUBOT_NODE_QUEST_BITNESS, this.data);
    }
}

module.exports = BitnessRepositoryOnRobot;
