'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('underscore');

var delay = 300;

require('../underscore-observe')(_);


function format(arr) {
    return JSON.stringify(arr, null, '  ');
}


function assertArguments(spy, expected) {
    assert.equal(spy.callCount, expected.length);

    for (var i = 0; i < spy.callCount; i++) {
        var spy_call = spy.getCall(i);
        var args = expected[i].concat();
        args.unshift(spy_call);
        sinon.assert.calledWithExactly.apply(sinon, args);
    }
}


function getSubject() {
    return [0, 1, 2];
}


describe('underscore-observe', function() {
    describe('Generic Observers', function() {

        it('should be called when bound', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            sinon.assert.calledWithExactly(spy.lastCall, [0, 1, 2], []);
        });


        it('should be called when an element is popped', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.pop();
            sinon.assert.calledWithExactly(spy.lastCall, [0, 1], [0, 1, 2]);
        });


        it('should be called when an element is shifted', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.shift();
            sinon.assert.calledWithExactly(spy.lastCall, [1, 2], [0, 1, 2]);
        });


        it('should be called when an element is spliced out', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.splice(1, 1);
            sinon.assert.calledWithExactly(spy.lastCall, [0, 2], [0, 1, 2]);
        });


        it('should be called when an element is spliced in', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.splice(2, 0, 'foo');
            sinon.assert.calledWithExactly(spy.lastCall, [0, 1, 'foo', 2], [0, 1, 2]);
        });


        it('should be called when an element is unshifted', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.unshift('foo');
            sinon.assert.calledWithExactly(spy.lastCall, ['foo', 0, 1, 2], [0, 1, 2]);
        });


        it('should be called when an element is pushed', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.push('foo');
            sinon.assert.calledWithExactly(spy.lastCall, [0, 1, 2, 'foo'], [0, 1, 2]);
        });

        it('should be called when reversed', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.reverse();
            sinon.assert.calledWithExactly(spy.lastCall, [2, 1, 0], [0, 1, 2]);
        });

        it('should be called when sorted', function() {
            var subject = [3, 1, 2, 0];
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.sort();
            sinon.assert.calledWithExactly(spy.lastCall, [0, 1, 2, 3], [3, 1, 2, 0]);
        });

        it('should be called when length is changed', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject.length = 2;
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.lastCall, [0, 1], [0, 1, 2]);
                done();
            }, delay);
        });

        it('should be called when an element is changed', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, spy);
            subject[1] = 'hello';
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.lastCall, [0, 'hello', 2], [0, 1, 2]);
                done();
            }, delay);
        });

    });


    describe('Create Observers', function() {

        it('should be called once for each existing element when bound', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            assertArguments(spy, [
                [0, 0],
                [1, 1],
                [2, 2]
            ]);
        });

        it('should be called when an element is unshifted', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject.unshift('foo');
            sinon.assert.calledWithExactly(spy.lastCall, 'foo', 0);
        });

        it('should be called when an element is pushed', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject.push('foo');
            sinon.assert.calledWithExactly(spy.lastCall, 'foo', 3);
        });

        it('should be called when elements are spliced in', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject.splice(1, 2, 'foo', 'bar');
            sinon.assert.calledWithExactly(spy.getCall(3), 'foo', 1);
            sinon.assert.calledWithExactly(spy.getCall(4), 'bar', 2);
        });

        it('should be called when reversed', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject.reverse();
            sinon.assert.calledWithExactly(spy.getCall(3), 2, 0);
            sinon.assert.calledWithExactly(spy.getCall(4), 1, 1);
            sinon.assert.calledWithExactly(spy.getCall(5), 0, 2);
        });

        it('should be called when sorted', function() {
            var subject = [1, 2, 0];
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject.sort();
            sinon.assert.calledWithExactly(spy.getCall(3), 0, 0);
            sinon.assert.calledWithExactly(spy.getCall(4), 1, 1);
            sinon.assert.calledWithExactly(spy.getCall(5), 2, 2);
        });

        it('should be called when a new element is assigned', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'create', spy);
            subject[3] = 'foo';
            setTimeout(function() {
                //console.log(subject);
                //console.log(format(spy.args));
                sinon.assert.calledWithExactly(spy.lastCall, 'foo', 3);
                done();
            }, delay);
        });
    });


    describe('Delete Observers', function() {

        it('should not be called when bound', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            sinon.assert.notCalled(spy);
        });

        it('should be called when an element is popped', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.pop();
            sinon.assert.calledWithExactly(spy.lastCall, 2, 2);
        });

        it('should be called when an element is shifted', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.shift();
            sinon.assert.calledWithExactly(spy.lastCall, 0, 0);
        });

        it('should be called when elements are spliced', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.splice(1, 2, 'foo', 'bar');
            sinon.assert.calledWithExactly(spy.getCall(0), 2, 2);
            sinon.assert.calledWithExactly(spy.getCall(1), 1, 1);
        });

        it('should be called when elements are reversed', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.reverse();
            sinon.assert.calledWithExactly(spy.getCall(0), 2, 2);
            sinon.assert.calledWithExactly(spy.getCall(1), 1, 1);
            sinon.assert.calledWithExactly(spy.getCall(2), 0, 0);
        });

        it('should be called when elements are sorted', function() {
            var subject = [3, 1, 2, 0];
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.sort();
            sinon.assert.calledWithExactly(spy.getCall(0), 0, 3);
            sinon.assert.calledWithExactly(spy.getCall(1), 2, 2);
            sinon.assert.calledWithExactly(spy.getCall(2), 1, 1);
            sinon.assert.calledWithExactly(spy.getCall(3), 3, 0);
        });

        it('should be called when length is shortened', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'delete', spy);
            subject.length = 1;
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.getCall(0), 2, 2);
                sinon.assert.calledWithExactly(spy.getCall(1), 1, 1);
                done();
            }, delay);
        });
    });


    describe('Update Observers', function() {

        it('should not be called when bound', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'update', spy);
            sinon.assert.notCalled(spy);
        });

        it('should not be called when new elements are appended', function() {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'update', spy);
            subject[3] = 'foo';
            subject.push('bar');
            sinon.assert.notCalled(spy);
        });

        it('should be called when a new element is assigned', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'update', spy);
            subject[2] = 'foo'
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.lastCall, 'foo', 2, 2);
                done();
            }, delay);
        });

        it('should be called when multiple new elements are assigned', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'update', spy);
            subject[1] = 'foo'
            subject[2] = 'bar'
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.getCall(0), 'bar', 2, 2);
                sinon.assert.calledWithExactly(spy.getCall(1), 'foo', 1, 1);
                done();
            }, delay);
        });

    });
});

