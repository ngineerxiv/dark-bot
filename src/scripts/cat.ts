// Description:
//   Cat Images
//
// Notes:
//   Cat
// Commands:
//   hubot cat - 猫(*´ω｀*)

import * as hubot from "hubot";

type HubotRobot = hubot.Robot<any>;
type HubotResponse = hubot.Response<HubotRobot>;

module.exports = (robot: HubotRobot) => {
  robot.respond(/cat(\s*)$/i, (msg: HubotResponse) => {
    const query = Math.random() > 0.5 ? "猫" : "cat";
    const message = msg.message;
    message.text = `${robot.name} image ${query}`;
  });

  return robot.respond(/cat (.+)/i, function(msg: HubotResponse) {
    const query = (Math.random() > 0.5 ? "猫" : "cat") + " " + msg.match[1];
    const message = msg.message;
    message.text = `${robot.name} image ${query}`;
  });
};
