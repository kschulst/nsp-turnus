console.log("KEN> google-calendar.js BEGIN");

Accounts.ui.config({
  requestPermissions: {
    google: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  requestOfflineToken: {
    google: true
  }
/*  ,passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'*/
});

if (Meteor.isClient) {

	this.nsp = (function () {

	  var calendar, myPrivateMethod;

	  var NSP_API_KEY = "AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA";
	  var accessToken = Meteor.user().services.google.accessToken;

	  // A private counter variable
	  myPrivateVar = 0;


	  // A private function which logs any arguments
	  gcal = function(method, url, data, resultOrErrorCallback) {
	  	console.log(method + " to " + url + " ", NSP_API_KEY, accessToken);
	  	Meteor.http.call(method, url, {
	  		params: {key: NSP_API_KEY},
	  		data: data,
	  		headers: {
				'Authorization': 'Bearer ' + accessToken
	  		}
	  	},
	  	new function(error, result) {
	  		console.log("result", result, error);
	  		return result;
	  	});



// TODO: Add User agent? Like:
// X-JavaScript-User-Agent:  Google APIs Explorer

/*
    Meteor.http.post url, {
      params: {key: 'INSERT-YOUR-API-KEY-HERE'},
      data: event,
      headers: {'Authorization': Auth }
      }, 
      (err, result)->
        console.log result
        return result.id
*/
	  	};

	  	getAllCalendars = function() {
	  		var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";

console.log("before call");

		  	Meteor.http.get(url, {
		  		params: {key: 'AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA'},
		  		headers: {
					'Authorization': 'Bearer ' + accessToken
		  		}
		  	},
		  	function(error, result) {
		  		console.log("result", result, error);
		  		return result;
		  	});

console.log("after call");

/*
	  		return gcal("GET", "https://www.googleapis.com/calendar/v3/users/me/calendarList", "", new function(error, result) {
	  			console.log("got calendars...", result, error);
	  		});
*/
	  	};


	  return {

	    // A public variable
	    myPublicVar: "i am public",

	    // A public function utilizing privates
	    cal: function() {
	    	if (calendar === undefined) {
		    	console.log("retrieving nsp calendar...");
		    	calendar = getAllCalendars();
	    	}

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


