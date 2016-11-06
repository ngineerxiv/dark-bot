"use strict"

class UserManager {
    constructor(userRepository, spellRepository, jobRepository, weaponRepository, monsterRepository) {
        this.userRepository     = userRepository;
        this.spellRepository    = spellRepository;
        this.jobRepository      = jobRepository;
        this.weaponRepository   = weaponRepository;
        this.monsterRepository  = monsterRepository;
    }

    getAllUsers() {
        const allUsers = this.userRepository.get();
        const monsters = this.monsterRepository.get();
        return allUsers.concat(monsters);
    }

    getByName(name) {
        const users = this.getAllUsers()
        const targets = users.filter((u) => u.name === name);
        return targets.length === 0 ? null : targets.pop();
    }

    load() {
        // TODO repositoryのメソッドにrepository渡すのなんか違う気がしている
        const users = this.userRepository.load(this.jobRepository, this.weaponRepository);
        users.forEach((u) => {
            if (!u.isBot) {
                u.spells = this.spellRepository.get();
            }
        });
        return users;
    }

    save() {
        this.userRepository.save();
    }
}

module.exports = UserManager;
