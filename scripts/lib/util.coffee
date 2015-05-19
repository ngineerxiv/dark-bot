class Util

  shuffle: (targets) ->
    i = targets.length
    if i is 0 then return false
    while --i
      j = Math.floor Math.random() * (i + 1)
      tmpi = targets[i]
      tmpj = targets[j]
      targets[i] = tmpj
      targets[j] = tmpi
    return targets[0]

module.exports = new Util
