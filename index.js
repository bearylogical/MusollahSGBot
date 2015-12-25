var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');

var locator = require('./public/api/locator');

var bot = new TelegramBot(CREDENTIALS.token, {
    polling: true
});

console.log(chalk.blue("============================"));
console.log(chalk.blue("                            "));
console.log(chalk.blue("     MusollahBot Started    "));
console.log(chalk.blue("                            "));
console.log(chalk.blue("============================"));
console.log(chalk.blue("                            "));

bot.on('message', function(msg) {
    try {
        console.log(msg);
        if (!msg.hasOwnProperty('text') && !msg.hasOwnProperty('location')) {
            return false;
        }
        if (msg.hasOwnProperty('location')) {
            return locator.processLocation(msg);
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
                return locator.musollahLocator(chatId);
        }
        /*switch (body.toLowerCase()) {
            default:
                var musollahSession = musollahSessions[chatId] || new musollahSession(chatId);
                if (musollahSession.onGoing) {
                    return locator.musollahLocator(chatId, body.toLowerCase(), msg.location);
                }
        }*/
        return default_msg(chatId);
    } catch (e) {
        bot.sendMessage(msg.chat.id, "MusollahBot has encountered an Error, please try again later");
        bot.sendMessage('139006926', e.toString());
    }
});

function default_msg(chatId) {
    bot.sendMessage(chatId, "Sorry, I don't understand you! Try another command instead", {
        reply_markup: JSON.stringify({
            hide_keyboard: true
        })
    });
}

