const SlackUser = require("./SlackUser");

class SlackUserRepository {
    constructor(adapter) {
        this.adapter = adapter;
    }

    load() {
        const idToSlackUser = this.adapter.client ? this.adapter.client.users : {}
        return Object.keys(idToSlackUser).map((id) => new SlackUser(
            id,
            idToSlackUser[id].name,
            (idToSlackUser[id].is_bot || false)
        ));
    }
}

module.exports = SlackUserRepository;
