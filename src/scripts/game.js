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
var NegativeWordsRepository = require("./lib/NegativeWordsRepository.js");
var negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
var NegativeWords   = require("./lib/NegativeWords.js");
var negativeWords   = new NegativeWords(negativeWordsRepository, console);
var MAX_HP          = 1000;
var HUBOT_NODE_QUEST_USERS_HP  = "HUBOT_NODE_QUEST_USERS_HP";

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
var shakai      = new User(0, "'社会'", game.defaultStatus(), new Equipment(new Weapon(30, 12)), game.defaultParameter());

new Cron("0 0 * * 1", function() {
    game.users.forEach(function(u) {
        u.fullCare(u);
    });
}, null, true, "Asia/Tokyo");

module.exports = function(robot) {

    darkGame.on("game-user-hp-changed", function(data) {
        var us = {};
        game.users.forEach(function(u) {
            us[u.id] = u.status.currentHp;
        });
        robot.brain.set(HUBOT_NODE_QUEST_USERS_HP, us);
    });

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
        darkGame.attack(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^cure (.+)/i, function(res){
        darkGame.cure(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^ザオリク (.+)/i, function(res) {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^raise (.+)/i, function(res) {
        darkGame.raise(
            game.findUser(res.message.user.name),
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/^status (.+)/i, function(res) {
        darkGame.status(
            game.findUser(res.match[1])
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });

    robot.hear(/.*/, function(res) {
        var tokens  = (res.message.tokenized || []).map(function(t) {
            return t.basic_form;
        }) : [];
        darkGame.attack(
            shakai, 
            game.findUser(res.message.user.name),
            negativeWords.countNegativeWords(tokens)
        ).messages.forEach(function(m) {
            res.send(m);
        });
    });
}
