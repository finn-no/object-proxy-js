var assert = require('chai').assert;
var sinon = require('sinon');

var proxy = require('../');

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

describe('Object proxy', function(){

    var originalObj = new OriginalClass();
    var proxied;

    beforeEach(function() {
        proxied = proxy(originalObj);
    });

    it('should methods defined by original object', function(){
        assert.isFunction(proxied.echo);
        assert.isFunction(proxied.sum);
    });

    it('should proxy methods on original object prototype', function(){
        assert.isFunction(proxied.protoMethod);
    });

    it('should have as many properties as exists in the original object + its prototype', function(){
        var expectedPropCount = Object.keys(originalObj).length + Object.keys(OriginalClass.prototype).length;
        assert.equal(Object.keys(proxied).length, expectedPropCount);
    });

    it('should not be the original object', function(){
        assert.notStrictEqual(proxied, originalObj);
    });

    it('should return the result created by the original object', function(){
        assert.equal(5, proxied.sum(2, 3));
    });

    it('should proxy methods on nested objects', function(){
        assert.equal(6, proxied.nestedObj.multiply(2, 3));
    });

    describe('handles non-function properties', function(){

        it('should directly reference an array property on the original object', function(){
            assert.strictEqual(proxied.anArray, originalObj.anArray);
        });

        it('should directly reference a string property on the original object', function(){
            assert.strictEqual(proxied.aString, originalObj.aString);
        });

    });

});