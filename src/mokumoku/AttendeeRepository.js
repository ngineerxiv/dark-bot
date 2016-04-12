"use strict"

class AttendeeRepositoryOnHubotBrain {
    constructor(brain, saveKey) {
        this.brain = brain;
        this.saveKey = saveKey;
    }

    add(userName, event) {
        const attendees = this._load();
        const key       = this._tokey(event);
        const target    = attendees[key] ? attendees[key] : [];
        const old       = target;
        const changed   = old.indexOf(userName) === -1;
        target.push(userName);
        attendees[key] = target.filter((x, i, self) => self.indexOf(x) === i);
        this._save(attendees);
        return {
            after : attendees,
            changed: changed
        };
    }

    remove(userName, event) {
        const attendees = this._load();
        const key       = this._tokey(event);
        const target    = attendees[key] ? attendees[key] : [];
        const old       = target;
        const changed   = old.indexOf(userName) !== -1
        attendees[key] = target.filter((x) => x !== userName);
        this._save(attendees);
        return {
            after : attendees,
            changed: changed
        };
    }

    list(event) {
        const key       = this._tokey(event);
        const attendees = this._load();
        const list      = attendees[key];
        return list ? list : [];
    }

    _tokey(event) {
        const d = new Date(event.startAt);
        return `${d.getYear()}-${d.getMonth()}-${d.getDate()}`;
    }

    _save(attendees) {
        return this.brain.set(this.saveKey, attendees);
    }

    _load() {
        const tmp = this.brain.get(this.saveKey);
        return tmp ? tmp : {};
    }
}

module.exports = AttendeeRepositoryOnHubotBrain;
