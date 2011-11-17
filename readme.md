# Observable Arrays

## The short story

This is an extension to [Underscore](http://documentcloud.github.com/underscore/) that allows you to add observer functions to any standard JavaScript Array. After that, if the array is changed in any way, your observer will be called.

### How do I use this?

Simply include the `underscore.observable.js` file and its dependencies `underscore.js` and (if you want to support IE7) `json2.js` and you're good to go.

There are 3 specific types of changes observers can be tied to: create, update and delete. The observers are always triggered *after* the change has taken place.

```javascript
_.observe(some_array, 'create', function(new_item, item_index) { });
_.observe(some_array, 'update', function(new_item, old_item, item_index) { });
_.observe(some_array, 'delete', function(old_item, item_index) { });
```

Additionally, there's the "generic" observer, which is called for every change.

```javascript
_.observe(some_array, function(new_array, old_array) { });
```

## The long story

### So what is this again?

This is a JavaScript utility that allows you to add observer functions to any Array. These observers become like event handlers for the array: if something's happened to the array, the observer function is called.

```javascript
// For example, let's say you have an array:
var a = ['zero', 'one', 'two', 'trhee'];

// ...you can then add an observer function to that array:
_.observe(a, function() {
    alert('something happened');
});

// ...which will be called when the array is changed
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
    alert(old_item + ' was removed from ' + item_index);
});
a.pop(); // alerts 'too was removed from 2'
```

Each of these events can be triggered in many different ways. There's more information below on what triggers which event.

### Why is this useful?

If you have elements in your UI that are in some way dependent on the contents of an array, this utility makes it very easy to keep your UI and array in sync while keeping the UI code and the array manipulation code nicely separated.

### Do you have any examples?

Of course, check out [this simple todo-list](http://experiments.mennovanslooten.nl/2011/observable-arrays/todo.html) and then check out [the source](https://github.com/mennovanslooten/Observable-Arrays/blob/master/js/todo.js).

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

Let's assume the following array and observers have been defined:

```javascript
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
```

### pop

```javascript
// Array.pop() triggers *delete* observers once for the popped element:
a.pop; // alerts '2 was removed from 2'
```
    
### push

```javascript
// Array.push() triggers *create* observers once for the pushed element.
a.push(3); // alerts '3 was created at 3'
```

### reverse

```javascript
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
```

### shift

```javascript
// Array.shift() triggers *delete* observers once for the shifted element:
a.shift(); // alerts '0 was removed from 0'
```

### sort

```javascript
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
```
    
### splice

```javascript
// Array.splice() triggers *delete* observers once for each deleted 
// element in their old positions and *create* observers once for each new 
// element in their new positions.
a.splice(0, 2, 'zero', 'one'); // alerts in order:
    '0 was removed from 0'
    'zero was created at 0'
    'one was created at 1'
```

### unshift

```javascript
// Array.unshift() triggers *create* observers once for the unshifted element.
a.unshift(-1); // alerts '-1 was created at 0'
```

### Why are delete observers called in reverse order?

It makes life easier when you need to delete multiple UI components based on their index.

