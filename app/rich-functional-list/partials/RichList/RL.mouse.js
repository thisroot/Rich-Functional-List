$.RichList.prototype.dragStart = function(e, list) {
    var target   = $(e.target),
        parentList = target.closest('.' + rflOptions.triggerItemClass);
    items.evTarget = target.closest('.' + rflOptions.itemClass);
    mouse.lastX = e.pageX;
    mouse.lastY = e.pageY;
    this.floatItem(items.evTarget, parentList);
    this.floatItemPosition(e);
    rflOptions.stateUpdate();
    this.list.$triggers.off();
    rflOptions.domUpdate.call(this);
};

$.RichList.prototype.dragStop = function(e, list) {
    var item = items.floating.children(rflOptions.itemNode).first(),
        $mainList = $(this.list.$rootList[0]).children('.' + rflOptions.mainAccordionClass),
        homeListNum = this.list.$rootList.data('list-number'),
        currNum = items.placeholder.parents('li[data-list-number]').data('list-number'),
        newList = $callObject.data('list' + currNum);
    // Put the item & children in the list.
    items.placeholder.replaceWith(item);
    if (items.floating.contents) {
        item.after(items.floating.contents);
    }
    items.floating.remove();
    // Clean up, reset & restart.
    textListener();
    $callObject.delAllEmptyListsTrigs();
    this.resetItems();
    this.resetMouse();
    this.list.$triggers.animLocalArrows();
    this.initInnerTriggers();
    this.initFirstTrigger();
    this.newListListeners(homeListNum, currNum, item);
    this.handleListeners();
    this.deleteItemListener();
    this.addItemListener();
    this.deleteItemListener.call(newList);
    this.addItemListener.call(newList);
    rflOptions.domUpdate.call(this);
    rflOptions.domUpdate.call(newList);
};

$.RichList.prototype.dragMove = function(e, list) {
    var newAx,
        $mainList = $(this.list.$rootList[0]).children('.' + rflOptions.mainAccordionClass),
        currNum = items.placeholder.parents('li[data-list-number]').data('list-number');
    this.floatItemPosition(e);
    this.deleteEmptyListsTriggers($mainList);
    this.mousePositionCalc(e);
    newAx = this.mouseNewAx();
    this.mouseDistMoved(newAx);
    this.itemUnderCursor(e);
    this.moveHorizontal();
    this.moveVertical(e);
    rflOptions.domUpdate.call(this);
    rflOptions.domUpdate.call($callObject.data('list' + currNum));
};

$.RichList.prototype.resetMouse = function() {
    mouse = {
        lastX     : 0,
        lastY     : 0,
        nowX      : 0,
        nowY      : 0,
        distX     : 0,
        distY     : 0,
        dirAx     : 0,
        dirX      : 0,
        dirY      : 0,
        lastDirX  : 0,
        lastDirY  : 0,
        distAxX   : 0,
        distAxY   : 0
    };
    this.list.$triggers = this.list.$rootList.find('.' + rflOptions.triggerClass);
};

$.RichList.prototype.mousePositionCalc = function(e) {
    // mouse position last events
    mouse.lastX = mouse.nowX;
    mouse.lastY = mouse.nowY;
    // mouse position this events
    mouse.nowX  = e.pageX;
    mouse.nowY  = e.pageY;
    // distance mouse moved between events
    mouse.distX = mouse.nowX - mouse.lastX;
    mouse.distY = mouse.nowY - mouse.lastY;
    // direction mouse was moving
    mouse.lastDirX = mouse.dirX;
    mouse.lastDirY = mouse.dirY;
    // direction mouse is now moving (on both axis)
    mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
    mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
};

$.RichList.prototype.mouseNewAx = function() {
    // The axis mouse is now moving on.
    return (Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0);
};

$.RichList.prototype.mouseDistMoved = function(newAx) {
    // Calc distance moved (and direction) on this axis.
    if (mouse.dirAx !== newAx) {
        mouse.distAxX = 0;
        mouse.distAxY = 0;
    } else {
        mouse.distAxX += Math.abs(mouse.distX);
        if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
            mouse.distAxX = 0;
        }
        mouse.distAxY += Math.abs(mouse.distY);
        if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
            mouse.distAxY = 0;
        }
    }
    mouse.dirAx = newAx;
};

$.RichList.prototype.itemUnderCursor = function(e) {
    items.underMouse = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
    // If hovering over the placeholder, don't move it.
    if (items.underMouse.hasClass(rflOptions.placeClass)) {
        items.underMouse = false;
        return;
    }
    // If not directly over an item, find the item.
    if (!items.underMouse.hasClass(rflOptions.itemClass) || !items.underMouse.hasClass(rflOptions.subItemClass)) {
        // If item not found then we're not hovering over a list -- leave the placeholder.
        var foundItem = items.underMouse.closest('.' + rflOptions.itemClass + ', .' + rflOptions.subItemClass);
        if (foundItem.length) {
            items.underMouse = foundItem;
            this.checkPrev();
        } else {
            items.underMouse = false;
        }
    } else {
        this.checkPrev();
    }
};

$.RichList.prototype.checkPrev = function() {
    if (items.underMouse.hasClass(rflOptions.subItemClass) && items.underMouse.children('.' + rflOptions.subAccordionClass).hasClass(rflOptions.openClass)) {
        items.underMouse = items.underMouse.find('.' + rflOptions.itemClass + ':first');
    } else if (items.underMouse.hasClass(rflOptions.subItemClass)) {
        items.underMouse = items.underMouse.prev('.' + rflOptions.itemClass);
    }
};

$.RichList.prototype.moveVertical = function(e) {
    if (!mouse.dirAx && items.underMouse && items.underMouse.length) {
        var before = e.pageY < (items.underMouse.offset().top + items.underMouse.height() / 2),
            titleItem = items.underMouse.hasClass(rflOptions.listTitle);
        if (!titleItem && before) {
            items.underMouse.before(items.placeholder);
        } else if (!titleItem && !before) {
            items.underMouse.after(items.placeholder);
        } else if (titleItem && before) {
            items.underMouse.before(items.placeholder);
        } else if (titleItem && !before) {
            // Place the element after the subAccordion list.
            items.underMouse.next('.' + rflOptions.subItemClass).after(items.placeholder);
        }
    }
};

$.RichList.prototype.moveHorizontal = function() {
    if (mouse.dirAx && mouse.distAxX >= 35) {
        // TODO: Refactor the DOM traversals here into local variables for performance & maintainability.
        var prevItem = items.placeholder.prevAll('.' + rflOptions.itemClass + ':first');
        mouse.distAxX = 0;
        // If the item is a list & it's closed, open it.
        if (prevItem.hasClass(rflOptions.listTitle) && !prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).hasClass(rflOptions.openClass)) {
            prevItem.expand(true);
            prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).prepend(items.placeholder);
            prevItem.children('.' + rflOptions.triggerClass).addClass('fa-rotate-90');
            prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).addClass(rflOptions.openClass);
        } else if (prevItem.hasClass(rflOptions.listTitle) && prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).hasClass(rflOptions.openClass)) {
            // If the list is open put the placeholder in it.
            prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).prepend(items.placeholder);
            prevItem.children('.' + rflOptions.triggerClass).addClass('fa-rotate-90');
            prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).addClass(rflOptions.openClass);
        } else if (prevItem && !prevItem.hasClass(rflOptions.listTitle)) {
            // If the above item doesn't have a sublist, create one.
            var subList = rflOptions.subListMarkup;
            prevItem.addClass(rflOptions.listTitle);
            prevItem.append(rflOptions.openTriggerMarkup);
            prevItem.after(subList);
            prevItem.next('.' + rflOptions.subItemClass).children('.' + rflOptions.subAccordionClass).prepend(items.placeholder);
        }
    }
};
