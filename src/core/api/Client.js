"use strict"

const request = require("request")
class ApiClient {
    constructor(url, logger) {
        this.url = url;
        this.logger = logger;
    }

    request(callback, errorCallback) {
        request(this.url, (err, res, body) => {
            if( err ) {
                this.logger.error(err);
                errorCallback(err);
            } else {
                callback(res, body);
            }
        });
    }
}

module.exports = ApiClient;
