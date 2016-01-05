$.fn.richFunctionalList = function(options) {
    $callObject = this;
    rflOptions = $.extend({}, rflDefaults, options);
    items.placeholder = $('<div class="' + rflOptions.placeClass + '">' + '<' + '/div' + '>');

    $callObject.children().each(function() { $(this).addNextList(); });
    $callObject.rflListeners($(this));

    // TODO: Remove.
    console.log($callObject.data());
    return this;
};

$.fn.addNextList = function() {
    var listName = 'list' + listCount.amount;
    $callObject.data(listName, new $.RichList(this, listName));
    listCount.increase();
};
