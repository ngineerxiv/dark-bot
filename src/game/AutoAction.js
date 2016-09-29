class AutoAttackAction {
    constructor(targets, battleService, messageSender) {
        this.targets = targets;
        this.battleService = battleService;
        this.messageSender = messageSender;
    }

    act(user) {
        this.targets = this.targets.filter((u) => !u.isDead())
        const idx = Math.floor(Math.random() * this.targets.length)
        const target = this.targets[idx];
        const result = this.battleService.attack(actor, target);
        next(user);
        return this.messageSender(result.messages.join("\n"));
    }

    next(user) {
        setTimeout(() => this.act(user), 1000);
    }
}

module.exports = {
    AutoAction: AutoAction,
    ActionPolicy: ActionPolicy
}
