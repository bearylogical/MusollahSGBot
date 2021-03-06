var prayertimes = require('../prayertimes/2016.json');



function sendPrayerTime(chatId,bot) {

    var today = new Date().toString().substr(0, 16);
    var message = String();
    message = "Prayer Times For" + '\n';
    var date = new Date();
    if (date.getFullYear() === 2016) {

        var targetDate = date.toDateString().split(' ')[2] + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        for (var i = 0; i < prayertimes.events.length; i++) {
            if (targetDate == prayertimes.events[i].Date) {
                message = message + "_"+ prayertimes.events[i].Hijri +"_" + " *|* " + today + '\n\n';
                message = message + "*Subuh* " + prayertimes.events[i].Subuh.replace(" ", ":") + "am" + '\t';
                message = message + "*Syuruk* " + prayertimes.events[i].Syuruk.replace(" ", ":") + "am" + '\n';
                message = message + "*Zohor* " + prayertimes.events[i].Zohor.replace(" ", ":") + "pm" + '\t';
                message = message + "*Asar* " + prayertimes.events[i].Asar.replace(" ", ":") + "pm" + '\n';
                message = message + "*Maghrib* " + prayertimes.events[i].Maghrib.replace(" ", ":") + "pm" + '\t';
                message = message + "*Isyak* " + prayertimes.events[i].Isyak.replace(" ", ":") + "pm" + '\n';

                bot.sendMessage(chatId, message,{
                    parse_mode : "Markdown"
                });
            }

        }

    } else {
        bot.sendMessage(chatId,"Prayer Times unavailable");
    }
}

module.exports ={
    sendPrayerTime : sendPrayerTime
}