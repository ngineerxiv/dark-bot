"use strict"

const request = require("request");

class NegativeWordsRepositoryWithHttp  {
    constructor(url) {
        this.url = url;
    }

    get(callback, errorCallback) {
        request(this.url, (err, res, body) => {
            err && errorCallback(err);
            callback(JSON.parse(body));
        });
    };
};

module.exports = NegativeWordsRepositoryWithHttp;
