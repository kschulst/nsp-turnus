console.log("KEN> google-calendar.js BEGIN");

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

    gcal = function(method, url, resultOrErrorCallback, extraOptions) {
        var options = gcalOptions();

        if (extraOptions !== undefined) {
            options = $.extend(options, extraOptions);
        }

        Meteor.http.call(method, url, options, resultOrErrorCallback);
    };

    gcal2 = function(method, url, deferred, extraOptions) {
        return gcal(method, url, function(error, result) {
            if (result !== undefined) {
                return deferred.resolve(result.data);
            }
            else {
                return deferred.reject(error);
            }
        }, extraOptions);

//        return deferred.promise();
    };

    promisedResult = function(deferred, error, result) {
        if (result !== undefined) {
            return deferred.resolve(result.data);
        }
        else {
            return deferred.reject(error);
        }
    };

	createNspCalendar = function() {
		var deferred = $.Deferred(),
            data = {
                data: {
                    summary: NSP_CALENDAR_NAME,
                    description: NSP_CALENDAR_DESRIPTION,
                    location: "Norway",
                    timeZone: "Europe/Oslo"
		        }
            };

		gcal("POST", API_URL_CALENDARS, function(error, result) {
            return promisedResult(deferred, error, result);
		}, data);

        return deferred.promise();
	};

	//TODO: Only retrieve necessary fields
    /**
     *
     * @returns calendarId of the calendar or "" if not found
     */
    findNspCalendarId = function() {
        var deferred = $.Deferred();

        gcal("GET", API_URL_CALENDARLIST, function(error, result) {
            if (result !== undefined) {
                $.each(result.data.items, function(index, item) {
                    if (item.summary === NSP_CALENDAR_NAME) {
                        return deferred.resolve(item.id);
                    }
                })

                return deferred.resolve();
            }

            return deferred.reject();
        });

        return deferred.promise();
    };

	getNspCalendar = function(id) {
        var deferred = $.Deferred();

		gcal("GET", API_URL_CALENDARS + "/" + id, function(error, result) {
			console.log("retrieved nsp calendar", error, result);
            return promisedResult(deferred, error, result);
	    });

        return deferred.promise();
    };

    createEvent = function() {
        var deferred = $.Deferred()

        return gcal2("POST", API_URL_CALENDARS + "/" + calendar.id + "/events", deferred, {
            data: {
                summary: "navn på event",
                description: "en beskrivelse",
                start: {dateTime: "2013-08-13T13:00:00+02:00"},
                end: {dateTime: "2013-08-13T15:45:00+02:00"}
            }
        });

        return deferred.promise();
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
                    createNspCalendar().then(function(error, result) {
                        calendar = result.data;
                        deferred.resolve(calendar);
                    });
                }
                else {
                    console.log("Calendar exists, fetching it....", calendarId);
                    getNspCalendar(calendarId).then(function(result) {
                        calendar = result;
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
            var deferred = $.Deferred();
            this.cal().then(createEvent);

            return deferred.promise();
        }


	};
	})();




}


/*
gapi.client.load('calendar', 'v3', new function() {
  	console.log("KEN> GAPI LOADED");
  });
*/



/*
function load() {
	console.log('KEN> in load');
  that.gapi.client.setApiKey('AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA');

	console.log('KEN> after load');

}

load();
*/
/*
gCal = 
  insertEvent: (cliente, poblacion, texto, fecha)->
    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    event=  {
      summary: cliente
      location: poblacion
      description: texto
      start:
        "date": fecha
      end:
        "date": fecha
      }
    evento = JSON.stringify event
    console.log evento
    Auth = 'Bearer ' + Meteor.user().services.google.accessToken
    Meteor.http.post url, {
      params: {key: 'INSERT-YOUR-API-KEY-HERE'},
      data: event,
      headers: {'Authorization': Auth }
      }, 
      (err, result)->
        console.log result
        return result.id
*/









console.log("KEN> google-calendar.js END");


