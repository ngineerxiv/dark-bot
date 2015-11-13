# Description:
#   は俺の嫁.com
#
# Commands:
#   @gaiachan 小路綾 - 小路綾.は俺の嫁.com
#   @gaiachan 小野寺小咲 - 小野寺小咲.は俺の嫁.com

random = (max) ->
  rand = 1 + Math.floor( Math.random() * max)
  ('00' + rand).slice(-3)

orenoyome = (msg, yome) ->
  msg.http("http://は俺の嫁.com/resource.json")
    .get() (err, res, body) ->
      unless err
        resources = JSON.parse body
        max = resources[yome]
        msg.send "http://#{ yome }.は俺の嫁.com/images/#{ random(max) }.jpg"

module.exports = (robot) ->
  robot.respond /小路綾/i, (msg) ->
    orenoyome(msg, '小路綾')

  robot.respond /小野寺小咲/i, (msg) ->
    orenoyome(msg, '小野寺小咲')
