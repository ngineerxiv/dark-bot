// Description:
//   破道
//
// Commands:
//   hubot 破道の{n} - nは数字
//   hubot hado {n}  - nは数字
//

const hado = {
    33 : () => `君臨者よ\n血肉の仮面・万象・羽搏き・ヒトの名を冠す者よ\n真理と節制\n罪知らぬ夢の壁に僅かに爪を立てよ\n\n破道の三十三　『蒼火墜』`,
    63 : () => `散在する獣の骨\n尖塔・紅晶・鋼鉄の車輪\n動けば風\n止まれば空\n槍打つ音色が虚城に満ちる\n\n破道の六十三　『雷吼炮』`,
    73 : () => `血肉の仮面\n万象・羽搏き・ヒトの名を冠す者よ\n蒼火の壁に双蓮を刻む\n大火の淵を遠天にて待つ\n\n破道の七十三　『双蓮蒼火墜』`,
    91 : () => `千手の涯\n届かざる闇の御手\n映らざる天の射手\n光を落とす道\n火種を煽る風\n集いて惑うな\n我が指を見よ\n光弾・八身・九条・天経・疾宝・大輪・灰色の砲塔\n弓引く彼方\n皎皎として消ゆ\n\n破道の九十一　『千手皎天汰炮』`,
}
const defaultValue = () => `http://yamiga.waka.ru.com/images/hadonone.jpg`

module.exports = (robot) => {

  robot.respond(/破道の([0-9]+)$/, (res) => {
    const n = parseInt(res.match[1])
    const msg = (hado[n] || defaultValue)()
    res.send(msg)
  })

  robot.respond(/hado ([0-9]+)$/, (res) => {
    const n = parseInt(res.match[1])
    const msg = (hado[n] || defaultValue)()
    res.send(msg)
  })

  robot.hear(/君臨者/i, (res) => res.send(hado[33]()))

  robot.hear(/散在する/, (res) => res.send(hado[63]()))

  robot.hear(/血肉/, (res) => res.send(hado[73]()))

  robot.hear(/千手の/, (res) => res.send(hado[91]()))
}
