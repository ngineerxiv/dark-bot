"use strict"

class AutoAttackAction {
    constructor(targetManager, battleService, messageSender, userManager) {
        this.targetManager = targetManager;
        this.battleService = battleService;
        this.messageSender = messageSender;
        this.userManager   = userManager;
    }

    allowed() {
        return true;
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
            const users = this.userManager.getAllUsers();
            const target = users.filter((u) => {
                return u.id === targetId && !u.isBot && !u.isDead()
            }).pop();

            if (!target) {
                this.next(user);
                return;
            }
            const result = this.battleService.attack(user, target);
            this.next(user);
            return this.messageSender(result.messages.join("\n"));
        });
    }

    next(user) {
        setTimeout(() => this.act(user), 2000);
    }
}

module.exports = AutoAttackAction;
