// Description:
//   遊ぶ
// Commands:
//   quest attack {user} - attack
//   quest cure {user} - cure
//   quest raise|ザオリク {user} - ふっかつ
//

var DarkQuest   = require("node-quest");
var Game        = DarkQuest.Game;
var Equipment   = DarkQuest.Equipment;
var Parameter   = DarkQuest.Parameter;
var Weapon      = DarkQuest.Weapon;
var User        = DarkQuest.User;

var INITIAL_ATTACK_DAMANE   = 70;
var INITIAL_CURE_POINT      = 30;
var MAX_HP                  = 1000;

module.exports = function(robot) {
    var game = new Game(0, MAX_HP);
    var toGameUser = function(users) {
        return Object.keys(users).map(function(id) {
            var user    = users[id];
            var eq      = new Equipment(new Weapon(30, 12));
            var p       = new Parameter(20, 10);
            return new User(user.id, user.name, game.defaultStatus(), eq, p);
        });
    };
    var users = robot.adapter.client ? toGameUser(robot.adapter.client.users) : [];
    game.setUsers(users);

    robot.hear(/attack (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null || target === null) {
            res.send("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            res.send( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else if (target.isDead()) {
            res.send( "[DEAD] こうかがない・・・" + target.name + "はただのしかばねのようだ・・・");
        } else {
            var before      = target.status.currentHp;
            var afterStatus = actor.attack(target, INITIAL_ATTACK_DAMANE);
            var after       = afterStatus.currentHp
            res.send( "[ATTACK] " + actor.name + "のこうげき！" + target.name + "に" + (before - after) + "のダメージ！ 残り:" + after + " / " + MAX_HP);
            if (target.isDead()) {
                res.send( "[DEAD] " + target.name + "はしんでしまった");
            }
        };
    });

    robot.hear(/cure (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null || target === null) {
            res.send("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            res.send( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else if (target.isDead()) {
            res.send( "[DEAD] しかし こうかがなかった・・・");
        } else {
            actor.cure(target, INITIAL_CURE_POINT);
            res.send("[CURE] " + target.name + "のキズがかいふくした！残り: " + target.status.currentHp + " / " + MAX_HP);
        };
    });

    robot.hear(/ザオリク (.+)/i, function(res) {
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null || target === null) {
            res.send("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            res.send( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else {
            if(!target.isDead()) {
                res.send("しかし なにも おこらなかった！");
            } else {
                actor.fullCare(target);
                res.send("[CURE] " + target.name + "は いきかえった！");
            }
        };
    });

    robot.hear(/raise (.+)/i, function(res) {
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null || target === null) {
            res.send("しかし だれもいなかった・・・");
        } else if (actor.isDead() ) {
            res.send( "[DEAD] おぉ" + actor.name + "！死んでしまうとはふがいない");
        } else {
            if(!target.isDead()) {
                res.send("しかし なにも おこらなかった！");
            } else {
                actor.fullCare(target);
                res.send("[CURE] " + target.name + "は いきかえった！");
            }
        };
    });

    robot.hear(/status (.+)/i, function(res) {
        var target = game.findUser(res.match[1]);
        if(target === null) {
            res.send("しかし だれもいなかった・・・");
        } else {
            res.send("現在のHP: " + target.status.currentHp + " / " + MAX_HP);
        };
    });

    var shakai  = new User(0, "社会", game.defaultStatus(), new Equipment(new Weapon(30, 12)), game.defaultStatus());
    var negativeWords = ["つらい", "辛い", "かなしい", "悲しい", "悲しい", "つかれる", "疲れる", "ねむい", "眠い"];
    robot.hear(/.*/, function(res) {
        var tokens = res.message.tokenized;
        if(tokens === undefined) {
            return
        }
        var length = tokens.length;
        var negativeCount = 0;
        tokens.forEach(function(token, idx) {
            if(negativeWords.indexOf(token.basic_form) !== -1) {
                negativeCount++;
                if(idx + 1 < length && tokens[idx + 1].basic_form === 'ない') {
                    negativeCount--;
                }
            };

            if(token.basic_form === '帰れる' || token.basic_form === 'かえれる') {
                if(idx + 1 < length && tokens[idx + 1].basic_form === 'ない') {
                    negativeCount++;
                }
            }
        });

        var target = game.findUser(res.message.user.name);
        if(negativeCount > 0 && target) {
            var before      = target.status.currentHp;
            var afterStatus;
            for(var i=0;i<negativeCount;i++) {
                afterStatus = shakai.attack(target, INITIAL_ATTACK_DAMANE);
            }
            var after       = afterStatus.currentHp

            res.send( "[ATTACK] '社会'のこうげき！" + target.name + "に" + (after - before) + "のダメージ！ 残り:" + after + " / " + MAX_HP + " NegativeWord数: " + negativeCount);
        }
    });
}
