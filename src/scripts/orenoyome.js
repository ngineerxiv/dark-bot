// Description:
//   は俺の嫁.com
//
// Commands:
//   hubot 小路綾 - 小路綾.は俺の嫁.com
//   hubot 小野寺小咲 - 小野寺小咲.は俺の嫁.com
//   hubot 筒隠月子 - 筒隠月子.は俺の嫁.com
//   hubot 流子|御船流子 - 御船流子.は俺の嫁.com
//   hubot エリオ|藤和エリオ - 藤和エリオ.は俺の嫁.com

"use strict"

const punycode = require('punycode');
const http  = require('request');
const random = (max) => {
    rand = 1 + Math.floor(Math.random() * max)
    return ('00' + rand).slice(-3)
}
const timeoutMillisec = 3000;
const orenoyomeMasterUrl = 'http://は俺の嫁.com/resource.json';

class OrenoyomeClient {
    constructor(resourceJsonUrl, logger) {
        this.resourceJsonUrl = resourceJsonUrl;
    }

    request(callback, errorCallback) {
        const req = http.get(this.resourceJsonUrl, {
            'timeout': timeoutMillisec
        }, (err, res, body) => {
            if (err) {
                if (err.code === 'ETIMEDOUT') {
                    errorCallback(
                        `request to ${this.resourceJsonUrl} timed out. waited ${timeoutMillisec / 1000.0} seconds`,
                        body
                    );
                }
                errorCallback(err, body);
            } else {
                callback(body);
            }
        });
    }

    requestWith(yome, callback, errorCallback) {
        return this.request((body) => {
            const resources = JSON.parse(body)
            const max       = resources[yome]
            const encoded   = `xn--${punycode.encode(yome)}`
            const domain    = `${encoded}.xn--u9jb933vm9i.com`
            const url = `http://${ domain }/images/${ random(max) }.jpg`
            callback(url);
        }, errorCallback);
    }
}

module.exports = (robot) => {
    const client = new OrenoyomeClient(
        orenoyomeMasterUrl
    );
    robot.respond (/小路綾/i, (msg) => client.requestWith(
        '小路綾',
        (y) => msg.send(y),
            (err, body) => msg.send(err)
    ));

    robot.respond (/小野寺小咲/i, (msg) => client.requestWith(
        '小野寺小咲',
        (y) => msg.send(y),
            (err, body) => msg.send(err)
    ));

    robot.respond (/(月子|筒隠月子)/i, (msg) => client.requestWith(
        '筒隠月子',
        (y) => msg.send(y),
            (err, body) => msg.send(err)
    ));

    robot.respond (/(流子|御船流子)/i, (msg) => client.requestWith(
        '御船流子',
        (y) => msg.send(y),
            (err, body) => msg.send(err)
    ));

    robot.respond (/(エリオ|藤和エリオ)/i, (msg) => client.request(
        '藤和エリオ',
        (y) => msg.send(y),
            (err, body) => msg.send(err)
    ));

    robot.respond (/(orenoyome|俺の嫁) list/i, (msg) => {
        client.request((body) => {
            const resources = JSON.parse(body)
            helps = (Object.keys(resources)).map((name) => "dark " + name)
            msg.send(helps.join("\n"))
        }, (err, body) => {
            robot.logger.error(err);
            msg.send(err)
        });
    })
}
