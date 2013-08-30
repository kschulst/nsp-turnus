Package.describe({
  summary: "Tiny, fast, and elegant implementation of core jQuery designed specifically for the server"
});

Npm.depends({
    'cheerio': '0.12.1'
});

Package.on_use(function(api) {
	api.add_files('cheerio.js', 'server');
	//api.use('cheerio', ['server']);

    if (typeof api.export !== 'undefined') {
        api.export(['Cheerio'], 'server'); // 1st arg can be array of exported constructors/objects, 2nd can be 'server', 'client', ['client', 'server']
    }

});