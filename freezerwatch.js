var lacrosse = require("lacrosse");

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('freezerwatch.json', 'utf8'));

var client = new lacrosse.Client(config);

// XXX make into command line with no extension - look for example and crib

//client.on("login" );
// , function() {
//     console.log("you have %s devices.", client.devices.length);
//     for (var d in client.devices) {
//         console.log(d);
//     }
// });

if (process.argv[2] != "--live") {
    console.log("Usage: freezerwatch --live --device=\"123\" --device=\"456\" --device=\"789\"");
    return process.exit(1);
}

// XXX get device IDs from command line

// XXX get gulp-file with node-quality to replace Rakefile with Quality

// XXX get last reading from each device

var device = new client.Device("deviceid");
console.log("created device");
var stream = device.createReadStream();
console.log("created stream");
stream.on("data", console.log);
stream.on("error", console.log);
console.log("events registered");
