var assert = require('chai').assert;
var sinon = require('sinon');

var proxyObject = require('../../');
var invokeHistory = require('../../util/invokeHistory');

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
}

describe('util / Method invocation history', function(){

    var originalObj = new OriginalClass();
    var proxied;
    var proxyHistory;

    beforeEach(function() {
        proxyHistory = invokeHistory.create();

        proxied = proxyObject(originalObj, {
            before: proxyHistory.recorder
        });
    });

    describe('create()', function(){

        it('should create unique history recordings', function(){
            assert.notStrictEqual(invokeHistory.create().recordings, invokeHistory.create().recordings);
        });

    });


    describe('recordings property', function(){

        it('should be an array', function(){
            assert.isArray(proxyHistory.recordings);
        });

        it('should have as many entries as method invocations on the proxy', function(){
            assert.equal(proxyHistory.recordings.length, 0);
            proxied.sum(2, 3);
            assert.equal(proxyHistory.recordings.length, 1);
        });

        it('should have names of methods previously invoked', function(){
            proxied.sum(2, 3);
            assert.include(proxyHistory.recordings, 'sum(2, 3)');
        });

        it('should prefix invoked method with name of nested object', function(){
            proxied.nestedObj.multiply(2, 3);
            assert.include(proxyHistory.recordings, 'nestedObj.multiply(2, 3)');
        });

        it('should have quotes around string arguments', function(){
            proxied.echo('w00p');
            assert.include(proxyHistory.recordings, 'echo("w00p")');
        });

        it('should display any object argument as {...}', function(){
            proxied.echo({ word: 'Ello', name: 'world' });
            assert.include(proxyHistory.recordings, 'echo({...})');
        });

        it('should display array arguments as ["x","y","z"]', function(){
            proxied.echo(['x', 'y', 'z']);
            assert.include(proxyHistory.recordings, 'echo(["x","y","z"])');
        });

    });

});
