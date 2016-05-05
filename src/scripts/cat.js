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
    const query = Math.random() > 0.5 ? "猫" : "cat";
    return imageMe(msg, query, (url) => msg.send(url));
  });

  return robot.respond(/cat (.+)/i, function(msg) {
    const query = (Math.random() > 0.5 ? "猫" : "cat") + " " + msg.match[1];
    return imageMe(msg, query, function(url) {
      return msg.send(url);
    });
  });
};

function ensureImageExtension(url) {
  const ext = url.split('.').pop();
  if (/(png|jpe?g|gif)/i.test(ext)) {
    return url;
  }
};

function imageMe(msg, query, animated, faces, cb) {
  let googleApiKey, googleCseId, q, url;
  if (typeof animated === 'function') {
    cb = animated;
  }
  if (typeof faces === 'function') {
    cb = faces;
  }
  googleCseId = process.env.HUBOT_GOOGLE_CSE_ID;
  if (googleCseId) {
    googleApiKey = process.env.HUBOT_GOOGLE_CSE_KEY;
    if (!googleApiKey) {
      msg.robot.logger.error("Missing environment variable HUBOT_GOOGLE_CSE_KEY");
      msg.send("Missing server environment variable HUBOT_GOOGLE_CSE_KEY.");
      return;
    }
    q = {
      q: query,
      searchType: 'image',
      safe: 'high',
      fields: 'items(link)',
      cx: googleCseId,
      key: googleApiKey
    };
    if (animated === true) {
      q.fileType = 'gif';
      q.hq = 'animated';
    }
    if (faces === true) {
      q.imgType = 'face';
    }
    url = 'https://www.googleapis.com/customsearch/v1';
    return msg.http(url).query(q).get()(function(err, res, body) {
      var error, i, image, len, ref, ref1, response, results;
      if (err) {
        msg.send("Encountered an error :( " + err);
        return;
      }
      if (res.statusCode !== 200) {
        msg.send("Bad HTTP response :( " + res.statusCode);
        return;
      }
      response = JSON.parse(body);
      if (response != null ? response.items : void 0) {
        image = msg.random(response.items);
        return cb(ensureImageExtension(image.link));
      } else {
        msg.send("Oops. I had trouble searching '" + query + "'. Try later.");
        if ((ref = response.error) != null ? ref.errors : void 0) {
          ref1 = response.error.errors;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            error = ref1[i];
            results.push((function(error) {
              msg.robot.logger.error(error.message);
              if (error.extendedHelp) {
                return msg.robot.logger.error("(see " + error.extendedHelp + ")");
              }
            })(error));
          }
          return results;
        }
      }
    });
  } else {
    q = {
      v: '1.0',
      rsz: '8',
      q: query,
      safe: 'active'
    };
    if (typeof animated === 'boolean' && animated === true) {
      q.imgtype = 'animated';
    }
    if (typeof faces === 'boolean' && faces === true) {
      q.imgtype = 'face';
    }
    return msg.http('https://ajax.googleapis.com/ajax/services/search/images').query(q).get()(function(err, res, body) {
      var image, images, ref;
      if (err) {
        msg.send("Encountered an error :( " + err);
        return;
      }
      if (res.statusCode !== 200) {
        msg.send("Bad HTTP response :( " + res.statusCode);
        return;
      }
      images = JSON.parse(body);
      images = (ref = images.responseData) != null ? ref.results : void 0;
      if ((images != null ? images.length : void 0) > 0) {
        image = msg.random(images);
        return cb(ensureImageExtension(image.unescapedUrl));
      }
    });
  }
};


