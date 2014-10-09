var noopFn = function() {};

function proxyMethod(originalObj, methodName, parentObjName, options) {
    return function() {
        var result;

        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        var $len = arguments.length;
        var args = new Array($len);
        for(var $i = 0; $i < $len; ++$i) { args[$i] = arguments[$i]; }

        options.before(parentObjName, methodName, args);
        result = originalObj[methodName].apply(originalObj, args);
        options.after(parentObjName, methodName, args);

        return result;
    };
}

// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#5-for-in
// workaround for getting all object keys with as little unoptimized code as possible
function allObjectKeys(obj) {
    var keys = [];
    for(var key in obj) {
        keys.push(key);
    }
    return keys;
}

function createProxyOf(originalObj, options, parentPropName) {
    var target = {};

    allObjectKeys(originalObj).forEach(function(propName) {
        var propValue = originalObj[propName];

        if (typeof(propValue) === 'function') {
            target[propName] = proxyMethod(originalObj, propName, parentPropName, options);
        } else if (typeof(propValue) === 'object' && !Array.isArray(propValue)) {
            target[propName] = createProxyOf(propValue, options, propName);
        } else {
            target[propName] = propValue;
        }
    });

    return target;
}

module.exports = function proxyFactory(originalObj, options) {
    options = options || {};

    var proxy = createProxyOf(originalObj, {
        after: options.after || noopFn,
        before: options.before || noopFn
    });

    return proxy;
};