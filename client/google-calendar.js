Accounts.ui.config({
  requestPermissions: {
    google: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar']
  },
  requestOfflineToken: {
    google: true
  }
/*  ,passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'*/
});

if (Meteor.isClient) {
	this.nsp = (function () {

	var myPrivateMethod;

    var calendar;
	var API_URL_CALENDARLIST = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
	var API_URL_CALENDARS = "https://www.googleapis.com/calendar/v3/calendars";

	var NSP_API_KEY = "AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA";
	var NSP_CALENDAR_NAME = "NSP Turnus";
	var NSP_CALENDAR_DESRIPTION = "Kalender brukt av NSP Turnus. Denne kalenderen vil bli overskrevet automatisk. Ikke gjør manuelle endringer her.";

	gcalOptions = function() {
		return {
	  		params: {key: NSP_API_KEY},
	  		headers: {
				'Authorization': 'Bearer ' + Meteor.user().services.google.accessToken
	  		}
		}
	};

    gcalHttpCall = function(method, url, resultOrErrorCallback, extraOptions) {
        var options = gcalOptions();

        if (extraOptions !== undefined) {
            options = $.extend(options, extraOptions);
        }

        Meteor.http.call(method, url, options, resultOrErrorCallback);
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
        var deferred = $.Deferred();

        gcal("GET", API_URL_CALENDARLIST).then(function(result) {
            console.log("finding calendar result is here", result)
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
        return gcal("GET", API_URL_CALENDARS + "/" + id);
    };

/*
    createEvent = function(event) {
        return gcal("POST", API_URL_CALENDARS + "/" + calendar.id + "/events", {
            data: {
                summary: "navn på event",
                description: "en bezkrivelse",
                start: {dateTime: "2013-08-15T13:00:00+02:00"},
                end: {dateTime: "2013-08-15T15:45:00+02:00"}
            }
        });
    }
*/
    createEvent = function(event) {
        console.log("Calendar", calendar);

        return gcal("POST", API_URL_CALENDARS + "/" + calendar.id + "/events", {
            data: event
        });
    }


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
                    console.log("Calendar exists, fetching it....", calendarId);
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

        createEventStuff: function() {
            this.cal().then(createEvent);
        },

        createDuty: function() {
            var duty = {
                dutyNumber: "2310",
                conductorNumber: "12345",
                conductorName: "Bamble Bollerud",
                startLocation: "Oslo S",
                endLocation: "Oslo S",
                start: "2013-08-15T08:00:00+02:00",
                end: "2013-08-15T15:45:00+02:00",
                timeInterval: "13:00-15:45",
                tasks: [
                    {
                        from: "2013-08-15T09:30:00+02:00",
                        to: "2013-08-15T11:00:00+02:00",
                        description: "Joda",
                        taskNumber: "",
                        taskRole: "",
                        url: ""
                    }
                ]
            };

            this.cal().then(function() {
                createEvent({
                    summary: duty.timeInterval + " (" + duty.dutyNumber + ")",
                    description: "en bezkrivelse",
                    start: {dateTime: duty.start},
                    end: {dateTime: duty.end}
                });
            });
        }



	};
	})();




}


