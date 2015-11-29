# Description:
#   Relay Blog
#
# Commands:
#   hubot relay start - オペレーション・スクルドを開始する
#   hubot relay last - 現在実行中のオペレーション・スクルド概要を確認する
#   hubot relay reset - シュタインズゲートの選択
#   hubot relay set <YYYY/MM/DD> members_with_@..> - シュタインズゲートの選択
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

module.exports = (robot) ->
  findChannelByMessage = (res) ->
    slackMsg = res.message.rawMessage ? {}
    slackMsg.channel

  post = (name, message, icon, channel = channelToPost, logger = robot.logger) ->
    channel = if( channel == "Shell" || channel == undefined) then channelToPost else channel
    client.api.chat.postMessage
      channel: channel
      text: message
      username: name
      icon_url: icon
      link_names: 1
    , (err, response) ->
      logger.error err if err
      logger.log response

  robot.respond /relay start$/i, (res) ->
    result = blog.apply()
    robot.brain.set(relayBlogBrainKey, result)
    message = blog.toMessageOkarin result.member
    post "鳳凰院凶真",
      message,
      "https://pbs.twimg.com/profile_images/378800000078323076/5f6afc04e701807ae99024e84c83057d.jpeg",
      findChannelByMessage(res)

  robot.respond /relay last$/i, (res) ->
    result  = robot.brain.get(relayBlogBrainKey) ? {}
    message = blog.toMessageMayusy (result.member ? [])
    post "まゆしぃ",
      message,
      "http://pic.prepics-cdn.com/1046oryou/5661857.jpeg",
      findChannelByMessage(res)

  robot.respond /relay reset$/i, (res) ->
    if(res.message.user.name in admin)
      robot.brain.remove(relayBlogBrainKey)
      post "鳳凰院凶真",
        "そうか・・・それがシュタインズゲートか。\nしかたあるまい、今を持ってオペレーション・スクルドは中止とする。\nエル・プサイ・コングルゥ",
        "https://pbs.twimg.com/profile_images/378800000078323076/5f6afc04e701807ae99024e84c83057d.jpeg",
        findChannelByMessage(res)
    else
      robot.logger.error (res.message.user.name + " called admin command")
      res.send "選ばれし者以外はこのコマンドは実行出来ぬ"


  robot.respond /relay set (\d{4}\/\d{2}\/\d{2}) (.+)$/i, (res) ->
    if(res.message.user.name in admin)
      date  = new Date(res.match[1])
      date = if (isNaN date.getYear()) then undefined else date
      names = res.match[2].split(/,| /)
      names = (name for name in names when name in member)
      result = blog.apply(names, date)
      robot.brain.set(relayBlogBrainKey, result)
      message = blog.toMessageTimeleep result.member
      post "タイムリープマシン",
        message,
        "http://livedoor.blogimg.jp/onecall_dazeee/imgs/1/8/18f2fe6b.png"
        findChannelByMessage(res)
    else
      robot.logger.error (res.message.user.name + " called admin command")
      res.send "選ばれし者以外はこのコマンドは実行出来ぬ"

