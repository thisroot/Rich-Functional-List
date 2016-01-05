$.RichList = function(element, curListName) {
    this.list = {
        $rootList       : $(element),
        listName        : curListName,
        $triggers       : $(element).find('.' + rflOptions.triggerClass)
    };
    this.initFirstTrigger();
    this.initInnerTriggers();
    this.handleListeners();
    this.addItemListener();
    this.deleteItemListener();
};
