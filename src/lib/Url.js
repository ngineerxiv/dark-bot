"use strict"

const uuidv4 = require('uuid/v4');

class Url {
    constructor(urlString, cacheBusterPrefix) {
        this.urlString = urlString;
        this.cacheBusterPrefix = (cacheBusterPrefix === undefined) ?
            '?' :
            cacheBusterPrefix;
    }

    withCacheBuster() {
        return this.urlString + this.cacheBusterPrefix + 'cb=' + uuidv4();
    }

    static apply(urlString, cacheBusterPrefix) {
        return (new Url(urlString, cacheBusterPrefix)).withCacheBuster();
    }
}

module.exports = Url;
