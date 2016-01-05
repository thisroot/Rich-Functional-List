/*
* jquery.rfl-public.js : Related jQuery extensions that can be called internally or from a View.
* */

$.fn.addNewList = function() {
    var listName = 'list' + listCount.amount;
    // Add the last list in the DOM (the newest one).
    this.data(listName, new $.RichList(this.children(rflOptions.itemNode + ':last'), listName));
    listCount.increase();
};

$.fn.rflListeners = function($instance) {
    animAllArrowsListener();
    textListener();
};

$.fn.delAllEmptyListsTrigs = function() {
    $.each(this.data(),function(){
        if (this instanceof $.RichList) {
            var $mainList = $(this.list.$rootList[0]).children('.' + rflOptions.mainAccordionClass);
            this.deleteEmptyListsTriggers($mainList);
        }
    });
};

$.fn.getNumberLists = function() {
    return listCount.amount;
};
