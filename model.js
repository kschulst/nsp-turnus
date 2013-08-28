dutyToEvent = function(duty) {
    var eventBody = "",
        numMinutes = moment(duty.end).diff(duty.start, "minutes"),
        duration = moment.duration(numMinutes, "minutes");

    $.each(duty.tasks, function(index, task) {
        eventBody += hhMMIntervalString(task.start, task.end)
            + " " + task.description;

        if (task.taskNumber && task.taskRole) {
            eventBody += " (" + task.taskNumber + " " + task.taskRole + ")";
        }
/*
 Totalt 5 timer og 48 minutter
 Synkronisert 09. Aug kl. 21:28
 */
        eventBody += "\n"
    })

    eventBody += "\nTotalt " + duration.hours() + " timer og " + duration.minutes() + " minutter";
    eventBody += "\nSynkronisert " + humanDateAndTimeString(new Date());

    return {
        summary: hhMMIntervalString(duty.start, duty.end)  + " (" + duty.dutyNumber + ")",
        description: eventBody,
        start: {dateTime: duty.start},
        end: {dateTime: duty.end}
    };
}
