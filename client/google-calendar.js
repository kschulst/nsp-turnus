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

	var calendar, myPrivateMethod;

	var API_URL_CALENDARLIST = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
	var NSP_API_KEY = "AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA";
	var NSP_CALENDAR_NAME = "NSB Turnus";

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


	//TODO: Only retrieve necessary fields
	findNspCalendar = function() {
		return gcal("GET", API_URL_CALENDARLIST, function(error, result) {
	  			console.log("got calendars...", result, error);

	  			if (result !== undefined) {

	  				// TODO: Use fancier code to accomplish this ;)
	  				$.each(result.data.items, function(index, item) {
	  					if (item.summary === NSP_CALENDAR_NAME) {
	  						console.log("FOUND IT!");
	  						calendar = item.id;
	  					}
//	  					console.log("item", index, item);	
	  				})
	  			}
	  		}
	  		);
	 };

	return {

	    // A public variable
	    myPublicVar: "i am public",

	    // A public function utilizing privates
	    cal: function() {
	    	if (calendar === undefined) {
		    	console.log("retrieving nsp calendar...");
		    	findNspCalendar();
	    	}

console.log("CALENDAR ID: " + calendar)
	    	return calendar;
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


