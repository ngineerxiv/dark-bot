class SlackUser {
    constructor(slackId, name, isBot) {
        this.id = slackId;
        this.name = name;
        this.isBot = isBot;
    }
}

module.exports = SlackUser;
