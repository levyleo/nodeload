// ------------------------------------
// Statistics Manager
// ------------------------------------
//
// This file defines qputs, qprint, and extends the util namespace.
//
// Extends node.js util.js with other common functions.
//
var BUILD_AS_SINGLE_FILE;
if (!BUILD_AS_SINGLE_FILE) {
var util = require('util');
var NODELOAD_CONFIG = require('./config').NODELOAD_CONFIG;
}

// A few common global functions so we can access them with as few keystrokes as possible
//
var qputs = util.qputs = function(s) {
    if (!NODELOAD_CONFIG.QUIET) { util.puts(s); }
};

var qprint = util.qprint = function(s) {
    if (!NODELOAD_CONFIG.QUIET) { util.print(s); }
};


// Static utility methods
//
util.uid = function() {
    exports.lastUid_ = exports.lastUid_ || 0;
    return exports.lastUid_++;
};
util.defaults = function(obj, defaults) {
    for (var i in defaults) {
        if (obj[i] === undefined) {
            obj[i] = defaults[i];
        }
    }
    return obj;
};
util.extend = function(obj, extension) {
    for (var i in extension) {
        if (extension.hasOwnProperty(i)) {
            obj[i] = extension[i];
        }
    }
    return obj;
};
util.forEach = function(obj, f) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            f(i, obj[i]);
        }
    }
};
util.argarray = function(args) {
    return (args instanceof Array) ? args : [].concat.apply([], args);
};
util.localHostname = function() {
    return 'localhost';
};
util.readStream = function(stream, callback) {
    var data = [];
    stream.on('data', function(chunk) {
        data.push(chunk.toString());
    });
    stream.on('end', function() {
        callback(data.join(''));
    });
};

/** Make an object an UpdateEventGenerator by adding UpdateEventGenerator.call(this) to the constructor.
Monitor should gather statistics for each intervalMs period, and generate 'update' events */
util.PeriodicUpdater = function(updateIntervalMs) {
    var self = this, updateTimeoutId;
    this.__defineGetter__('updateInterval', function() { return updateIntervalMs; });
    this.__defineSetter__('updateInterval', function(milliseconds) {
        clearInterval(updateTimeoutId);
        if (milliseconds > 0 && milliseconds < Infinity) {
            updateTimeoutId = setInterval(self.update.bind(self), milliseconds);
        }
        updateIntervalMs = milliseconds;
    });
    this.updateInterval = updateIntervalMs;
};

util.extend(exports, util);