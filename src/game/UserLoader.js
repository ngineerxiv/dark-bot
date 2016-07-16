"use strict"

const DarkQuest = require("node-quest");
const Equipment = DarkQuest.Equipment;
const Parameter = DarkQuest.Parameter;
const Weapon    = DarkQuest.Weapon;
const User      = DarkQuest.User;
const Status    = DarkQuest.Status;
const HitRate   = DarkQuest.HitRate;
const HitPoint  = DarkQuest.HitPoint;
const MagicPoint= DarkQuest.MagicPoint;
const Critical  = DarkQuest.Critical;

const MAX_HIT_POINT   = 3000;
const MAX_MAGIC_POINT = 1000;

class UserLoader {
    constructor(userRepository, spellRepository, jobRepository) {
        this.userRepository     = userRepository;
        this.spellRepository    = spellRepository;
        this.jobRepository      = jobRepository;
    }

    load() {
        const allUsers      = this.userRepository.getAllUsers();
        const savedUsers    = this.userRepository.get();
        return Object.keys(allUsers).map((id) => {
            const user  = allUsers[id];
            const saved = savedUsers[id];
            const hitPoint      = (saved && !isNaN(saved.hitPoint)) ? saved.hitPoint : MAX_HIT_POINT;
            const magicPoint    = (saved && !isNaN(saved.magicPoint)) ? saved.magicPoint : MAX_MAGIC_POINT;
            const job           = saved ? this.jobRepository.getByName(saved.jobName) : null;
            let spells = [];

            if (!this.userRepository.isBot(id)) {
                spells = this.spellRepository.get();
            }
            return new User(
                    user.id, 
                    user.name, 
                    new HitPoint(hitPoint, MAX_HIT_POINT), 
                    new MagicPoint(magicPoint, MAX_MAGIC_POINT), 
                    new Equipment(new Weapon(100, 50, new HitRate(90), new Critical(10))),
                    new Parameter(100, 50, 200, 0),
                    spells,
                    new Status(),
                    job
                    );
        });
    }
}

module.exports = UserLoader;
