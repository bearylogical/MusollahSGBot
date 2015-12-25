var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');
var util = require('./public/api/util');


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
                return musollahAsk(chatId);
        }
         switch (body.toLowerCase()) {
            default:
                var musollahSession = musollahSessions[chatId] || new MusollahSession(chatId);
                if (musollahSession.onGoing) {
                    return musollahQuery(chatId, body);
                }
        }	

        return default_msg(chatId);
    } catch (e) {
        bot.sendMessage(msg.chat.id, "MusollahBot has encountered an Error, please try again later");
        bot.sendMessage('49892469', e.toString());
    }
});

function MusollahSession(chatId) {
    this.chatId = chatId;
    this.onGoing = false;
    musollahSessions[chatId] = this;
}


function default_msg(chatId) {
    bot.sendMessage(chatId, "Sorry, I don't understand you! Try another command instead", {
        reply_markup: JSON.stringify({
            hide_keyboard: true
        })
    });
}

function musollahAsk(chatId) {
    var opts = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Nearest Musollah'],
                ['UTown']
            ],
            one_time_keyboard: true
        })
    };
    var greeting = "Good" + util.currentTimeGreeting();
    bot.sendMessage(chatId, greeting + " Where would you like prayer locations for?", opts);
}

function musollahQuery(chatId,musollahName) {
	
}
