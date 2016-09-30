class AutoAttackAction {
    constructor(targetManager, battleService, messageSender, game) {
        this.targetManager = targetManager;
        this.battleService = battleService;
        this.messageSender = messageSender;
        this.game = game;
    }

    allowed() {
        const now = new Date();
        const currentHour = now.getHours();
        return 9 <= currentHour && currentHour < 23;
    }

    act(user) {
        if (user.isDead() || !this.allowed()) {
            return;
        }
        this.targetManager.get((targets) => {
            const idx = Math.floor(Math.random() * targets.length)
            const targetId = targets[idx];
            const target = this.game.users.filter((u) => {
                return u.id === targetId && u.name !== "dark"
            }).pop();
            if (!target || target.isDead()) {
                this.next(user);
                return;
            }
            const result = this.battleService.attack(user, target);
            target.isDead() && this.targetManager.kick(target);
            this.next(user);
            return this.messageSender(result.messages.join("\n"));
        });
    }

    next(user) {
        setTimeout(() => this.act(user), 2000);
    }
}

module.exports = AutoAttackAction;
