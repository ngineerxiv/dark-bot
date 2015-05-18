# Description
#   hubot scripts for diagnosing dark hubot
#
# Commands:
#   hubot ping - Reply with ...
#   hubot echo <text> - Reply back with <text>
#   hubot time - Reply with current time
#

module.exports = (robot) ->
  robot.respond /PING$/i, (msg) ->
    msg.send "http://imgcc.naver.jp/kaze/mission/USER/20130105/79/780609/17/607x314x1e412544122065c25107eade.jpg"
  robot.respond /ECHO (.*)$/i, (msg) ->
    msg.send msg.match[1]
  robot.respond /TIME$/i, (msg) ->
    msg.send "Server time is: #{new Date()}"
