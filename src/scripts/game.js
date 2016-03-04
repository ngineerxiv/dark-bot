// Description:
//   遊ぶ
// Commands:
//   attack {user} - attack
//   cure {user} - cure
//   ザオリク {user}
//

var INITIAL_ATTACK_DAMANE = 100;
var INITIAL_CURE_POINT = 50;
var GamePlugin = require("game-plugin");
var Game = GamePlugin.Game;
var User = GamePlugin.User;
var Status = GamePlugin.Status;

module.exports = function(robot) {
    var toGameUser = function(users) {
        return Object.keys(users).map(function(id) {
            var user   = users[id]
            var status = new Status(MAX_HP, MAX_HP);
            return User.factory(user.id, user.name, status);
        });
    };
    var users = toGameUser(robot.adapter.client.users);
    var game = new Game(users, MAX_HP);

    robot.hear(/attack (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null && target === null) {
            res.send("There are no targets here.");
        } else if (target.isDead()) {
            res.send( target.name + " is dead " + target.status.toString());
        } else {
            actor.attack(target, INITIAL_ATTACK_DAMANE);
            res.send( target.name + " is damaged by " + actor.name + target.status.toString());
        };
    });

    robot.hear(/cure (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null && target === null) {
            res.send("There are no targets here.");
        } else if (target.isDead()) {
            res.send( target.name + " is dead " + target.status.toString());
        } else {
            actor.cure(target, INITIAL_CURE_POINT);
            res.send( target.name + " is cured by " + actor.name + target.status.toString());
        };
    });

    robot.hear(/ザオリク (.+)/i, function(res) {
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null && target === null) {
            res.send("There are no targets here.");
        } else {
            if(!target.isDead() && actor.fullCare(target)) {
                res.send( target.name + " is full cared by " + actor.name + target.status.toString());
            }
        };
    });
}
