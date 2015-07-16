'use strict';
(function($) {


    // Little jQuery utility function to insert an element at a certain index
    $.fn.insertAt = function insertAt(index, element) {
        if (index === 0) {
            this.prepend(element);
        } else if (index < this.length - 1) {
            $(this[index]).before(element);
        } else {
            this.append(element);
        }
        return this;
    };

    // Our data source
    var _todos = [];

    // The element where all our todo items end up
    var _todo_list = $('#todo-list');


    /* ################################################################
       Array Observers
    ################################################################ */

    // Insert new element
    _.observe(_todos, 'create', function(item, index) {
        var element = createTodoElement(item);
        _todo_list.insertAt(index, element);
    });


    // Replace element with updated one
    _.observe(_todos, 'update', function(item, old_item, index) {
        var element = createTodoElement(item);
        _todo_list.find('li').eq(index).replaceWith(element);
    });


    // Remove element
    _.observe(_todos, 'delete', function(item, index) {
        var element = $('#todo-list li').eq(index);
        element.slideUp('fast', function() {
            element.remove();
        });
    });


    // Update footer numbers
    _.observe(_todos, function() {
        var total  = _todos.length;
        var done = _.filter(_todos, function(item) {
            return item.done;
        }).length;

        // Update "XXX left"
        $('.remaining').text(total - done);

        // Update + show/hide "Clear XXX completed items"
        var button = $('.clear');
        button.toggle(done > 0);
        button.find('span').text(done);
    });


    /* ################################################################
       UI Event handlers
    ################################################################ */

    // Check/uncheck handler checkbox
    _todo_list.on('change', 'input:checkbox', function() {
        var index = $(this).parent().index();
        _todos[index].done = this.checked;
    });


    // Click handler delete button
    _todo_list.on('click', 'button', function() {
        var index = $(this).parent().index();
        _todos.splice(index, 1);
    });


    // Click handler "Clear XXX completed items" button
    $('button.clear').on('click', function() {
        // Always loop in reverse when you delete items, otherwise the indexes
        // change during the loop
        for (var i = _todos.length - 1; i >= 0; i--) {
            if (_todos[i].done) {
                _todos.splice(i, 1);
            }
        }
    });


    // Handle enter in new todo input
    $('#new-todo').on('keyup', function(e) {
        var name = $(this).val();
        if (name && e.which === 13) {
            _todos.push({
                name: name,
                done: false
            });
            $(this).val('');
        }
    });


    /* ################################################################
       Todo element template
    ################################################################ */

    function createTodoElement(item) {
        var template = $('#todo-item-template').html();
        var element = $(template);
        element.find(':checkbox')[0].checked = item.done;
        element.find('span').text(item.name);
        return element;
    }


})(jQuery);
