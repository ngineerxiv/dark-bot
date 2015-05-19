# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#

json = require '../settings/poems.json'
util = require './lib/util.coffee'
spell = require './lib/spell.coffee'

module.exports = (robot) ->

  robot.respond /破道の([0-9]+)$/, (res) ->
    n = parseInt(res.match[1])
    res.send spell.hado n

  robot.respond /hado ([0-9]+)$/, (res) ->
    n = parseInt(res.match[1])
    res.send spell.hado n

  robot.hear /君臨者/i, (res) ->
    res.send spell.hado 33

  robot.hear /散在する/, (res) ->
    res.send spell.hado 63

  robot.hear /血肉/, (res) ->
    res.send spell.hado 73

  robot.hear /くろひつぎ|黒棺|滲みだす/, (res) ->
    res.send spell.hado 90

  robot.hear /千手の/, (res) ->
    res.send spell.hado 91
