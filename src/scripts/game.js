// Description:
//   遊ぶ
// Commands:
//   quest attack {user} - attack
//   quest cure {user} - cure
//   quest raise|ザオリク {user} - ふっかつ
//

var Cron = require("cron").CronJob;
var DarkQuest   = require("node-quest");
var Game        = DarkQuest.Game;
var Equipment   = DarkQuest.Equipment;
var Parameter   = DarkQuest.Parameter;
var Weapon      = DarkQuest.Weapon;
var User        = DarkQuest.User;
var Status      = DarkQuest.Status;

var DarkGame    = require("./lib/DarkGame.js");
var NegativeWords = require("./lib/NegativeWords.js");
var NegativeWordsRepository = require("./lib/NegativeWordsRepository.js");

var MAX_HP                  = 1000;
var HUBOT_NODE_QUEST_USERS_HP  = "HUBOT_NODE_QUEST_USERS_HP";

var saveHp = function(robot, users) {
    var us = {};
    users.forEach(function(u) {
        us[u.id] = u.status.currentHp;
    });
    robot.brain.set(HUBOT_NODE_QUEST_USERS_HP, us);
};

var toGameUser = function(users, savedUsers) {
    return Object.keys(users).map(function(id) {
        var user    = users[id];
        var eq      = new Equipment(new Weapon(30, 12));
        var p       = new Parameter(20, 10);
        var hp      = (savedUsers && savedUsers[id] && !isNaN(savedUsers[id])) ? savedUsers[id] : MAX_HP;
        var st      = new Status(game, hp);
        return new User(user.id, user.name, st, eq, p);
    });
};
var game        = new Game(0, MAX_HP);
var darkGame    = new DarkGame(game);
var shakai      = new User(0, "'社会'", game.defaultStatus(), new Equipment(new Weapon(30, 12)), game.defaultStatus());

var resetUserHp = function() {
    game.users.forEach(function(u) {
        u.fullCare(u);
    });
};

new Cron("0 0 * * 1", resetUserHp, null, true, "Asia/Tokyo");

module.exports = function(robot) {
    var negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
    var negativeWords = new NegativeWords(negativeWordsRepository, robot.logger);
    var alreadyLoaded = false;
    robot.brain.on("loaded", function(data) {
        if (alreadyLoaded) {
            return
        }
        var savedUsers  = robot.brain.get(HUBOT_NODE_QUEST_USERS_HP);
        savedUsers      = savedUsers ? savedUsers : {};
        var users       = robot.adapter.client ? toGameUser(robot.adapter.client.users, savedUsers) : [];
        game.setUsers(users);
        alreadyLoaded = true;
    });

    robot.hear(/^attack (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        var result = darkGame.attack(actor, target)
        result.messages.forEach(function(m) {
            res.send(m);
        });
        saveHp(robot, game.users);
    });

    robot.hear(/^cure (.+)/i, function(res){
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);
        var result = darkGame.cure(actor, target);
        result.messages.forEach(function(m) {
            res.send(m);
        });
        saveHp(robot, game.users);
    });

    robot.hear(/^ザオリク (.+)/i, function(res) {
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);
        var result = darkGame.raise(actor, target);
        result.messages.forEach(function(m) {
            res.send(m);
        });
        saveHp(robot, game.users);
    });

    robot.hear(/^raise (.+)/i, function(res) {
        var actor = game.findUser(res.message.user.name);
        var target = game.findUser(res.match[1]);

        var result = darkGame.raise(actor, target);
        result.messages.forEach(function(m) {
            res.send(m);
        });
        saveHp(robot, game.users);
    });

    robot.hear(/^status (.+)/i, function(res) {
        var target = game.findUser(res.match[1]);
        var result = darkGame.status(target);
        result.messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/.*/, function(res) {
        var tokens = res.message.tokenized
        var basicNorms  = tokens ? tokens.map(function(t) {
            return t.basic_form;
        }) : [];
        var negativeCount = negativeWords.countNegativeWords(basicNorms);
        var target = game.findUser(res.message.user.name);
        if(negativeCount == 1) {
            var result = darkGame.attack(shakai, target, negativeCount)
            result.messages.forEach(function(m) {
                res.send(m);
            });
        } else if(negativeCount > 0) {
            var result = darkGame.multipleAttack(shakai, target, negativeCount)
            result.messages.forEach(function(m) {
                res.send(m);
            });
        };
        saveHp(robot, game.users);
    });
}
