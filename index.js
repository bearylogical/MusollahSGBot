var TelegramBot = require('node-telegram-bot-api');
var CREDENTIALS = require('./private/telegram_credentials.json');
var chalk = require('chalk');
var request = require('request');
var cheerio = require('cheerio');
var locator = require('./public/api/locator');
var prayertimes2015 = require('./public/prayertimes/2015.json');

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
        // if (msg.hasOwnProperty('location')) {
        //     return locator.processLocation(msg);
        // }
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
                return bot.sendMessage(chatId, "Searching Musollah"); //locator.musollahLocator(chatId);
            case "prayer times":
                return prayertime(chatId);
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

function prayertime(chatId) {

    var today = new Date().toString().substr(0, 16);
    var message = String();
    message = "Prayer Times For" + '\n';

    var date = new Date();
    if (date.getFullYear() == 2015) {

        var targetDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        for (var i = 0; i < prayertimes2015.events.length; i++) {
            if (targetDate == prayertimes2015.events[i].Date) {
                message = message + prayertimes2015.events[i].Hijri + " / " + today + '\n';
                message = message + "Subuh " + prayertimes2015.events[i].Subuh.replace(" ", ":") + "am" + '\t';
                message = message + "Syuruk " + prayertimes2015.events[i].Syuruk.replace(" ", ":") + "am" + '\n';
                message = message + "Zohor " + prayertimes2015.events[i].Zohor.replace(" ", ":") + "pm" + '\t';
                message = message + "Asar " + prayertimes2015.events[i].Asar.replace(" ", ":") + "pm" + '\n';
                message = message + "Maghrib " + prayertimes2015.events[i].Maghrib.replace(" ", ":") + "pm" + '\t';
                message = message + "Isyak " + prayertimes2015.events[i].Isyak.replace(" ", ":") + "pm" + '\n';
                bot.sendMessage(chatId, message);
            }

        }

    } else {
        bot.sendMessage("Prayer Times unavailable");
    }
}
