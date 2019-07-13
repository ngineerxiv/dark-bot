enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  TuesDay = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export type MessageCounter = Map<string, number>;

export class Counter {
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
    let n = c.get(channel);
    if (n === undefined) {
      n = 0;
    }
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

export function yesterday(date: Date): DayOfWeek {
  return (date.getDay() - 1 + 7) % 7;
}

export function today(date: Date): DayOfWeek {
  return date.getDay();
}
