'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('underscore');

var delay = 300;

require('../underscore-observe')(_);

/*
function format(arr) {
    return JSON.stringify(arr, null, '  ');
}
*/


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
            subject[2] = 'foo';
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.lastCall, 'foo', 2, 2);
                done();
            }, delay);
        });

        it('should be called when multiple new elements are assigned', function(done) {
            var subject = getSubject();
            var spy = sinon.spy();
            _.observe(subject, 'update', spy);
            subject[1] = 'foo';
            subject[2] = 'bar';
            setTimeout(function() {
                sinon.assert.calledWithExactly(spy.getCall(0), 'bar', 2, 2);
                sinon.assert.calledWithExactly(spy.getCall(1), 'foo', 1, 1);
                done();
            }, delay);
        });

    });


    describe('Unobserve', function() {
        var spies;
        var subjects;



        beforeEach(function() {
            var subject_0 = getSubject();
            var subject_1 = getSubject();
            var spy_0_generic = sinon.spy();
            var spy_0_update = sinon.spy();
            var spy_0_create = sinon.spy();
            var spy_0_delete = sinon.spy();
            var spy_1_generic = sinon.spy();
            var spy_1_update = sinon.spy();
            var spy_1_create = sinon.spy();
            var spy_1_delete = sinon.spy();
            _.observe(subject_0, spy_0_generic);
            _.observe(subject_0, 'update', spy_0_update);
            _.observe(subject_0, 'create', spy_0_create);
            _.observe(subject_0, 'delete', spy_0_delete);
            _.observe(subject_1, spy_1_generic);
            _.observe(subject_1, 'update', spy_1_update);
            _.observe(subject_1, 'create', spy_1_create);
            _.observe(subject_1, 'delete', spy_1_delete);

            // We need to reset the spies to check if they haven't been called
            // after unobserve()
            spies = [
                spy_0_generic, spy_0_create, spy_0_update, spy_0_delete,
                spy_1_generic, spy_1_create, spy_1_update, spy_1_delete
            ];
            subjects = [subject_0, subject_1];

            _.each(spies, function(spy) {
                spy.reset();
            });
        });


        function modifySubjects() {
            _.each(subjects, function(subject) {
                subject.push('foo');
                subject.unshift('bar');
                subject.sort();
                subject.reverse();
                subject.splice(1, 2, 'hello', 'world');
                subject.length = 2;
                subject[3] = 'three';
            });
        }


        it('should remove all observers when called without arguments', function(done) {
            //  no arguments: remove all observables
            _.unobserve();
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy) {
                    sinon.assert.notCalled(spy);
                });
                done();
            }, delay);
        });

        it('should remove a subject\'s observers', function(done) {
            //  only a subject: remove all observers for subject
            _.unobserve(subjects[0]);
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy, index) {
                    if (index > 3) {
                        sinon.assert.called(spy);
                    } else {
                        sinon.assert.notCalled(spy);
                    }
                });
                done();
            }, delay);
        });

        it('should remove a subject\'s generic observers', function(done) {
            // subject + f: remove generic subsciber f for subject
            _.unobserve(subjects[0], spies[0]);
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy, index) {
                    if (index === 0) {
                        // Only the first spy should have been unbound
                        sinon.assert.notCalled(spy);
                    } else {
                        sinon.assert.called(spy);
                    }
                });
                done();
            }, delay);
        });

        it('should remove a subject\'s create observers', function(done) {
            //  subject + type: remove type subscriber for subject
            _.unobserve(subjects[0], 'create');
            //  subject + type + f: remove type subscriber f for subject
            _.unobserve(subjects[1], 'create', spies[5]);
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy, index) {
                    if (index === 1 || index === 5) {
                        sinon.assert.notCalled(spy);
                    } else {
                        sinon.assert.called(spy);
                    }
                });
                done();
            }, delay);
        });

        it('should remove a subject\'s update observers', function(done) {
            //  subject + type: remove type subscriber for subject
            _.unobserve(subjects[0], 'update');
            //  subject + type + f: remove type subscriber f for subject
            _.unobserve(subjects[1], 'update', spies[6]);
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy, index) {
                    if (index === 2 || index === 6) {
                        sinon.assert.notCalled(spy);
                    } else {
                        sinon.assert.called(spy);
                    }
                });
                done();
            }, delay);
        });

        it('should remove a subject\'s delete observers', function(done) {
            //  subject + type: remove type subscriber for subject
            _.unobserve(subjects[0], 'delete');
            //  subject + type + f: remove type subscriber f for subject
            _.unobserve(subjects[1], 'delete', spies[7]);
            modifySubjects();

            setTimeout(function() {
                _.each(spies, function(spy, index) {
                    if (index === 3 || index === 7) {
                        sinon.assert.notCalled(spy);
                    } else {
                        sinon.assert.called(spy);
                    }
                });
                done();
            }, delay);
        });

    });
});
