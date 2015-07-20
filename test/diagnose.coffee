require './helper'

TextMessage = require('hubot/src/message').TextMessage

describe 'ping', ->  
  {robot, user, adapter} = {}

  shared_context.robot_is_running (ret) ->
    {robot, user, adapter} = ret

  beforeEach ->
    require('../scripts/diagnostics.coffee')(robot)

  it 'called ping', (done) ->
    adapter.on 'send', (envelope, strings) ->
      expect(strings[0]).to.equal('http://imgcc.naver.jp/kaze/mission/USER/20130105/79/780609/17/607x314x1e412544122065c25107eade.jpg')
    , done

    adapter.receive(new TextMessage(user, 'hubot ping'))

