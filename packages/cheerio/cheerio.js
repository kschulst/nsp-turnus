Cheerio = Npm.require("cheerio");
cheerioFacade = {
    get: function(options) {
        return new Cheerio(options);
    }
};