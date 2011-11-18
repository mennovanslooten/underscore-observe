describe('Observable Arrays', function () {


	describe('Generic Observers', function () {
		var observed_array = [0, 1, 2, 3];
		var expected_new_array;
		var expected_index;
		var generic_observer_was_called;

		beforeEach(function () {
			expected_new_array = null;
			expected_old_array = observed_array.concat();
			expected_index = null;
			generic_observer_was_called = false;
		});

		// generic observer
		function genericObserver(new_array, old_array) {
			expect(new_array).toEqual(expected_new_array);
			expect(old_array).toEqual(expected_old_array);
			generic_observer_was_called = true;
		}

		// initial
		it('should be called when bound', function () {
			expected_new_array = [0, 1, 2, 3];
			expected_old_array = [];
			_.observe(observed_array, genericObserver);
		});

		// Deleting array mutator methods
		it('should be called when an element is popped', function () {
			expected_new_array = [0, 1, 2];
			observed_array.pop();
		});

		it('should be called when an element is shifted', function () {
			expected_new_array = [1, 2];
			observed_array.shift();
		});

		it('should be called when elements are spliced', function () {
			expected_new_array = [];
			observed_array.splice(0, 2);
		});

		// Creating array mutator methods
		it('should be called when elements are spliced in', function () {
			expected_new_array = [1, 2];
			observed_array.splice(0, 0, 1, 2);
		});

		it('should be called when an element is unshifted', function () {
			expected_new_array = [0, 1, 2];
			observed_array.unshift(0);
		});

		it('should be called when an element is pushed', function () {
			expected_new_array = [0, 1, 2, 3];
			observed_array.push(3);
		});

		// Completely changing mutator methods
		it('should be called when reversed', function () {
			expected_new_array = [3, 2, 1, 0];
			observed_array.reverse();
		});

		it('should be called when sorted', function () {
			expected_new_array = [0, 1, 2, 3];
			observed_array.sort();
		});

		// Async callers
		it('should be called when length is changed', function () {
			expected_new_array = [0, 1, 2];
			observed_array.length = 3;

			waitsFor(function() {
				return generic_observer_was_called;
			}, "Generic observer was never called", 1000);
		});

		it('should be called when an element is changed', function () {
			expected_new_array = [0, 'hello', 2];
			observed_array[1] = 'hello';

			waitsFor(function() {
				return generic_observer_was_called;
			}, "Generic observer was never called", 1000);
		});

	});


	describe('Create Observers', function () {
		var observed_array = ['hello', 'world'];
		var expected_items;
		var expected_indices;
		var create_observer_was_called;

		beforeEach(function () {
			create_observer_was_called = false;
		});

		// generic observer
		function createObserver(new_item, item_index) {
			var expected_item = expected_items.shift();
			var expected_index = expected_indices.shift();
			expect(new_item).toEqual(expected_item);
			expect(item_index).toEqual(expected_index);
			create_observer_was_called = true;
		}

		// initial
		it('should be called once for each existing element when bound', function () {
			expected_items = ['hello', 'world'];
			expected_indices = [0, 1];
			_.observe(observed_array, 'create', createObserver);
		});

		// Creating array mutator methods
		it('should be called when an element is unshifted', function () {
			expected_items = [0];
			expected_indices = [0];
			observed_array.unshift(0);
		});

		it('should be called when an element is pushed', function () {
			expected_items = [3];
			expected_indices = [3];
			observed_array.push(3);
		});

		it('should be called when elements are spliced in', function () {
			expected_items = [1, 2];
			expected_indices = [1, 2];
			observed_array.splice(1, 2, 1, 2);
		});

		// Completely changing mutator methods
		it('should be called when reversed', function () {
			expected_items = [3, 2, 1, 0];
			expected_indices = [0, 1, 2, 3];
			observed_array.reverse();
		});

		it('should be called when sorted', function () {
			expected_items = [0, 1, 2, 3];
			expected_indices = [0, 1, 2, 3];
			observed_array.sort();
		});

		// Async callers
		it('should be called when a new element is assigned', function () {
			expected_items = [4];
			expected_indices = [4];
			observed_array[4] = 4;

			waitsFor(function() {
				return create_observer_was_called;
			}, "Create observer was never called", 1000);
		});
	});


	describe('Delete Observers', function () {
		var observed_array = [-1, 0, 'hello', 'world', 3, 4];
		var expected_items;
		var expected_indices;
		var delete_observer_was_called;

		beforeEach(function () {
			delete_observer_was_called = false;
		});

		// generic observer
		function deleteObserver(deleted_item, item_index) {
			var expected_item = expected_items.shift();
			var expected_index = expected_indices.shift();
			expect(deleted_item).toEqual(expected_item);
			expect(item_index).toEqual(expected_index);
			delete_observer_was_called = true;
		}

		// initial
		it('should not be called when bound', function () {
			_.observe(observed_array, 'delete', deleteObserver);
			expect(delete_observer_was_called).toEqual(false);
		});

		// Deleting array mutator methods
		it('should be called when an element is popped', function () {
			expected_items = [4];
			expected_indices = [5];
			observed_array.pop();
		});

		it('should be called when an element is shifted', function () {
			expected_items = [-1];
			expected_indices = [0];
			observed_array.shift();
		});

		it('should be called when elements are spliced', function () {
			expected_items = ['world', 'hello']; // Reverse order!
			expected_indices = [2, 1];
			observed_array.splice(1, 2, 1, 2);
		});

		// Completely changing mutator methods
		it('should be called when reversed', function () {
			expected_items = [3, 2, 1, 0];
			expected_indices = [3, 2, 1, 0];
			observed_array.reverse();
		});

		it('should be called when sorted', function () {
			expected_items = [0, 1, 2, 3];
			expected_indices = [3, 2, 1, 0];
			observed_array.sort();
		});

		// Async callers
		it('should be called when length is changed', function () {
			expected_items = [3, 2];
			expected_indices = [3, 2];
			observed_array.length = 2;

			waitsFor(function() {
				return delete_observer_was_called;
			}, "Delete observer was never called", 1000);
		});
	});


	describe('Update Observers', function () {
		var observed_array = ['hello'];
		var expected_new_items;
		var expected_old_items;
		var expected_indices;
		var update_observer_was_called;

		beforeEach(function () {
			update_observer_was_called = false;
		});

		// update observer
		function updateObserver(new_item, old_item, item_index) {
			var expected_new_item = expected_new_items.shift();
			var expected_old_item = expected_old_items.shift();
			var expected_index = expected_indices.shift();
			expect(new_item).toEqual(expected_new_item);
			expect(old_item).toEqual(expected_old_item);
			expect(item_index).toEqual(expected_index);
			update_observer_was_called = true;
		}


		// initial
		it('should not be called when bound', function () {
			_.observe(observed_array, 'update', updateObserver);
			expect(update_observer_was_called).toEqual(false);
		});

		// Async callers
		it('should be called when a new element is assigned', function () {
			expected_new_items = ['world'];
			expected_old_items = ['hello'];
			expected_indices = [0];
			observed_array[0] = 'world';

			waitsFor(function() {
				return update_observer_was_called;
			}, "Update observer was never called", 1000);
		});

		it('should be called when multiple new elements are assigned', function () {
			observed_array.push('foo');

			expected_new_items = ['bar', 'hello'];
			expected_old_items = ['foo', 'world'];
			expected_indices = [1, 0];
			observed_array[0] = 'hello';
			observed_array[1] = 'bar';

			waitsFor(function() {
				return update_observer_was_called;
			}, "Update observer was never called", 1000);
		});
	});



});
