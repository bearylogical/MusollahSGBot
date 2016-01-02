var geolib = require('geolib');
var sgLoc = require('../locations/sgMusollah.json');
var util = require('./util');

var SGmusollahSessions = {};

function SGMusollahSession(chatId) {
    this.chatId = chatId;
    this.onGoing = false;
    SGmusollahSessions[chatId] = this;
}

function SGmusollahAsk(chatId,bot) {
    
    var locResponse = "Please send me your location to find nearest Musollah\n\n";
    locResponse += "You can do this by selecting the paperclip icon (📎) ";
    locResponse += "followed by attaching your location (📌).";

    var greeting = "Good " + util.currentTimeGreeting();
    bot.sendMessage(chatId, greeting + ", "+ locResponse);
    SGmusollahSessions[chatId] = new SGMusollahSession(chatId);
    SGmusollahSessions[chatId].onGoing = true;
    
    return SGmusollahSessions[chatId];

}


function SGmusollahLocator(chatId,location,bot){

    var directions;
    var musollah;

    if(location) {
        musollah = nearestSGMusollah(location);
        
    }

    if (!musollah) {
        return ("Invalid Musollah!Please try again");
    }


    for (var i = 0; i < sgLoc.length; i++) { //check for musollah
        if (musollah.toLowerCase() === sgLoc[i].Place.toLowerCase()) {
            name = sgLoc[i].Place;
            address = sgLoc[i].Address;
            directions = sgLoc[i].LocationIn;
            locationDetails = sgLoc[i].Details;
            lat = sgLoc[i].latitude;
            longit = sgLoc[i].longitude;
        }
    }

    response = "*"+ name + "*" +" at _" + address + "_ is your Nearest Musollah\n\n";
    if (directions != ""){
        response += "*Directions*: " + directions + "\n\n";
            if (locationDetails != ""){
                response += "*Additional Details*: " + locationDetails;
            }
    }
    
    



    bot.sendLocation(chatId,lat,longit).then(function() {
        bot.sendMessage(chatId,response,{
        parse_mode : "Markdown"
    });
    })

    SGmusollahSessions[chatId] = new SGMusollahSession(chatId);
    

}


function nearestSGMusollah(start) {
    var minDist = Infinity;
    var minMusollah = "Technopreneur Centre";
    
    
    
    for (var i = 0; i < sgLoc.length; i++) {

        var dist = geolib.getDistance(start, sgLoc[i]);
        if (dist < minDist) {
            minDist = dist;
            minMusollah = sgLoc[i].Place;
        }
    }
    return minMusollah;
}

module.exports ={
    SGmusollahAsk : SGmusollahAsk,
    SGmusollahLocator : SGmusollahLocator,
    SGMusollahSession : SGMusollahSession
}

