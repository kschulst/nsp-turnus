Accounts.ui.config({
  requestPermissions: {
    google: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar']
  },
  requestOfflineToken: {
    google: true
  }
});

if (Meteor.isClient) {
	this.nsp = (function () {

	var myPrivateMethod;

    var calendar;
	var API_URL_CALENDARLIST = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
	var API_URL_CALENDARS = "https://content.googleapis.com/calendar/v3/calendars";

	var NSP_API_KEY = "AIzaSyAp8jUdjYnJ5ze36yc5tTyT9HowWu97kAc";
	var NSP_CALENDAR_NAME = "NSP Turnus";
	var NSP_CALENDAR_DESRIPTION = "Kalender brukt av NSP Turnus. Denne kalenderen vil bli overskrevet automatisk. Ikke gjør manuelle endringer her.";



	gcalOptions = function() {
		return {
//	  		params: {key: NSP_API_KEY},
	  		headers: {
				'Authorization': 'Bearer ' + Meteor.user().services.google.accessToken
//                'Access-Control-Allow-Origin': '*'
	  		}
		}
	};

    gcalHttpCall = function(method, url, resultOrErrorCallback, extraOptions) {
        var options = gcalOptions();

        if (extraOptions !== undefined) {
            options = $.extend(options, extraOptions);
        }

        HTTP.call(method, url, options, resultOrErrorCallback);
    };

    gcal = function(method, url, extraOptions) {
        var deferred = $.Deferred();

        gcalHttpCall(method, url, function(error, result) {
            if (result !== undefined) {
                return deferred.resolve(result);
            }
            else {
                return deferred.reject(error);
            }
        }, extraOptions);

        return deferred.promise();
    };

	createNspCalendar = function() {
        console.log("createNspCalendar");
		return gcal("POST", API_URL_CALENDARS, {
            data: {
                summary: NSP_CALENDAR_NAME,
                description: NSP_CALENDAR_DESRIPTION,
                location: "Norway",
                timeZone: "Europe/Oslo"
            }
		});
	};

    /**
     * @returns calendarId of the calendar or empty string ("") if not found
     *
     * TODO: Only retrieve necessary fields
     */
    findNspCalendarId = function() {
        console.log("findNspCalendarId");
        var deferred = $.Deferred();

        gcal("GET", API_URL_CALENDARLIST).then(function(result) {
            $.each(result.data.items, function(index, item) {
                if (item.summary === NSP_CALENDAR_NAME) {
                    return deferred.resolve(item.id);
                }
            })

            return deferred.resolve();
        });

        return deferred.promise();
    };

    getNspCalendar = function(id) {
        console.log("getNspCalendar");
        return gcal("GET", API_URL_CALENDARS + "/" + id);
    };

    createEvent = function(event) {
        console.log("createEvent");
        return gcal("POST", API_URL_CALENDARS + "/" + calendar.id + "/events", {
            data: event
        });
    };

    getEventsBetween = function(start, end) {
        console.log("getEventsBetween " + start + " and " + end);
        return gcal("GET", API_URL_CALENDARS + "/" + calendar.id + "/events?timeMin=" + start + "&timeMax=" + end);
    }

    deleteEvent = function(eventId) {
        console.log("deleteEvent");
        return gcal("DELETE", API_URL_CALENDARS + "/" + calendar.id + "/events/" + eventId);
    };


    return {
    // ------------------------------------------------------------------------
    // Public stuff goes here
    // ------------------------------------------------------------------------

        cal: function() {
            var deferred = $.Deferred();

            if (calendar) {
                return deferred.resolve(calendar);
            }

            findNspCalendarId().then(function(calendarId) {
                if (calendarId === undefined) {
                    console.log("calendar not found, creating new....");
                    createNspCalendar().then(function(result) {
                        calendar = result.data;
                        deferred.resolve(calendar);
                    });
                }
                else {
                    console.log("Calendar exists, fetching it....");
                    getNspCalendar(calendarId).then(function(result) {
                        calendar = result.data;
                        console.log("Fetched calendar", calendar);
                        deferred.resolve(calendar);
                    });
                }

            }, function(error) {
                console.log("Error in nsp.initCal()", error);
                deferred.reject(error);
            });

            return deferred.promise();
        },

        createDuty: function(duty) {
            this.cal().then(function() {
                createEvent(dutyToEvent(duty));
            });
        },

        getEventStuff: function() {
            this.cal().then(function() {
                getEventsBetween("2013-09-01T00:00:00+02:00", "2013-12-01T00:00:00+02:00").then(function(result) {
                   console.log("events between a and b", result.data.items.length);
                });
            });
        },

        // this.deleteEventsBetween(moment("2013-06-01").toISOString(), moment("2013-09-01").toISOString());
        deleteEventsBetween: function(start, end) {
            this.cal().then(function() {
                getEventsBetween(start, end).then(function(result) {
                    $.each(result.data.items, function(index, item) {
                        deleteEvent(item.id);
                        console.log("deleting event", item.id);
                    })


                });
            });
        }
    };
	})();




}


