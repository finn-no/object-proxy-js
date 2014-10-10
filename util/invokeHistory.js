function argsToStr(args) {
    return args.map(function(item) {
        var itemType = typeof(item);

        if (Array.isArray(item)) {
            return '['+ argsToStr(item) +']';
        } else if (itemType === 'object') {
            return '{...}';
        } else if (itemType === 'string') {
            return '"'+ item +'"';
        }
        return item;
    });
}

function methodArgsToStr(args) {
    return '(' + argsToStr(args).join(', ') + ')';
}

function recordInvocation(recordings, parentObjName, methodName, args) {
    parentObjName = parentObjName ? parentObjName + '.' : '';
    recordings.push(parentObjName + methodName + methodArgsToStr(args));
}

exports.create = function() {
    var recordings = [];
    return {
        recordings: recordings,
        recorder: recordInvocation.bind(null, recordings)
    };
};
