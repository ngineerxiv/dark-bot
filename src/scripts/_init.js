// Description:
//   for initialize
//


"use strict";

module.exports = function(robot) {
    robot.logger.info(`node env: ${process.env.NODE_ENV}`);
    robot.logger.info(`server port: ${process.env.PORT}`);

    robot.error((err, res) => {
        robot.logger.error(`Error: ${err}`);
        robot.logger.error(`res: ${res}`);
        res && res.reply(err);
    });
};
