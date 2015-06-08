#!/usr/bin/env node

var lacrosse = require("lacrosse");

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('freezerwatch.json', 'utf8'));

var client = new lacrosse.Client(config);

var optparse = require('optparse');

function usage(usageString, code) {
    console.log(usageString.toString());
    return process.exit(code);
}

function parseDeviceIds() {
    var deviceIds = [];
    var mode;
    var switches = [
        ['-h', '--help', 'Shows help sections'],
        ['-l', '--live', 'Report on liveness of the sensor system.  Returns 0 exit code if all sensors are reading within the last day and have full batteries.'],
        ['-d STRING', '--device STRING', "Which device to monitor--specify this argument multiple times to monitor multiple devices.  You can find device IDs by logging into lacrossealerts.com/login and looking at the link that your 'Download' button points to."],
    ];

    // Create a new OptionParser.
    var parser = new optparse.OptionParser(switches);

    parser.banner = "Usage: freezerwatch --live --device=\"123\" --device=\"456\" --device=\"789\"";

    var help = parser.toString();

    // Hook the help option. The callback will be executed when the OptionParser
    // hits the switch `-h` or `--help`.
    parser.on('help', function() {
        usage(help, 0);
    });

    parser.on('live', function() {
        mode = 'live';
    });

    parser.on('device', function(name, deviceId) {
        console.log("Parsed device Id " + deviceId);
        deviceIds.push(deviceId);
    });

    parser.parse(process.argv);

    return { help: help, mode: mode, deviceIds: deviceIds};
}

var options = parseDeviceIds(process.argv);

if (!options.mode) {
    usage(options.help, 1);
}

options.deviceIds.forEach(function(deviceId) {
    console.log("Pulling data for " + deviceId);
    var device = new client.Device(deviceId);
    console.log("created device");
    var s = device.createSingleReadStream();
    console.log("created stream");
    s.on("data", console.log);
    //stream.on("error", console.log);
    console.log("events registered");
});

// XXX: Consolidate answers into an array and output

// XXX: Write function to determine exit value for one

// XXX: Write code to consolidate individual exit values and output final one

// XXX: Test out

// XXX: Push

// XXX: Get working in VLD and push changes

// XXX: Figure out why I'm getting multiple responses per item

// XXX: Refactor node-lacrosse improvements

// XXX: Create node-lacrosse pull request

// XXX: Point to my own snapshot of node-lacrosse

// XXX: publish

// XXX: add JSHint to rake quality

// XXX: Brainstorm errors to handle, add (manual) tests

// XXX: Crib style hints from optparse

// XXX: get gulp-file with node-quality to replace Rakefile with Quality

// XXX: Figure out style help tool 
