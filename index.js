var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');
var util = require('./public/api/util');

var prayer = require('./public/prayer times/prayer.json');
var musollah = require('./public/api/musollah');
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
            case "musollah":
                return (musollahSessions[chatId] = musollah.musollahAsk(chatId, bot));
        }
        switch (body.toLowerCase()) {
            default: var musollahSession = musollahSessions[chatId] || new musollah.MusollahSession(chatId);
            console.log(musollahSession.onGoing);
            if (musollahSession.onGoing) {
                return musollah.musollahQuery(chatId, body.toLowerCase(), msg.location, bot);
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
    if (musollahSession.onGoing) {
        musollah.musollahQuery(chatId, msg.text, msg.location, bot);
    }
}


function default_msg(chatId) {
    bot.sendMessage(chatId, "Sorry, I don't understand you! Try another command instead", {
        reply_markup: JSON.stringify({
            hide_keyboard: true
        })
    });
}
