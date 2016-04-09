"use strict"

class EventServer {
    constructor(apiClient, attendeeRepository) {
        this.events = [];
        this.apiClient = apiClient;
        this.attendeeRepository = attendeeRepository;
        this.update();
    }

    attend(userName, event) {
        this.update();
        return this.attendeeRepository.add(userName, event);
    }

    leave(userName, event) {
        this.update();
        return this.attendeeRepository.remove(userName, event);
    }

    latestEvent() {
        this.update();
        if (this.events.length !== 0) {
            return this.events[0];
        } else {
            return null;
        }
    }

    attendees(event) {
        return this.attendeeRepository.list(event);
    }

    update() {
        this.apiClient.request((res, body) => {
            this.events = JSON.parse(body).sort((a, b) => {
                let d1 = new Date(a.startAt);
                let d2 = new Date(b.startAt);
                if(d1.getTime() < d2.getTime()) {
                    return -1;
                } else if (d1.getTime() === d2.getTime()) {
                    return 0;
                } else {
                    return 1;
                }
            })
        }, (error) => {});
    }
}

module.exports = EventServer;
