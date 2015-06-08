#!/usr/bin/env node

var lacrosse = require("lacrosse");

var fs = require('fs');

var osenv = require('osenv');

var homedir = osenv.home();

var config = JSON.parse(fs.readFileSync(homedir + '/private/freezerwatch.json',
                                        'utf8'));

var client = new lacrosse.Client(config);

var optparse = require('optparse');

var async = require('async');

var verbose = false;

function debug(message) {
    if (verbose) {
        console.log(message);
    }
}

function usage(usageString, code) {
    console.log(usageString.toString());
    return process.exit(code);
}

function parseDeviceIds() {
    var deviceIds = [];
    var mode;
    var switches = [
        ['-h', '--help', 'Shows help sections'],
        ['-l', '--live',
         'Report on liveness of the sensor system.  ' +
         'Returns 0 exit code if all sensors are reading ' +
         'within the last day and have full batteries.'],
        ['-v', '--verbose', 'Report debugging information.'],
        ['-d STRING', '--device STRING',
         "Which device to monitor--specify this argument multiple times to " +
         "monitor multiple devices.  You can find device IDs by logging into " +
         "lacrossealerts.com/login and looking at the link that your " +
         "'Download' button points to."],
    ];

    // Create a new OptionParser.
    var parser = new optparse.OptionParser(switches);

    parser.banner =
        "Usage: freezerwatch --live " +
        "--device=\"123\" --device=\"456\" --device=\"789\"";

    var help = parser.toString();

    // Hook the help option. The callback will be executed when the OptionParser
    // hits the switch `-h` or `--help`.
    parser.on('help', function() {
        usage(help, 0);
    });

    parser.on('live', function() {
        mode = 'live';
    });

    parser.on('verbose', function() {
        verbose = true;
    });

    parser.on('device', function(name, deviceId) {
        debug("Parsed device Id " + deviceId);
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
    debug("parsing this reading: " + JSON.stringify(reading));
    return new Date(reading.timestamp) > yesterday() &&
        !reading.lowBattery;
}

async.map(options.deviceIds,
          function(deviceId, cb) {
              debug("Pulling data for " + deviceId);
              var device = new client.Device(deviceId);
              debug("created device " + deviceId);
              var s = device.createSingleReadStream();
              debug("created stream");
              var called = false;
              s.on("data", function(data) {
                  if (!called) {
                      cb(null, data);
                  }
                  called = true;});
              s.on("error", function(error) { cb(error, nil); });
              //stream.on("error", console.log);
              debug("events registered");
          },
          function(err, result) {
              if (err) {
                  debug("error is " + JSON.stringify(err));
                  throw err;
              } else {
                  debug("result is " + JSON.stringify(result));
                  everythingIsLive = result.map(isLive)
                      .reduce(function(everythingElseLive, thisItemLive) {
                          return everythingElseLive && thisItemLive;
                      });
                  if (everythingIsLive) {
                      process.exit(0);
                  } else {
                      process.exit(1);
                  }
              }
          });

// XXX: add JSHint to rake quality

// XXX: Brainstorm errors to handle, add (manual) tests

// XXX: get gulp-file with node-quality to replace Rakefile with Quality

// XXX: Figure out style help tool
