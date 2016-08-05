// Description:
//   Cat Images
//
// Notes:
//   Cat
// Commands:
//   hubot cat - 猫(*´ω｀*)

"use strict";

module.exports = function(robot) {
  robot.respond(/cat(\s*)$/i, (msg) => {
    const query = (Math.random() > 0.5 ? "猫" : "cat");
    const message = msg.message;
    message.text = `${robot.name} image ${query}`
  });

  return robot.respond(/cat (.+)/i, function(msg) {
    const query = (Math.random() > 0.5 ? "猫" : "cat") + " " + msg.match[1];
    const message = msg.message;
    message.text = `${robot.name} image ${query}`
  });
};
