// Description:
//   遊ぶ
// Commands:
//   hubot attack {user} - attack
//

var INITIAL_ATTACK_DAMANE = 10;
var GamePlugin = require("game-plugin");
var Game = GamePlugin.Game;
var User = GamePlugin.User;
var Status = GamePlugin.Status;

module.exports = function(robot) {
    var toGameUser = function(users) {
        return Object.keys(users).map(function(id) {
            var user   = users[id]
            var status = new Status(999, 999);
            return User.factory(user.id, user.name, status);
        });
    };
    var users = toGameUser(robot.adapter.client.users);
    var game = new Game(users, 999);

    robot.hear(/attack (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        if(actor === null && target === null) {
            res.send("There are no targets here.");
        } else {
            actor.attack(target, INITIAL_ATTACK_DAMANE);
            res.send( target.name + " is damaged by " + actor.name + " HP: " + target.status.currentHp + " / " + game.maxHp);
        };
    });
}
