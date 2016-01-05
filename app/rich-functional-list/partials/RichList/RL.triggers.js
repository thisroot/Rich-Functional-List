$.RichList.prototype.initFirstTrigger = function() {
    this.list.$triggers.first().bind('click', function() {
        var $listItem = $(this).closest('.' + rflOptions.triggerItemClass),
            $subAccordion = $listItem.children('.' + rflOptions.subAccordionClass);
        if( $subAccordion.hasClass(rflOptions.openClass) ) {
            $(this).doCollapse($subAccordion);
        } else {
            $(this).doExpand($subAccordion);
        }
    });
};

$.RichList.prototype.initInnerTriggers = function() {
    this.list.$triggers.not(':first').bind('click', function() {
        var $listItem = $(this).closest('.' + rflOptions.itemClass),
            $subAccordion = $listItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass);
        if( $subAccordion.hasClass(rflOptions.openClass) ) {
            $(this).doCollapse($subAccordion);
        } else {
            $(this).doExpand($subAccordion);
        }
    } );
};

$.RichList.prototype.deleteEmptyListsTriggers = function($mainList) {
    // Delete all empty triggers & sublists.
    // TODO: Dry this up.
    var $triggerLists = $mainList.find('.' + rflOptions.listTitle);
    $triggerLists.each(function() {
        var $sublists = $(this).next('.' + rflOptions.subItemClass).children(rflOptions.listNode);
        $sublists.each(function() {
            if (!$(this).children().length) {
                var $titleItem = $(this).parent('.' + rflOptions.subItemClass).prev('.' + rflOptions.listTitle);
                $titleItem.children().remove('.' + rflOptions.triggerClass);
                $titleItem.removeClass(rflOptions.listTitle);
                $(this).parent('.' + rflOptions.subItemClass).remove();
                $(this).remove();
            }
        });
    });
};
