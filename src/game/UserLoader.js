"use strict"

class UserLoader {
    constructor(game, userRepository, monsterRepository, spellRepository) {
        this.game = game;
        this.userRepository = userRepository;
        this.monsterRepository = monsterRepository;
        this.spellRepository = spellRepository;
    }

    loadUsers() {
        const users = this.userRepository.get();
        const monsters = this.monsterRepository.get();
        users.forEach((u) => {
            if (!this.userRepository.isBot(u.id)) {
                u.spells = this.spellRepository.get();
            }
            u.hitPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
            u.magicPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
        });
        this.game.setUsers(users.concat(monsters));        
        return this.game;        
    }
}

module.exports = UserLoader;
