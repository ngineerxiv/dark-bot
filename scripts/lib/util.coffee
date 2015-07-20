class Util

  shuffleAll: (targets) ->
    i = targets.length
    if i is 0 then return false
    while --i
      j = Math.floor Math.random() * (i + 1)
      tmpi = targets[i]
      tmpj = targets[j]
      targets[i] = tmpj
      targets[j] = tmpi
    return targets

  shuffle: (targets, idx) ->
    targets = this.shuffleAll targets
    idx = if(idx == undefined ) then 0 else idx
    targets[idx]

module.exports = new Util
