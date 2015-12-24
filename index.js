var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');


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
        }
        return default_msg(chatId);
    } catch (e) {
        bot.sendMessage(msg.chat.id, "Cinnabot is sleeping right now 😴 Wake him up later.").then(function() {
            bot.sendMessage(msg.chat.id, "Here's a catfact instead:").then(function() {
                catfact(msg.chat.id);
            });
        });
        bot.sendMessage('49892469', e.toString());
    }
});
