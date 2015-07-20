class RelayBlog
  _member = []
  _util = null

  constructor:(member, util) ->
    _member = member
    _util = util

  apply:(toMessage = false) ->
    targets = _util.shuffleAll _member
    decided = {
      member:[]
    }
    for name, idx in targets
      date = this.nextSunday date
      next = this.nextSunday date
      decided.member.push {
        name: name
        date: {
          from: date
          until: next
        }
      }
    if(toMessage)
      this.toMessageOkarin decided.member
    else
      return decided

  toMessageOkarin: (member) ->
    message = "これよりオペレーション・スクルド(リレーブログプロジェクト)を開始する。\n"
    message += "http://hatenablog.com/g/8454420450067357649\n"
    for elm, idx in member
      from  = elm.date.from
      to    = elm.date.until

      message += "#{idx + 1} 番目: #{elm.name} 期日は以下の通りだ\n#{from.getFullYear()}/#{from.getMonth() + 1}/#{from.getDate()} ~ #{to.getFullYear()}/#{to.getMonth() + 1}/#{to.getDate()}\n\n"

    message += "検討を祈る。"
    return message

  toMessageMayusy: (member) ->
    if (member.length == 0)
      return "トゥットゥルーまゆしぃです。\nまだオペレーション・スクルドは始まってないみたいだよ〜"

    message = "トゥットゥルーまゆしぃです。\n今登録中のリレーブログはこんな感じなんだよ〜\n"
    message += "http://hatenablog.com/g/8454420450067357649\n"
    for elm, idx in member
      from  = new Date elm.date.from
      to    = new Date elm.date.until

      message += "#{idx + 1} 番目: #{elm.name}\n期日: #{from.getFullYear()}/#{from.getMonth() + 1}/#{from.getDate()} ~ #{to.getFullYear()}/#{to.getMonth() + 1}/#{to.getDate()}\n\n"

    return message

  findSunday: ->
    today = new Date
    d = new Date
    d.setTime(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
    return d

  nextSunday: (date) ->
    if(date == undefined )
      return this.findSunday()
    else
      next = new Date
      next.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
      return next

module.exports = RelayBlog
