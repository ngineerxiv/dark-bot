"use strict";

class UserRepositoryOnSlack {
    constructor(slackAdapter) {
        this.adapter = slackAdapter;
    }

    get() {
        return this.adapter.client.users.map((userId, idx, self) => self[userId]);
    }
}

module.exports = UserRepositoryOnSlack;
