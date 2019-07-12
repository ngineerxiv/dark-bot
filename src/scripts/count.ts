// Description:
//   盛り上がってるチャンネルを見つける
//
// Notes:
//   盛り上がり
// Commands:
//   hubot excited yesterday
//   hubot excited today

import * as hubot from "hubot";

type HubotRobot = hubot.Robot<any>;
type HubotResponse = hubot.Response<HubotRobot>;

type MessageCounter = Map<string, number>;
enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  TuesDay = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}
function todaysCounter(
  date: Date,
  dayOfWeekToCounter: Map<DayOfWeek, MessageCounter>
): MessageCounter {
  const c = dayOfWeekToCounter.get(date.getDay());
  if (c === undefined) {
    return new Map();
  }
  return c;
}
class Counter {
  private dayOfWeekToCounter: Map<DayOfWeek, MessageCounter>;

  constructor(dayOfWeekToCounter: Map<DayOfWeek, MessageCounter> = new Map()) {
    this.dayOfWeekToCounter = dayOfWeekToCounter;
  }

  clear(date: Date): void {
    this.dayOfWeekToCounter.set(date.getDay(), new Map());
  }

  countUp(date: Date, channel: string): void {
    let c = this.dayOfWeekToCounter.get(date.getDay());
    if (c === undefined) {
      c = new Map();
    }
    const n = c.get(channel);
    c.set(channel, n + 1);
    this.dayOfWeekToCounter.set(date.getDay(), c);
  }

  get(dayOfWeek: DayOfWeek): MessageCounter {
    const c = this.dayOfWeekToCounter.get(dayOfWeek);
    if (c === undefined) {
      return new Map();
    }
    return c;
  }
}

function yesterday(date: Date): DayOfWeek {
  return (date.getDay() - 1 + 7) % 7;
}

function today(date: Date): DayOfWeek {
  return date.getDay();
}

module.exports = (robot: HubotRobot) => {
  const counter: Counter = new Counter();
  // TODO clear cron

  robot.respond(/EXCITED YESTERDAY$/i, (msg: HubotResponse) => {
    const dayOfWeek = yesterday(new Date());
    const c = counter.get(dayOfWeek);

    // TODO みせかた
  });

  robot.respond(/EXCITED TODAY$/i, (msg: HubotResponse) => {
    const dayOfWeek = today(new Date());
    const c = counter.get(dayOfWeek);

    // TODO みせかた
  });

  robot.hear(/(.+)/i, function(msg: any) {
    const envelope: { room: string } = msg.envelope;
    const room = envelope.room;
    if (room === undefined) {
      return;
    }
    counter.countUp(new Date(), room);
  });
};
