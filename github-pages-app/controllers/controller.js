$(function() {
    // Capture ctrl+s.
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey) {
            if (String.fromCharCode(event.which).toLowerCase() === 's') {
                event.preventDefault();
                event.stopImmediatePropagation();
                var domList = mapData($('#base-list'));
                saveJSON(domList);
            }
        }
    });

    startView();
});

var errorHandler = function(error) {
    alert('Database connection error. AJAX error:\r\n ' + error );
};

var saveData = function($baseList) {
    var domList = mapData($baseList);
    saveJSON(domList, errorHandler);
};

var saveState = function() {
    this.listsChanged = false;
};
