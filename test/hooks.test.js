var assert = require('chai').assert;
var sinon = require('sinon');

var proxyObject = require('../');

function OriginalClass() {

    this.echo = function(strToEcho) {
        return strToEcho;
    };

    this.sum = function(a, b) {
        return a + b;
    };

    this.nestedObj = {
        multiply: function(a, b) {
            return a * b;
        }
    };

    this.anArray = [];
    this.aString = 'reference me directly';
}

OriginalClass.prototype.protoMethod = function() {
    return 'awesomeness';
};

describe('Object proxy hooks', function(){

    var originalObj = new OriginalClass();
    var proxied;
    var beforeFn;
    var afterFn;

    beforeEach(function() {
        beforeFn = sinon.spy();
        afterFn = sinon.spy();
        proxied = proxyObject(originalObj, {
            before: beforeFn,
            after: afterFn
        });
    });

    describe('before callback', function(){

        it('should be called before original method has been called', function(){
            var echoSpy = sinon.spy(originalObj, 'echo');

            proxied.echo('yo');
            assert.ok(beforeFn.calledBefore(echoSpy));

            echoSpy.restore();
        });

    });

    describe('after callback', function(){

        it('should be called after original method was called', function(){
            var echoSpy = sinon.spy(originalObj, 'echo');

            proxied.echo('yo');
            assert.ok(afterFn.calledAfter(echoSpy));

            echoSpy.restore();
        });

    });

    describe('callback arguments', function(){

        it('should provide callback with method name called', function(){
            proxied.sum(2, 3);
            assert.ok(beforeFn.calledWith(undefined, 'sum'));
            assert.ok(afterFn.calledWith(undefined, 'sum'));
        });

        it('should have parent object name of undefined when method called is directly on the original object', function(){
            proxied.sum(2, 3);
            assert.ok(beforeFn.calledWith(undefined));
            assert.ok(afterFn.calledWith(undefined));
        });

        it('should provide callback with name of parent object the original method belongs to', function(){
            proxied.nestedObj.multiply(2, 3);
            assert.ok(beforeFn.calledWith('nestedObj', 'multiply'));
            assert.ok(afterFn.calledWith('nestedObj', 'multiply'));
        });

        it('should provide callback with arguments given when calling method', function(){
            proxied.sum(2, 3);
            assert.ok(beforeFn.calledWith(undefined, 'sum', [2, 3]));
            assert.ok(afterFn.calledWith(undefined, 'sum', [2, 3]));
        });

    });

});