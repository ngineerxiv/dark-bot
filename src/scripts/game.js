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
            res.send( "[ATTACK] " + actor.name + "のこうげき！" + target.name + "に" + (after - before) + "のダメージ！ 残り:" + after + " / " + MAX_HP);
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
}
