var originalObj = require('./lib/originalObj');

var objectProxy = require('object-proxy');
var invokeHistory = require('object-proxy/util/invokeHistory');

var history = invokeHistory.create();
var proxied = objectProxy(originalObj, {
	after: history.recorder
});

proxied.greet('world');
// Hello world

console.log(history.recordings);
// greet('world')
