// Description
//   hubot scripts for diagnosing dark hubot
//
// Commands:
//   hubot ping - Reply with ...
//   hubot echo <text> - Reply back with <text>
//   hubot time - Reply with current time
//

import * as hubot from "hubot";
import { Url } from "../lib/Url";

type HubotRobot = hubot.Robot<any>;

module.exports = (robot: HubotRobot) => {
  robot.respond(/PING$/i, msg =>
    msg.send(Url.apply("http://yamiga.waka.ru.com/images/ping.jpg"))
  );

  robot.respond(/ECHO (.*)$/i, msg => msg.send(msg.match[1]));

  robot.respond(/TIME$/i, msg => msg.send(`Server time is: ${new Date()}`));
};
