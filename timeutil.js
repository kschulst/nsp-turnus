//moment.lang("no");

hhMMString = function(date) {
    return moment(date).format("HH:mm");
}

// Like: "09. Aug kl. 21:28"
humanDateAndTimeString = function(date) {
    return moment(date).format('DD. MMM [kl.] HH:mm')
}

hhMMIntervalString = function(start, end) {
    return hhMMString(start) + "-" + hhMMString(end);
}