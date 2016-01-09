$.RichList.prototype.newListListeners = function(homeListNum, currNum, el) {
    // If dropped onto a new list, restart the triggers there.
    el.parents().each(function() {
        if (currNum !== homeListNum) {
            var targetList = $callObject.data('list' + currNum),
                $mainList = $(targetList.list.$rootList[0]).children('.' + rflOptions.mainAccordionClass);
            targetList.deleteEmptyListsTriggers($mainList);
            targetList.list.$triggers = targetList.list.$rootList.find('.' + rflOptions.triggerClass);
            targetList.resetItems();
            targetList.resetMouse();
            targetList.list.$triggers.off();
            targetList.initInnerTriggers();
            targetList.initFirstTrigger();
            targetList.list.$triggers.animLocalArrows();
            targetList.handleListeners();
        }
    });
};

$.RichList.prototype.handleListeners = function() {
    var instance = this;
    // Turn handle listeners off first so they are never duplicated.
    instance.list.$rootList.find('.' + rflOptions.handleClass).off();
    $(document).off('touchmove mousemove', moving);
    $(document).off('touchend touchcancel mouseup', stopped);

    this.list.$rootList.find('.' + rflOptions.handleClass).on('touchstart mousedown', function (e) {
        var eventTouchList = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        e.preventDefault();
        instance.dragStart(eventTouchList, instance.list);
        $(document).on('touchmove mousemove', instance, moving).on('touchend touchcancel mouseup', instance, stopped);
    });
};

function moving(e) {
    var eventTouchList = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
    if (items.floating) {
        e.preventDefault();
        e.data.dragMove(eventTouchList, e.data.list);
    }
}

function stopped(e) {
    var eventTouchList = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
    if (items.floating) {
        e.preventDefault();
        e.data.dragStop(eventTouchList, e.data.list, $(e.data));
    }
}

$.RichList.prototype.addItemListener = function() {
    var instance = this;
    this.list.$rootList.find('.' + rflOptions.addClass).unbind().click(function() {
        saveState.listsChanged = true;
        // Each particular "+" button.
        var $item = $(this).parents('.' + rflOptions.itemClass),
            $childList = $item.next('.' + rflOptions.subItemClass).children(rflOptions.listNode);
        instance.addItem($item, $childList, false);
    });

    this.list.$rootList.find('.' + rflOptions.addTitleClass).unbind().click(function() {
        saveState.listsChanged = true;
        // Each particular TITLE "+" button.
        var $mainItem = $(this).parents('.' + rflOptions.triggerItemClass),
            $mainChildList = $mainItem.children(rflOptions.listNode);
        instance.addItem($mainItem, $mainChildList, true);
    });
};

$.RichList.prototype.deleteItemListener = function() {
    this.deleteMainList();
    this.deleteInnerItems();
};

$.RichList.prototype.deleteMainList = function() {
    this.list.$rootList.find('.' + rflOptions.deleteClass).first().unbind().click(function() {
        var $callObj = $(this),
            confirmation;
        confirmation = window.confirm("Are you sure you want to delete this card & all its children?");
        if (confirmation) {
            var $item
                = ($callObj.parents('.' + rflOptions.titleItemClass).length)
                ? ($callObj.parents('.' + rflOptions.titleItemClass).parent('.' + rflOptions.listTitle))
                : ($callObj.parents('.' + rflOptions.itemClass));

            saveState.listsChanged = true;
            $item.next('.' + rflOptions.subItemClass).children(rflOptions.listNode).find('*').remove();
            $item.next('.' + rflOptions.subItemClass).children(rflOptions.listNode).remove();
            $item.next('.' + rflOptions.subItemClass).remove();
            $item.find('*').remove();
            rflOptions.removeMainList($item);
        }
    });
};

$.RichList.prototype.deleteInnerItems = function() {
    var currList = this;
    this.list.$rootList.find('.' + rflOptions.deleteClass).not(':first').unbind().click(function() {
        var $callObj = $(this),
            confirmation;
        confirmation = window.confirm("Are you sure you want to delete this card & all its children?");
        if (confirmation) {
            deleteItem(true, $callObj);
            rflOptions.domUpdate.call(currList);
        }
    });
};

function deleteItem(confirmed, $callObj) {
    if (confirmed) {
        var $item
            = ($callObj.parents('.' + rflOptions.titleItemClass).length)
            ? ($callObj.parents('.' + rflOptions.titleItemClass).parent('.' + rflOptions.listTitle))
            : ($callObj.parents('.' + rflOptions.itemClass));

        saveState.listsChanged = true;

        // If removing the last item in the main-list.
        // Else if removing the last item in the sublist.
        if ($item.parent('.' + rflOptions.mainAccordionClass).children('.' + rflOptions.itemClass).length === 1) {
            $item.parent('.' + rflOptions.mainAccordionClass).prev('.' + rflOptions.titleItemClass).children().remove('.' + rflOptions.triggerClass);
            $item.parent('.' + rflOptions.mainAccordionClass).remove();
        } else if ($item.parent('.' + rflOptions.subAccordionClass).children('.' + rflOptions.itemClass).length === 1) {
            // Remove trigger icon & class.
            $item.parent('.' + rflOptions.subAccordionClass).parent('.' + rflOptions.subItemClass).prev('.' + rflOptions.listTitle).children().remove('.' + rflOptions.triggerClass);
            $item.parent('.' + rflOptions.subAccordionClass).parent('.' + rflOptions.subItemClass).prev('.' + rflOptions.listTitle).removeClass(rflOptions.listTitle);
            $item.parent('.' + rflOptions.subAccordionClass).parent('.' + rflOptions.subItemClass).remove();
            $item.parent('.' + rflOptions.subAccordionClass).remove();
        }

        $item.next('.' + rflOptions.subItemClass).children(rflOptions.listNode).find('*').remove();
        $item.next('.' + rflOptions.subItemClass).children(rflOptions.listNode).remove();
        $item.next('.' + rflOptions.subItemClass).remove();
        $item.find('*').remove();
        $item.remove();
    }
}