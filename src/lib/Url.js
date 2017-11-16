const uuid = require("node-uuid");

class Url {
    constructor(urlString, cacheBusterPrefix) {
        this.urlString = urlString;
        this.cacheBusterPrefix = (cacheBusterPrefix === undefined) ?
            '?' :
            cacheBusterPrefix;
    }

    withCacheBuster() {
        return this.urlString + this.cacheBusterPrefix + 'cb=' + uuid.v4();
    }

    static apply(urlString, cacheBusterPrefix) {
        return (new Url(urlString, cacheBusterPrefix)).withCacheBuster();
    }
}

module.exports = Url;
