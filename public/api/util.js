function currentTimeGreeting() {
    var hours = new Date().getHours();
    if (hours < 12) {
        return "morning";
    } else if (hours >= 12 && hours < 18) {
        return "afternoon";
    } else if (hours >= 18) {
        return "evening";
    } else {
        return "";
    }
}

module.exports = {
    currentTimeGreeting: currentTimeGreeting
}