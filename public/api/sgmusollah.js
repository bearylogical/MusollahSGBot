var geolib = require('geolib');
var nus = require('../locations/nusMusollah.json');
var util = require('./util');
var rest = require('reslet')

var SGmusollahSession = {};

function SGMusollahSession(chatId) {
    this.chatId = chatId;
    this.onGoing = false;
    SGmusollahSession[chatId] = this;
}

function musollahAsk(chatId,bot) {
    
    var greeting = "Good " + util.currentTimeGreeting();
    bot.sendMessage(chatId, greeting + ", Please send me your location ", opts);
    SGmusollahSession[chatId] = new SGMusollahSession(chatId);
    SGmusollahSession[chatId].onGoing = true;
    

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
        SGmusollahSession[chatId] = new SGMusollahSession(chatId);
        console.log(SGmusollahSession.onGoing);

    }
    
    SGmusollahlocator(callback, location)


}


function SGmusollahlocator(callback, location){

    var directions;
    var musollah;

    if(location) {
        musollah = nearestMusollah(location);
        
    } 

    if (!musollah) {
        return callback("Invalid Musollah!Please try again");
    }


    for (var i = 0; i < nus.length; i++) { //check for musollah
        if (musollah.toLowerCase() === nus[i].name.toLowerCase()) {
            name = nus[i].name;
            directions = nus[i].directions.join('\n');
            toiletLocation = nus[i].toiletLocation;
        }
    }

    response = "_"+ name + "_" + " is your Nearest Musollah\n\n";
    response += "*Directions*: " + directions + "\n\n";
    response += "*Toilet location*: " + toiletLocation ;

    return callback(null,response);

}


function nearestSGMusollah(start) {
    var minDist = Infinity;
    var minMusollah = "Technopreneur Centre";
    var reqURL = "https://api.musollah.com/info/musollah/list/sg?X-API-KEY=2GLqstVdfEp5k17R12C60I6B1y0TG167"
    
    
    
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
    SGMusollahSession : SGMusollahSession
}

