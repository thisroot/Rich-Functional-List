$.RichList.prototype.resetItems = function() {
    var itemsReset = {
        floating        : null,
        evTarget        : null,
        underMouse      : null
    };
    items = $.extend({}, items, itemsReset);
};

$.RichList.prototype.floatItem = function(dragItem, parentList) {
    this.createFloat(dragItem);
    this.getChildren(dragItem, parentList);
    this.appendPlaceholder(dragItem);
    $(document.body).append(items.floating);
};

$.RichList.prototype.createFloat = function(dragItem) {
    items.floating = $(document.createElement(rflOptions.itemNode)).addClass(rflOptions.listClass + ' ' + rflOptions.dragClass);
    items.floating.css('width', dragItem.outerWidth(true));
};

$.RichList.prototype.floatItemPosition = function(e) {
    items.floating.css({
        'left' : e.pageX - items.floating.outerWidth(true) + 25,
        'top'  : e.pageY - 25
    });
};

$.RichList.prototype.getChildren = function(dragItem, parentList) {
    if (dragItem.next().is('.' + rflOptions.subItemClass)) {
        // If item has children store them in memory.
        dragItem.next().children('.' + rflOptions.openClass).removeClass(rflOptions.openClass);
        dragItem.children('.' + rflOptions.triggerClass).removeClass(rflOptions.triggerRotClass);
        dragItem.children('.' + rflOptions.triggerClass).collapse(dragItem.parentsUntil(true));
        items.floating.contents = dragItem.next();
        this.removeEmptyParentList(parentList);
    } else {
        items.floating.contents = false;
    }
};

$.RichList.prototype.removeEmptyParentList = function(parentList) {
    var parentListTitle = parentList.prev('.' + rflOptions.listTitle);
    // If item's parent now has no children, remove parent trigger & child list.
    if (parentListTitle.length && !parentList.children(rflOptions.itemNode).length) {
        parentListTitle.children('.' + rflOptions.triggerClass).remove();
        parentListTitle.removeClass(rflOptions.listTitle);
        parentList.remove();
    }
};

$.RichList.prototype.appendPlaceholder = function(dragItem) {
    items.placeholder.css('height', dragItem.outerHeight());
    dragItem.after(items.placeholder);
    dragItem.remove();
    items.floating.append(dragItem);
};

$.RichList.prototype.buildSublist = function($item, title) {
    $item.children('.' + rflOptions.itemContentClass).after(rflOptions.openTriggerMarkup);
    if (title) {
        $item.append(rflOptions.subListMarkupMain);
        $item.addClass(rflOptions.listTitle);
        // TODO: Decouple .buttons-title.
        $item.children('.' + rflOptions.titleItemClass).children('.buttons-title').after(function() {
            return rflOptions.mainTriggerMarkup;
        });
        $item.find('.' + rflOptions.triggerMainClass).addClass(rflOptions.triggerRotClass);
        return $item.children(rflOptions.listNode);
    } else {
        $item.after(rflOptions.subListMarkup);
        $item.addClass(rflOptions.listTitle);
        return $item.next();
    }
};

$.RichList.prototype.openList = function($item, $childList, title) {
    if (!$childList.hasClass(rflOptions.openClass)) {
        if (title) {
            $item.expandTitle();
            $childList.children('.' + rflOptions.subAccordionClass).addClass(rflOptions.openClass);
            $item.children('.' + rflOptions.titleItemClass).find('.' + rflOptions.triggerClass).addClass(rflOptions.triggerRotClass);
        } else {
            $item.expand();
            $childList.children('.' + rflOptions.subAccordionClass).addClass(rflOptions.openClass);
            $item.children('.' + rflOptions.triggerClass).addClass(rflOptions.triggerRotClass);
        }
    }
};

$.RichList.prototype.addItem = function($item, $childList, title) {
    if (!$childList.length) {
        $childList = this.buildSublist($item, title);
        this.list.$triggers.off();
        this.list.$triggers = this.list.$rootList.find('.' + rflOptions.triggerClass);
        this.initInnerTriggers();
        this.initFirstTrigger();
        this.list.$triggers.animLocalArrows();
        this.openList($item, $childList, title);
        if (title) {
            $childList.prepend(rflOptions.newItemMarkup);
        } else {
            $childList.children('.' + rflOptions.subAccordionClass).prepend(rflOptions.newItemMarkup);
        }
    } else {
        this.openList($item, $childList, title);
        $childList.prepend(rflOptions.newItemMarkup);
    }
    textListener();
    this.deleteItemListener();
    this.addItemListener();
    this.handleListeners();
    $childList.find('.rfl-list-content:first').trigger('click');
    rflOptions.domUpdate.call(this);
};
