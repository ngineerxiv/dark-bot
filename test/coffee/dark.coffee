require './helper'

TextMessage = require('hubot/src/message').TextMessage

describe 'dark.coffee', ->  
  {robot, user, adapter} = {}

  shared_context.robot_is_running (ret) ->
    {robot, user, adapter} = ret

  beforeEach ->
    require('../../scripts/dark.coffee')(robot)

  it 'should be string when called hubot poem', (done) ->
    adapter.on 'send', (envelope, strings) ->
      expect(strings[0]).to.be.a('string')
    , done

    adapter.receive(new TextMessage(user, 'hubot poem'))

  it 'should be string when someone says なんだと', (done) ->
    adapter.on 'send', (envelope, strings) ->
      expect(strings[0]).to.be.a('string')
    , done

    adapter.receive(new TextMessage(user, 'なんだと'))

  it 'should be string when called 炎上', (done) ->
    adapter.on 'send', (envelope, strings) ->
      expect(strings[0]).to.be.a('string')
    , done

    adapter.receive(new TextMessage(user, 'hubot 炎上 foo bar'))

