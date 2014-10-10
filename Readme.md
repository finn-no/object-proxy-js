# object-proxy [WIP] [![travis status](https://api.travis-ci.org/finn-no/object-proxy-js.png)](http://travis-ci.org/finn-no/object-proxy-js)

Module to wrap a proxy object around any object, primarly for method invocation hooks.

## Usage

```js
var originalObj = {
    greet: function(name){
        console.log('Hello ' + name);
    }
};
```

### before hook

Register a callback which gets called just before the actual method gets invoked.

```js
var objectProxy = require('object-proxy');
var proxied = objectProxy(originalObj, {
    before: function(parentObjectName, methodName, args) {
        console.log('just before ' + methodName + ' is called');
    }
});

proxied.greet('world');
// just before greet is called
// Hello world
```

### after hook

Register a callback which gets called just after the actual method was invoked.

```js
var objectProxy = require('object-proxy');
var proxied = objectProxy(originalObj, {
    after: function(parentObjectName, methodName, args) {
        console.log('just after ' + methodName + ' was called');
    }
});

proxied.greet('world');
// Hello world
// just after greet was called
```

### Utilities

#### invoke history

Record history of all method invocations on the proxied object.

```js
var objectProxy = require('object-proxy');
var invokeHistory = require('object-proxy/util/invokeHistory');

var history = invokeHistory.create();
var proxied = objectProxy(originalObj, {
    after: history.recorder
});

proxied.greet('world');
// Hello world

console.log(history.recordings);
// [ 'greet("world")' ]
```

Running sample in [samples/invokeHistory.js](./samples/invokeHistory.js)
