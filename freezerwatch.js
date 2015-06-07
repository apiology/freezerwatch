var lacrosse = require("lacrosse");

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('freezerwatch.json', 'utf8'));

var client = new lacrosse.Client(config);

// XXX get Rakefile into place and into CI

// XXX make into command line with no extension - look for example and crib

//client.on("login" );
// , function() {
//     console.log("you have %s devices.", client.devices.length);
//     for (var d in client.devices) {
//         console.log(d);
//     }
// });

// XXX get device IDs from command line

// XXX reject if first argument isn't --live, to allow for future expansion

// XXX get gulp-file with node-quality to replace Rakefile with Quality

// XXX get last reading from each device

var device = new client.Device("deviceid");
console.log("created device");
var stream = device.createReadStream();
console.log("created stream");
stream.on("data", console.log);
stream.on("error", console.log);
console.log("events registered");
