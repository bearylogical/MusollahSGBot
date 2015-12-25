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

function musollahQuery(chatId, musollahName,location,bot) {
    var locResponse = "Please send me your location to find nearest Musollah\n\n";
    locResponse += "You can do this by selecting the paperclip icon (📎) ";
    locResponse += "followed by attaching your location (📌).";

    if (musollahName === "nearest musollah") {
        return bot.sendMessage(chatId, locResponse, {
            reply_markup: JSON.stringify({
                hide_keyboard: true
            })
        });
    }

    function callback(err, data) {
        if (err) {
            return bot.sendMessage(chatId, err, {
                parse_mode: "Markdown",
                reply_markup: JSON.stringify({
                    hide_keyboard: true
                })
            });
        }
        bot.sendMessage(chatId, data, {
            parse_mode: "Markdown",
            reply_markup: JSON.stringify({
                hide_keyboard: true
            })
        });
        musollahSessions[chatId] = new MusollahSession(chatId);

    }
    
    musollahlocator(callback,musollahName,location)
  

}

function musollahlocator(callback,musollahName,location){

    var directions;
    var musollah;

    if(location) {
        musollah = nearestMusollah(location);
        
    } else {
        musollah = musollahName;

    }

    if (!musollah) {
        return callback("Invalid Musollah!Please try again");
    }


    for (var i = 0; i < nus.length; i++) { //check for musollah
        if (musollah.toLowerCase() === nus[i].name.toLowerCase()) {
            name = nus[i].name;
            directions = nus[i].directions;
            toiletLocation = nus[i].toiletLocation;
        }
    }

    response = name + " is your Nearest Musollah\n\n";
    response += "Directions: " + directions + "\n\n";
    response += "Toilet location: " + toiletLocation ;

    return callback(null,response);

}


function nearestMusollah(start) {
    var minDist = Infinity;
    var minMusollah = "UTown";
    for (var i = 0; i < nus.length; i++) {

        var dist = geolib.getDistance(start, nus[i]);
        if (dist < minDist) {
            minDist = dist;
            minMusollah = nus[i].name;
        }
    }
    return minMusollah;
}

module.exports ={
    musollahAsk : musollahAsk,
    musollahQuery : musollahQuery,
    MusollahSession : MusollahSession
}

