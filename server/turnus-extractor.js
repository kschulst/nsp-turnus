Meteor.methods({
    testStuff: function() {

        result = HTTP.get("http://www.timeanddate.com/worldclock/city.html?n=136");
        $ = Cheerio.load(result.content);
        CurrentTime = $('#ct').html();
        return CurrentTime;
    }
/*
    getTime: function () {
        result = Meteor.http.get("http://www.timeanddate.com/worldclock/city.html?n=136");
        $ = cheerio.load(result.content);
        CurrentTime = $('#ct').html();
        return CurrentTime;
    }
*/
});