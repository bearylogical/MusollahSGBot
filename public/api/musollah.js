var geolib = require('geolib');
var nus = require('../locations/nusMusollah.json');
var util = require('./util');

var musollahSessions = {};

function MusollahSession(chatId) {
    this.chatId = chatId;
    this.onGoing = false;
    musollahSessions[chatId] = this;
}

function musollahAsk(chatId,bot) {
    var opts = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Nearest Musollah'],
                ['UTown']
            ],
            one_time_keyboard: true
        })
    };
    var greeting = "Good " + util.currentTimeGreeting();
    bot.sendMessage(chatId, greeting + ", Where would you like prayer locations for?", opts);
    musollahSessions[chatId] = new MusollahSession(chatId);
    musollahSessions[chatId].onGoing = true;
    return musollahSessions[chatId];
}

function musollahQuery(chatId, musollahName,bot) {
    var directions;

    for (var i = 0; i < nus.length; i++) { //check for musollah
        if (musollahName === nus[i].name.toLowerCase()) {
            directions = nus[i].directions;
        }
    }

    bot.sendMessage(chatId,directions);

    musollahSessions[chatId] = new MusollahSession(chatId); //start a new Musollah session
}


module.exports ={
    musollahAsk : musollahAsk,
    musollahQuery : musollahQuery,
    MusollahSession : MusollahSession
}

