// Description:
//   for initialize
//


"use strict";

const config = require("config");
const Raven = require('raven'); // TODO wrapper

function isProduction() {
    return process.env.NODE_ENV === 'production';
}

function sentryIsSet() {
    return config.sentry !== null;
}

module.exports = function(robot) {
    robot.logger.info(`node env: ${process.env.NODE_ENV}`);
    robot.logger.info(`server port: ${process.env.PORT}`);
    if (sentryIsSet()) {
        Raven.config(config.sentry).install();
    }

    robot.error((err, res) => {
        robot.logger.error(`Error: ${err}`);
        robot.logger.error(`res: ${res}`);
        res && res.reply(err);
        if (sentryIsSet()) {
            Raven.captureException(err);
        }
    });
};
