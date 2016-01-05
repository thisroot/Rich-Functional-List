$.fn.animLocalArrows = function() {
    this.each(function() {
        $(this).on('click', function() {
            $(this).toggleClass('fa-rotate-90');
        });
    });
};

$.fn.expand = function(show) {
    var $listItem = $(this).closest('.' + rflOptions.itemClass),
        $subAccordion = $listItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass);
    if (show) {
        $subAccordion.show();
        return rflOptions.domUpdate.call(this);
    } else if ( !$subAccordion.hasClass(rflOptions.openClass) ) {
        // Syntax for this should be $subAccordion.doExpand();
        $(this).doExpand($subAccordion);
    }
};

$.fn.collapse = function(hide) {
    var $listItem = $(this).closest('.' + rflOptions.itemClass),
        $subAccordion = $listItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass);
    if (hide) {
        $subAccordion.hide();
        return rflOptions.domUpdate.call(this);
    } else if( $subAccordion.hasClass(rflOptions.openClass) ) {
        // Syntax for this should be $subAccordion.doCollapse();
        $(this).doCollapse($subAccordion);
    }
};

$.fn.doExpand = function($subAccordion) {
    $subAccordion.addClass(rflOptions.openClass);
    $subAccordion.slideDown({
        duration: 350,
        queue: false,
        progress: function() {
            // console.log($(this).parents('.' + rflOptions.triggerItemClass + ':first').outerHeight());
            rflOptions.domUpdate.call(this);
        }
    });
};

$.fn.doCollapse = function($subAccordion) {
    $subAccordion.slideUp({
        duration: 350,
        queue: false,
        progress: function() {
            // console.log($(this).parents('.' + rflOptions.triggerItemClass + ':first').outerHeight());
            rflOptions.domUpdate.call(this);
        }
    });
    $subAccordion.removeClass(rflOptions.openClass);
};

$.fn.expandTitle = function(show) {
    var $listItem = $(this).closest('.' + rflOptions.triggerItemClass),
        $subAccordion = $listItem.children('.' + rflOptions.subAccordionClass);
    if (show) {
        $subAccordion.show();
        return rflOptions.domUpdate.call(this);
    } else if ( !$subAccordion.hasClass(rflOptions.openClass) ) {
        $subAccordion.addClass(rflOptions.openClass);
        $(this).doExpand($subAccordion);
    }
};
