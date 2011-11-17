# Observable Arrays

## So what is this?

This is an extension to [Underscore](http://documentcloud.github.com/underscore/) that allows you to add observer functions to any standard JavaScript Array.

## Excuse me?

Let's say you have an array:

    var a = ['zero', 'one', 'two', 'trhee'];

You can then add an observer function to that array:

    _.observe(a, function() {
        alert('something happened');
    });

    a[3] = 'three'; // alerts 'something happened'

## Can you be more specific than "something happened"?

Sure, you can also bind to 3 specific types of array events: *create*, *update*, and *delete*.

**create** is triggered when an element is added to the array.

    var a = ['zero', 'one'];
    _.observe(a, 'create', function(new_item, item_index) {
        alert(new_item + ' was created at ' + item_index);
    });
    a.push('two'); // alerts 'two was created at 2'

**update** is triggered when an element in the array is changed.

    var a = ['zero', 'one', 'too', 'three'];
    _.observe(a, 'update', function(new_item, old_item, item_index) {
        alert(new_item + ' was changed from ' + old_item + ' at ' + item_index);
    });
    a[2] = 'two' // alerts 'two was changed from too at 2'

**delete** is triggered when an element is removed from the array.

    var a = ['zero', 'one', 'two', 'three'];
    _.observe(a, 'delete', function(old_item, item_index) {
        alert(old_item + ' was removed from ' + item_index);
    });
    a.pop(); // alerts 'three was removed from 3'

Each of these events can be triggered in many different ways. There's more information below on what triggers which event.

## Why is this useful?

If you have elements in your UI that are in some way dependent on the contents of an array, this utility makes it very easy to keep your UI and array in sync while keeping the UI code and the array manipulation code nicely separated.

## Do you have any examples?

Of course, check out [this simple todo-list](http://experiments.mennovanslooten.nl/2011/observable-arrays/todo.html) and then check out [the source](https://github.com/mennovanslooten/Observable-Arrays/blob/master/js/todo.js).

## That looks rather familiar.

It's, ehm, *inspired* by [Backbone](http://backbonejs.org/)'s [todo-list demo](http://backbonejs.org/examples/todos/index.html).  

## Inspired?

I thought it was a really neat example of a bunch of different UI elements that are all dependent on one simple data structure and I wanted to see how hard it was to recreate it with observable arrays. It turned out to be pretty straightforward.

## So what's the catch?

The catch is that it only works if you **modify the original array**. It won't
work if you overwrite it completely.

    var a = ['zero', 'one', 'two'];
    _.observe(a, function() {
        alert('something happened');
    });

    a = [0, 1, 2]; // nothing happens

The good news is you can use any method to modify an array:

* You can use all  of
the standard [Array Mutator methods](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Mutator_methods). See below for specifics.
* You can modify the `length` property. This can trigger either *delete* or *create* observers, depending on if the new length is less or more than the old.
* You can modify an element in place by referencing to it directly. (i.e. `some_array[12] = 'foobar'`)


## What about the Array Mutator methods?

All of this section's code examples assume this array and these observers are defined:

    var a = [0, 1, 2];

    _.observe(a, 'create', function(new_item, item_index) {
        alert(new_item + ' was created at ' + item_index);
    })

    _.observe(a, 'update', function(new_item, old_item, item_index) {
        alert(new_item + ' was changed from ' + old_item + ' at ' + item_index);
    });

    _.observe(a, 'delete', function(old_item, item_index) {
        alert(old_item + ' was removed from ' + item_index);
    });

### pop

    // Array.pop() triggers *delete* observers once for the popped element:
    a.pop; // alerts '2 was removed from 2'
    
### push

    // Array.push() triggers *create* observers once for the pushed element.
    a.push(3); // alerts '3 was created at 3'

### reverse

    // Array.reverse() triggers *delete* observers once for each element in
    // their old positions and *create* observers once for each element in
    // their new positions.
    a.reverse(); // alerts in order:
        '2 was deleted from 2'
        '1 was deleted from 1'
        '0 was deleted from 0'
        '2 was created at 0'
        '1 was created at 1'
        '0 was created at 2'

### shift

    // Array.shift() triggers *delete* observers once for the shifted element:
    a.shift(); // alerts '0 was removed from 0'

### sort

    // Array.sort() triggers *delete* observers once for each element in
    // their old positions and *create* observers once for each element in
    // their new positions.
    a.sort(function(a, b) { return a < b }); // alerts in order:
        '2 was removed from 2'
        '1 was removed from 1'
        '0 was removed from 0'
        '2 was created at 0'
        '1 was created at 1'
        '0 was created at 2'
        
### splice

    // Array.splice() triggers *delete* observers once for each deleted 
    // element in their old positions and *create* observers once for each new 
    // element in their new positions.
    a.splice(0, 2, 'zero', 'one'); // alerts in order:
        '0 was removed from 0'
        'zero was created at 0'
        'one was created at 1'

### unshift

    // Array.unshift() triggers *create* observers once for the unshifted element.
    a.unshift(-1); // alerts '-1 was created at 0'

## Why are delete observers called in reverse order?

It makes life easier when you need to delete UI components based on their index.

