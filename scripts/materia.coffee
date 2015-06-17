# Description:
#   くっくっくっ・・・黒マテリア
#


module.exports = (robot) ->

  robot.hear /((く|ク)(っ|ッ){0,1}){3}(\.|。|・)*$/i, (res) ->
    res.send "黒マテリア"

