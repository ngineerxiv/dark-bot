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

  robot.respond /poem$/i, (res) ->
    res.send util.shuffle json.poem

  robot.hear /なん(.|。|・)*だと(.|。|・)*/i, (res) ->
    res.send "http://dic.nicovideo.jp/oekaki/219454.png"
