require './helper'

TextMessage = require('hubot/src/message').TextMessage

describe 'orenoyome.coffee', ->
  {robot, user, adapter} = {}

  shared_context.robot_is_running (ret) ->
    {robot, user, adapter} = ret

  beforeEach ->
    require('../scripts/orenoyome.coffee')(robot)

  it 'should be string when called hubot 小野寺小咲', (done) ->
    adapter.on 'send', (envelope, strings) ->
      expect(strings[0]).to.be.a('string')
    , done

    adapter.receive(new TextMessage(user, 'hubot 小野寺小咲'))

