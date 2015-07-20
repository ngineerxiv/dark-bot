# Description:
#   Relay Blog
#
# Commands:
#   hubot relay start - オペレーション・スクルドを開始する
#   hubot relay last - 現在実行中のオペレーション・スクルド概要を確認する
#   hubot relay reset - シュタインズゲートの選択
#
# Notes:
#   http://hatenablog.com/g/8454420450067357649

SlackClient  = require 'slack-api-client'
relayEnv= require '../settings/relayblog.json'
token   = relayEnv.token
member  = relayEnv.member
admin   = relayEnv.admin
util    = require './lib/util.coffee'
client  = new SlackClient(token)
channelToPost = relayEnv.channel
RelayBlog     = require './lib/relayblog.coffee'
blog    = new RelayBlog(member, util)
relayBlogBrainKey = "relay-blog-brain-key"

post = (name, message, icon) ->
  client.api.chat.postMessage
    channel: channelToPost
    text: message
    username: name
    icon_url: icon
    link_names: 1
  , (err, response) ->
    console.log err if err
    console.log response



module.exports = (robot) ->

  robot.respond /relay start$/i, (res) ->
    result = blog.apply()
    robot.brain.set(relayBlogBrainKey, result)
    message = blog.toMessageOkarin result.member
    post "鳳凰院凶真", message, "https://pbs.twimg.com/profile_images/378800000078323076/5f6afc04e701807ae99024e84c83057d.jpeg"

  robot.respond /relay last$/i, (res) ->
    result  = robot.brain.get(relayBlogBrainKey) ? {}
    message = blog.toMessageMayusy (result.member ? [])
    post "まゆしぃ", message, "http://pic.prepics-cdn.com/1046oryou/5661857.jpeg"

  robot.respond /relay reset$/i, (res) ->
    if(res.message.user.name in admin)
      robot.brain.set(relayBlogBrainKey, {})
      post "鳳凰院凶真",
        "そうか・・・それがシュタインズゲートか。\nしかたあるまい、今を持ってオペレーション・スクルドは中止とする。\nエル・プサイ・コングルゥ",
        "https://pbs.twimg.com/profile_images/378800000078323076/5f6afc04e701807ae99024e84c83057d.jpeg"
    else
      res.send "効かぬ"
