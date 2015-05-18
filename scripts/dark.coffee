# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#

json = require '../settings/poems.json'

shuffle = (targets) ->
  i = targets.length
  if i is 0 then return false
  while --i
    j = Math.floor Math.random() * (i + 1)
    tmpi = targets[i]
    tmpj = targets[j]
    targets[i] = tmpj
    targets[j] = tmpi
  return targets[0]

kurohitugi = ->
  url = if Math.random() > 0.5 then 'http://livedoor.blogimg.jp/fknews/imgs/7/4/746039d2.jpg' else 'http://susisu.ktkr.net/asari/i/67.png'
  text = '"滲み出す混濁の紋章"\n"不遜なる狂気の器"\n"湧き上がり・否定し・痺れ・瞬き・眠りを妨げる"\n"爬行する鉄の王女"\n"絶えず自壊する泥の人形"\n"結合せよ"\n"反発せよ"\n"地に満ち己の無力を知れ"\n\n破道の九十　『黒棺』\n\n' + url
  text

module.exports = (robot) ->

  robot.hear /なん(.|。|・)*だと(.|。|・)*/i, (res) ->
    res.send "http://dic.nicovideo.jp/oekaki/219454.png"

  robot.respond /poem$/i, (res) ->
    res.send shuffle json.poem

  robot.hear /君臨者/i, (res) ->
    res.send '"君臨者よ"\n"血肉の仮面・万象・羽搏き・ヒトの名を冠す者よ"\n"真理と節制"\n"罪知らぬ夢の壁に僅かに爪を立てよ"\n\n破道の三十三　『蒼火墜』'


  robot.hear /散在する/, (res) ->
    res.send '"散在する獣の骨"\n"尖塔・紅晶・鋼鉄の車輪"\n"動けば風"\n"止まれば空"\n"槍打つ音色が虚城に満ちる"\n\n破道の六十三　『雷吼炮』'

  robot.hear /血肉/, (res) ->
    res.send '"血肉の仮面"\n"万象・羽搏き・ヒトの名を冠す者よ"\n"蒼火の壁に双蓮を刻む"\n"大火の淵を遠天にて待つ"\n\n破道の七十三　『双蓮蒼火墜』'

  robot.hear /くろひつぎ|黒棺|滲みだす/, (res) ->
    text = kurohitugi()
    res.send text

  robot.respond /dark$/, (res) ->
    text = kurohitugi()
    res.send text

  robot.hear /千手の/, (res) ->
    res.send '"千手の涯"\n"届かざる闇の御手"\n"映らざる天の射手"\n"光を落とす道"\n"火種を煽る風"\n"集いて惑うな"\n"我が指を見よ"\n"光弾・八身・九条・天経・疾宝・大輪・灰色の砲塔"\n"弓引く彼方"\n"皎皎として消ゆ"\n\n破道の九十一　『千手皎天汰炮』'

  #
  # robot.respond /open the (.*) doors/i, (res) ->
  #   doorType = res.match[1]
  #   if doorType is "pod bay"
  #     res.reply "I'm afraid I can't let you do that."
  #   else
  #     res.reply "Opening #{doorType} doors"
  #
  # robot.hear /I like pie/i, (res) ->
  #   res.emote "makes a freshly baked pie"
  #
  # lulz = ['lol', 'rofl', 'lmao']
  #
  # robot.respond /lulz/i, (res) ->
  #   res.send res.random lulz
  #
  # robot.topic (res) ->
  #   res.send "#{res.message.text}? That's a Paddlin'"
  #
  #
  # enterReplies = ['Hi', 'Target Acquired', 'Firing', 'Hello friend.', 'Gotcha', 'I see you']
  # leaveReplies = ['Are you still there?', 'Target lost', 'Searching']
  #
  # robot.enter (res) ->
  #   res.send res.random enterReplies
  # robot.leave (res) ->
  #   res.send res.random leaveReplies
  #
  # answer = process.env.HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING
  #
  # robot.respond /what is the answer to the ultimate question of life/, (res) ->
  #   unless answer?
  #     res.send "Missing HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING in environment: please set and try again"
  #     return
  #   res.send "#{answer}, but what is the question?"
  #
  # robot.respond /you are a little slow/, (res) ->
  #   setTimeout () ->
  #     res.send "Who you calling 'slow'?"
  #   , 60 * 1000
  #
  # annoyIntervalId = null
  #
  # robot.respond /annoy me/, (res) ->
  #   if annoyIntervalId
  #     res.send "AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH"
  #     return
  #
  #   res.send "Hey, want to hear the most annoying sound in the world?"
  #   annoyIntervalId = setInterval () ->
  #     res.send "AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH"
  #   , 1000
  #
  # robot.respond /unannoy me/, (res) ->
  #   if annoyIntervalId
  #     res.send "GUYS, GUYS, GUYS!"
  #     clearInterval(annoyIntervalId)
  #     annoyIntervalId = null
  #   else
  #     res.send "Not annoying you right now, am I?"
  #
  #
  # robot.router.post '/hubot/chatsecrets/:room', (req, res) ->
  #   room   = req.params.room
  #   data   = JSON.parse req.body.payload
  #   secret = data.secret
  #
  #   robot.messageRoom room, "I have a secret: #{secret}"
  #
  #   res.send 'OK'
  #
  # robot.error (err, res) ->
  #   robot.logger.error "DOES NOT COMPUTE"
  #
  #   if res?
  #     res.reply "DOES NOT COMPUTE"
  #
  # robot.respond /have a soda/i, (res) ->
  #   # Get number of sodas had (coerced to a number).
  #   sodasHad = robot.brain.get('totalSodas') * 1 or 0
  #
  #   if sodasHad > 4
  #     res.reply "I'm too fizzy.."
  #
  #   else
  #     res.reply 'Sure!'
  #
  #     robot.brain.set 'totalSodas', sodasHad+1
  #
  # robot.respond /sleep it off/i, (res) ->
  #   robot.brain.set 'totalSodas', 0
  #   res.reply 'zzzzz'
