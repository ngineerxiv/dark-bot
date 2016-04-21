var parseString = require('xml2js').parseString;
var request     = require('request');

var NlpParsing = function(url, token, logger) {
    this.parse = function(string, callback) {
        var str = encodeURIComponent(string);
        request.get({
            url: url + "?appid=" + token + "&sentence=" + str
        }, function(err, res, body) {
            err && logger.error(err);
            parseString(body, function(e, r) {
                e && logger.error(e);
                callback(r);
            });
        });
    };
};

module.exports = NlpParsing;
