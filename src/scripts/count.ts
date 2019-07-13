// Description:
//   盛り上がってるチャンネルを見つける
//
// Notes:
//   盛り上がり
// Commands:
//   hubot excited yesterday
//   hubot excited today

import * as hubot from "hubot";
import { CronJob } from "cron";
import {
  Counter,
  MessageCounter,
  yesterday,
  today
} from "../counter/MessageCounter";

type HubotRobot = hubot.Robot<any>;
type HubotResponse = hubot.Response<HubotRobot>;

function view(counter: MessageCounter): string {
  const sorted = Array.from(counter.entries()).sort(([, x], [, y]) => y - x);
  const s = sorted
    .map(tuple => {
      const c = tuple[0];
      const n = tuple[1];
      return `#${c} -> ${n}`;
    })
    .join("\n");
  return `盛り上がってるチャンネルはここだ！\nチャンネル -> 発言数\n${s}`;
}

module.exports = (robot: HubotRobot) => {
  // TODO save not on memory
  const counter: Counter = new Counter();
  new CronJob("5 0 * * *", () => {
    counter.clear(new Date());
  });

  robot.respond(/EXCITED YESTERDAY$/i, (msg: HubotResponse) => {
    const dayOfWeek = yesterday(new Date());
    const c = counter.get(dayOfWeek);
    msg.send(view(c));
  });

  robot.respond(/EXCITED TODAY$/i, (msg: HubotResponse) => {
    const dayOfWeek = today(new Date());
    const c = counter.get(dayOfWeek);
    msg.send(view(c));
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
