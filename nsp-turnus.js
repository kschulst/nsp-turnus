if (Meteor.isClient) {
  Template.doit.events({
    'click input': function() {
        console.log("Contacting google calendar...");
        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
        url = "https://www.googleapis.com/calendar/v3/users/me/calendarList"
/*

        gapi.client.setApiKey('AIzaSyBXMjg7iXRgtXfxdnQvupbb0RRYoGnqNpA');
        gapi.client.load('calendar', 'v3', function() {
          console.log("Calendar loaded ok");
          request = gapi.client.calendar.calendarList.list();
          result = request.execute(function(response) {
            console.log("request result is...", response);
        });
        });
*/
  }});
}

if (Meteor.isServer) {
  Meteor.startup(function () {


    // code to run on server at startup
  });
}
