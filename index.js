var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');
var util = require('./public/api/util');

var musollah = require('./public/api/musollah');
var prayerTime = require('./public/api/prayertime');
var sgmusollah = require('./public/api/sgmusollah');
var nus = require('./public/locations/nusMusollah.json');
var bot = new TelegramBot(CREDENTIALS.token, {
    polling: true
});

console.log(chalk.blue("============================"));
console.log(chalk.blue("                            "));
console.log(chalk.blue("     MusollahBot Started    "));
console.log(chalk.blue("                            "));
console.log(chalk.blue("============================"));
console.log(chalk.blue("                            "));

var musollahSessions = {};
var SGmusollahSessions = {};

bot.on('message', function(msg) {
    try {
        console.log(msg);
        if (!msg.hasOwnProperty('text') && !msg.hasOwnProperty('location')) {
            return false;
        }
        if (msg.hasOwnProperty('location')) {
            return processLocation(msg);
        }


        var chatId = msg.chat.id;
        var body = msg.text;
        var command = body;
        var args = body;
        if (body.charAt(0) === '/') {
            command = body.split(' ')[0].substr(1);
            args = body.split(' ')[1];
        }

        switch (command.toLowerCase()) {
            case "start":
                return help(chatId);
            case "help":
                return help(chatId);
            case "musollah":
                return (musollahSessions[chatId] = musollah.musollahAsk(chatId, bot));
            case "sgmusollah":
                return (SGmusollahSessions[chatId] = sgmusollah.SGmusollahAsk(chatId, bot));
            case "prayer":
                return (prayerTime.sendPrayerTime(chatId, bot));
        }
        console.log(musollahSessions[chatId]);
        switch (body.toLowerCase()) {
            default: 
            var musollahSession = musollahSessions[chatId] || new musollah.MusollahSession(chatId);
            var SGmusollahSession = SGmusollahSessions[chatId] || new sgmusollah.SGMusollahSession(chatId);
            if (musollahSession.onGoing) {
                return musollah.musollahQuery(chatId, body.toLowerCase(), msg.location, bot);
            }
            
            if (SGmusollahSession.onGoing) {
                return sgmusollah.SGmusollahLocator(chatId, msg.location, bot);
            }
        }
        return default_msg(chatId);
    } catch (e) {
        bot.sendMessage(msg.chat.id, "MusollahBot has encountered an Error, please try again later");
        bot.sendMessage('49892469', e.toString());
    }
});

function processLocation(msg) {
    var chatId = msg.chat.id;
    var musollahSession = musollahSessions[chatId] || new musollah.MusollahSession(chatId);
    var SGmusollahSession = SGmusollahSessions[chatId] || new sgmusollah.SGMusollahSession(chatId);
    if (musollahSession.onGoing) {
        musollah.musollahQuery(chatId, msg.text, msg.location, bot);
    } else if (SGmusollahSession.onGoing) {
        sgmusollah.SGmusollahLocator(chatId, msg.location, bot);
    } else {
        return default_msg(chatId);
    }
}

function help(chatId) {
    var helpMessage =
        "Salaam and welcome to MusollahBot\n" +
        "Here's what you can ask!\n\n" +
        "/musollah - provide directions to musollahs\n" +
        "/prayer - provide prayer times\n" +
        "/sgmusollah - provide directions to musollahs around SG";
    bot.sendMessage(chatId, helpMessage);
}

function default_msg(chatId) {
    bot.sendMessage(chatId, "Sorry, I don't understand you! Try another command instead", {
        reply_markup: JSON.stringify({
            hide_keyboard: true
        })
    });
}
