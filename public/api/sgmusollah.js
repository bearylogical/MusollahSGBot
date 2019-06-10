var geolib = require('geolib');
var sgLoc = require('../locations/sgMusollah.json');
var util = require('./util');
var CREDENTIALS = require('../../private/telegram_credentials.json');
var rest = require('restler')


var musollahAPIKEY = CREDENTIALS.musollahAPI;

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
        musollah = SGMusollahQuery(location);
        
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
    
    return SGmusollahSessions[chatId];
}


function SGMusollahQuery(start,callback){

    function processMusollahInfo(data) {

        var musollahList = '';
        var header ;
        data.forEach(function(musollah) {
            musollahList += musollah.Place + '\n' 
        });
        console.log(musollahList);
    }

    var url = "https://api.musollah.com/info/musollah/nearest/sg,"
    var reqUri = url + start.latitude + "," + start.longitude + "?X-API-KEY=" + musollahAPIKEY + "&page=1&perpage=3"  
    
    var reqOptions = {
        'timeout': 5000
    };

    rest.get(reqUri, reqOptions).on('timeout', function() {
        callback('Musollah Server down');
    }).on('complete', function(data) {
        processMusollahInfo(data,callback);
    });

    // 1.329258478122359,103.9435229038321?X-API-KEY=2GLqstVdfEp5k17R12C60I6B1y0TG167&page=1&perpage=16
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

