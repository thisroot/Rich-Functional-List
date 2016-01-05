$(function() {
    getData(startView, errorHandler);

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

    // Alert user on page leave/reload.
    window.onbeforeunload = function() {
        if (saveState.listsChanged) {
            return "Data will be lost if you leave the page, are you sure?";
        }
    };
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
