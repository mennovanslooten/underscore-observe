# Observable Arrays

## The short story

This is an extension to [Underscore](http://documentcloud.github.com/underscore/) that allows you to add observer functions to any standard JavaScript Array. After that, if the array is changed in any way, your observer will be called.

### How do I use this?

Simply include the `underscore-observe.js` file and its dependencies `underscore.js` and (if you want to support IE7) `json2.js` and you're good to go.
If you prefer, you can use [lodash](https://lodash.com/) as an alternative to underscore'.

There are 3 specific types of changes observers can be tied to: create, update and delete. The observers are always triggered *after* the change has taken place.

```javascript
_.observe(some_array, 'create', function(new_item, item_index)           { /* called for new elements     */ });
_.observe(some_array, 'update', function(new_item, old_item, item_index) { /* called for changed elements */ });
_.observe(some_array, 'delete', function(old_item, item_index)           { /* called for deleted elements */ });
```

Additionally, there's the "generic" observer, which is called for every change.

```javascript
_.observe(some_array, function(new_array, old_array) { /* called for every change */ });
```

## The long story

### So what is this again?

This is a JavaScript utility that allows you to add observer functions to any Array. These observers become like **event handlers for the array**: if something's happened to the array, the observer function is called.

```javascript
// For example, take any array:
var a = ['zero', 'one', 'two', 'trhee'];

// Add a generic observer function to that array:
_.observe(a, function() {
    alert('something happened');
});

// The observer will be called when the array is changed
a[3] = 'three'; // alerts 'something happened'
```

### Can you be more specific than "something happened"?

Sure, you can bind to 3 specific types of array events: *create*, *update*, and *delete*.

```javascript
var a = ['zero', 'one'];

// "create" is triggered when an element is added to the array.
_.observe(a, 'create', function(new_item, item_index) {
    alert(new_item + ' was created at ' + item_index);
});
a.push('two'); // alerts 'two was created at 2'


// "update" is triggered when an element in the array is changed.
_.observe(a, 'update', function(new_item, old_item, item_index) {
    alert(new_item + ' was changed from ' + old_item + ' at ' + item_index);
});
a[2] = 'too' // alerts 'too was changed from two at 2'


// "delete" is triggered when an element is removed from the array.
_.observe(a, 'delete', function(old_item, item_index) {
    alert(old_item + ' was removed at ' + item_index);
});
a.pop(); // alerts 'too was removed at 2'


// PLEASE NOTE: generic and create observers are also triggered once for each
// element of the array when the observer is first bound. For the sake of
// brevity, I've left those alerts out of the examples.
```

Each of these events can be triggered in many different ways. There's more information below on what triggers which event.

### How can I remove observers?

The `_.unobserve()` utility removes observers. It can be used in five ways:

```javascript
// no arguments: remove all observables from all subjects
_.unobserve();

// only a subject: remove all observers for subject
_.unobserve(subject);

// subject + f: remove generic subsciber f for subject
_.unobserve(subject, myGenericHandler);

// subject + type: remove type subscriber for subject
_.unobserve(subject, 'delete');

//  subject + type + f: remove type subscriber f for subject
_.unobserve(subject, 'delete', myDeleteHandler);
```

### Why is this useful?

If you have elements in your UI that are in some way dependent on the contents of an array, this utility makes it very easy to keep your UI and array in sync while keeping the UI code and the array manipulation code nicely separated.

### Do you have any examples?

Of course, check out [this simple todo-list](http://mennovanslooten.github.com/underscore-observe/) and then check out [the source](https://github.com/mennovanslooten/underscore-observe/blob/master/demo/js/todo.js).

### That looks rather familiar.

It's, ehm, *inspired* by [Backbone](http://backbonejs.org/)'s [todo-list demo](http://backbonejs.org/examples/todos/index.html).

### Inspired?

I thought it was a really neat example of a bunch of different UI elements that are all dependent on one simple data structure and I wanted to see how hard it was to recreate it with observable arrays. It turned out to be pretty straightforward.

### So what's the catch?

The catch is that it only works if you **modify the original array**. It won't work if you overwrite it completely.

```javascript
var a = ['zero', 'one', 'two'];
_.observe(a, function() {
    alert('something happened');
});

a = [0, 1, 2]; // nothing happens
```

The good news is you can use any method to modify an array:

* You can use all  of the standard [Array Mutator methods](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Mutator_methods). See below for specifics.
* You can modify the `length` property. This can trigger either *delete* or *create* observers, depending on if the new length is less or more than the old.
* You can modify an element in place by referencing to it directly. (i.e. `some_array[12] = 'foobar'`)

### What about the Array Mutator methods?

Using standard array mutator methods (methods that change the instance of the
array they belong to) causes these effects:

```javascript
// First define an array and some observers
var a = [0, 1, 2];

_.observe(a, 'create', function(new_item, item_index) {
    alert(new_item + ' was created at ' + item_index);
})

_.observe(a, 'update', function(new_item, old_item, item_index) {
    alert(new_item + ' was changed from ' + old_item + ' at ' + item_index);
});

_.observe(a, 'delete', function(old_item, item_index) {
    alert(old_item + ' was removed at ' + item_index);
});

// ...now let's look at each of the mutator methods.


// Array.pop() triggers *delete* observers once for the popped element:
a.pop(); // alerts '2 was removed at 2'
// a is now [0, 1]


// Array.push() triggers *create* observers once for the pushed element.
a.push(2); // alerts '2 was created at 2'
// a is now [0, 1, 2]


// Array.reverse() triggers *delete* observers once for each element in
// their old positions and *create* observers once for each element in
// their new positions.
a.reverse(); // alerts in order:
             // '2 was removed at 2'
             // '1 was removed at 1'
             // '0 was removed at 0'
             // '2 was created at 0'
             // '1 was created at 1'
             // '0 was created at 2'
// a is now [2, 1, 0]


// Array.shift() triggers *delete* observers once for the shifted element:
a.shift(); // alerts '2 was removed at 0'
// a is now [1, 0]


// Array.unshift() triggers *create* observers once for the unshifted element.
a.unshift(2); // alerts '2 was created at 0'
// a is now [2, 1, 0]


// Array.sort() triggers *delete* observers once for each element in
// their old positions and *create* observers once for each element in
// their new positions.
a.sort(); // alerts in order:
          // '0 was removed at 2'
          // '1 was removed at 1'
          // '2 was removed at 0'
          // '0 was created at 0'
          // '1 was created at 1'
          // '2 was created at 2'
// a is now [0, 1, 2]


// Array.splice() triggers *delete* observers once for each removed element in
// their old positions and *create* observers once for each inserted element in
// their new positions.
a.splice(0, 3, 'Hello', 'world'); // alerts in order:
                                 // '0 was removed at 0'
                                 // '1 was removed at 1'
                                 // '2 was removed at 2'
                                 // 'Hello was created at 0'
                                 // 'world was created at 1'
// a is now ['Hello', 'world']
```


### Why are delete observers called in reverse order?

It makes life easier when you need to delete multiple UI components based on their index.

## Acknowledgements

Substantial parts of this code were written during office hours at [Aan Zee](http://www.aanzee.nl). Big thanks to them for encouraging me to release the source.

The dependency on [Underscore](http://documentcloud.github.com/underscore/) is no accident. It is made of pure awesome.

IE7 support is courtesy of [Douglas Crockford's json2.js](https://github.com/douglascrockford/JSON-js).

The [todo-list demo](http://mennovanslooten.github.io/underscore-observe/) concept and design is of course blatantly stolen from [Backbone](http://backbonejs.org/)'s [todo-list demo](http://backbonejs.org/examples/todos/index.html) by [Jérôme Gravel-Niquet](http://jgn.me/). No code was re-used, however.
