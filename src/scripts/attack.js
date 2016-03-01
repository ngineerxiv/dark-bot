// Description:
//   選ぶ
// Commands:
//   hubot attack {user} - attack
//


var INITIAL_ATTACK_DAMANE = 10;
var INITIAL_CARE_POINT = 5;

var HpManager = require("hp-manager");

module.exports = function(robot) {
    var manager = new HpManager({
        db: robot.brain,
        hpKey: 'aHBNYW5hZ2VyCg==',
        max: 300,
        min: 10
    });

    robot.hear(/attack (.+)/i, function(res){
        var actor = res.message.user.name;
        var target = res.match[1];
        var users = robot.adapter.client.users;
        var targets = Object.keys(users).filter(function (userId) {
            return users[userId].name === target;
        });
        targets.length === 0 && res.send("There are no targets here.");
        targets.forEach(function(u) {
            // LEVELの概念とか入れたい
            var userName = users[u].name;
            var damage = INITIAL_ATTACK_DAMANE;
            var currentHp = manager.attack(u, damage);
            res.send( userName + " is damaged by " + actor + " HP: " + currentHp + " / " + manager.getMax());
        });
    });

    robot.hear(/care (.+)/i, function(res) {
        var actor = res.message.user.name;
        var target = res.match[1];
        var users = robot.adapter.client.users;
        var targets = Object.keys(users).filter(function (userId) {
            return users[userId].name === target;
        });
        targets.length === 0 && res.send("There are no targets here.");
        targets.forEach(function(u) {
            // LEVELの概念とか入れたい
            var userName = users[u].name;
            var care = INITIAL_CARE_POINT;
            var currentHp = manager.care(u, care);
            res.send( userName + " is cared by " + actor + " HP: " + currentHp + " / " + manager.getMax());
        });
    });
}
