var geolib = require('geolib');

// function musollahSession(chatId) {
//     this.chatId = chatId;
//     this.onGoing = false;
//     musollahSessions[chatId] = this;
// }

// function processLocation(msg) {
//     var chatId = msg.chat.id;
//     var musollahSession = musollahSessions[chatId] || new musollahSession(chatId);
//     if (musollahSession.onGoing) {
//         return musollahLocator(chatId, msg.text, msg.location);
//     }
//     return default_msg(chatId);
// }

function musollahLocator(chatId){
    return bot.sendMessage(chatId,"Searching Musollah Locator");
    /* var locResponse = "Please send me your location to find NUS bus timings for the nearest bus stop:\n\n";
    locResponse += "You can do this by selecting the paperclip icon (📎) ";
    locResponse += "followed by attaching your location (📌).";

    if (region === "nearest musollah") {
        return bot.sendMessage(chatId,locResponse, {
            reply_markup:JSON.stringify({
                hide_keyboard: true
            })
        });*/
    // }

    // function callback(err, data) {
    //     if (err) {
    //         return bot.sendMessage(chatId, err, {
    //             parse_mode: "Markdown",
    //             reply_markup: JSON.stringify({
    //                 hide_keyboard: true
    //             })
    //         });
    //     }
    //     bot.sendMessage(chatId, data, {
    //         parse_mode: "Markdown",
    //         reply_markup: JSON.stringify({
    //             hide_keyboard: true
    //         })
    //     });
    //     nusbusSessions[chatId] = new NusBusSession(chatId);
    // }
    // travel.nusbus(callback, busstop_name, location);
}
module.exports ={
	// processLocation: processLocation,
	musollahLocator: musollahLocator
}

