var request = require("request");

var NegativeWordsRepositoryWithHttp = function(url) {
    this.get = function(callback, errorCallback) {
        request(url, function(err, res, body) {
            err && errorCallback(err);
            var json = JSON.parse(body);
            callback(json);
        });
    };
};

module.exports = NegativeWordsRepositoryWithHttp;
