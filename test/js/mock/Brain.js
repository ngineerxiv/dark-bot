"use strict"

class Brain {
    constructor(data) {
        this.data = data ? data : {};
    }
    get(key) {
        return this.data[key];
    }

    set(key, val) {
        this.data[key] = val;
        return this.data;
    }
}

module.exports = Brain;
