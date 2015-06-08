#!/usr/bin/env node

var lacrosse = require("lacrosse");

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('freezerwatch.json', 'utf8'));

var client = new lacrosse.Client(config);

var optparse = require('optparse');

var async = require('async');

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

function toDate(str) {
    var d = new Date(str);
    console.log("Out of string " + str + ", parsed out " + d);
    return d;
}

function yesterday() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
}

function isLive(reading) {
    console.log("parsing this reading: " + JSON.stringify(reading));
    return new Date(reading.timestamp) > yesterday() &&
        !reading.lowBattery;
}

async.map(options.deviceIds,
          function(deviceId, cb) {
              console.log("Pulling data for " + deviceId);
              var device = new client.Device(deviceId);
              console.log("created device " + deviceId);
              var s = device.createSingleReadStream();
              console.log("created stream");
              var called = false; // XXX: shouldn't need this
              s.on("data", function(data) {
                  if (!called) {
                      cb(null, data);
                  }
                  called = true;});
              s.on("error", function(error) { cb(error, nil); });
              //stream.on("error", console.log);
              console.log("events registered");
          },
          function(err, result) {
              if (err) {
                  console.log("error is " + JSON.stringify(err));
                  throw err;
              } else {
                  console.log("result is " + JSON.stringify(result));
                  console.log("Live map is " + result.map(isLive));
              }
          });

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
