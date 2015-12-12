class Spell

  hado:(n) ->
    switch n
      when 33
        '"君臨者よ"\n"血肉の仮面・万象・羽搏き・ヒトの名を冠す者よ"\n"真理と節制"\n"罪知らぬ夢の壁に僅かに爪を立てよ"\n\n破道の三十三　『蒼火墜』'
      when 63
        '"散在する獣の骨"\n"尖塔・紅晶・鋼鉄の車輪"\n"動けば風"\n"止まれば空"\n"槍打つ音色が虚城に満ちる"\n\n破道の六十三　『雷吼炮』'
      when 73
        '"血肉の仮面"\n"万象・羽搏き・ヒトの名を冠す者よ"\n"蒼火の壁に双蓮を刻む"\n"大火の淵を遠天にて待つ"\n\n破道の七十三　『双蓮蒼火墜』'
      when 90
        url = if Math.random() > 0.5 then 'http://yamiga.waka.ru.com/images/hado90.jpg' else 'http://yamiga.waka.ru.com/images/hado90AA.jpg'
        text = '"滲み出す混濁の紋章"\n"不遜なる狂気の器"\n"湧き上がり・否定し・痺れ・瞬き・眠りを妨げる"\n"爬行する鉄の王女"\n"絶えず自壊する泥の人形"\n"結合せよ"\n"反発せよ"\n"地に満ち己の無力を知れ"\n\n破道の九十　『黒棺』\n\n' + url
        text
      when 91
        '"千手の涯"\n"届かざる闇の御手"\n"映らざる天の射手"\n"光を落とす道"\n"火種を煽る風"\n"集いて惑うな"\n"我が指を見よ"\n"光弾・八身・九条・天経・疾宝・大輪・灰色の砲塔"\n"弓引く彼方"\n"皎皎として消ゆ"\n\n破道の九十一　『千手皎天汰炮』'
      else
        'http://yamiga.waka.ru.com/images/hadonone.jpg'

module.exports = new Spell()
