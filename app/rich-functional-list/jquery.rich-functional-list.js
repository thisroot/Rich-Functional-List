/**
 * jquery.rich-functional-list.js
 * Copyright Aaron McAvinue 2015
 * v1.0.0
 *
 * Special thanks to Nestable whose code had a significant impact on building this plugin.
 * http://dbushell.github.io/Nestable/
 *
 * NOTES:
 *      The $.RichList objects live on the call object in $(callobject).data() in memory.
 *
 *      The partials files are prefixed with the scope of "this".
 *          jquery.*    : "this" is the jQ object calling the function.
 *          plugin.*    : "this" is the global scope.
 *          RL.*        : "this" is the instance of the $.RichList class.
 *
 *      STRUCTURE OF THE PLUGIN:
 *          Think of $.richFunctionalList as the SUPER-CLASS.
 *              This starts the plugin & sets up the environment for the lists.
 *              Contains methods that affect any/all of the lists in the document.
 *          $.RichList is the INHERITING CLASS.
 *              Each instance of $.RichList represents one list-tree in the DOM.
 *              Contains methods that affect ONLY that singular list in the document.
 *              $.RichList can access all variables/methods in $.richFunctionalList.
 *          The entire plugin is roughly ONE UNIT. It is wrapped in an IIFE & does not pollute global scope.
 */

(function(){
    'use strict';
/*
* All the single-instance/static variables for the plugin.
* */

var rflDefaults = {
        listNode             : 'ul',
        itemNode             : 'li',

        listClass            : 'rfl-list',
        listTitle            : 'rfl-list-title',
        itemContentClass     : 'rfl-list-content',
        itemClass            : 'rfl-item',
        subItemClass         : 'rfl-subaccordion-item',

        titleContentClass    : 'rfl-title-content',
        titleItemClass       : 'rfl-title-card',

        triggerClass         : 'rfl-trigger',
        triggerItemClass     : 'rfl-trigger-item',
        triggerMainClass     : 'rfl-trigger-main',
        triggerRotClass      : '',

        // Internal identifiers.
        // TODO: Refactor to: floatClass : 'rfl-floating'
        dragClass            : 'rfl-dragel',
        placeClass           : 'rfl-placeholder',
        openClass            : 'rfl-open',

        // Buttons.
        deleteClass          : 'rfl-delete',
        addClass             : 'rfl-add',
        addTitleClass        : 'rfl-add-title',
        handleClass          : 'rfl-handle',

        // Accordions.
        mainAccordionClass   : 'rfl-mainAccordion',
        subAccordionClass    : 'rfl-subAccordion',

        // Optional functions.
        stateUpdate          : function() {return;},
        domUpdate            : function() {return;},

        // Custom markup.
        newItemMarkup        : '',
        openTriggerMarkup    : '',
        subListMarkup        : '',
        subListMarkupMain    : '',
        mainTriggerMarkup    : ''
    },
    mouse = {
        lastX           : 0,
        lastY           : 0,
        nowX            : 0,
        nowY            : 0,
        distX           : 0,
        distY           : 0,
        dirAx           : 0,
        dirX            : 0,
        dirY            : 0,
        lastDirX        : 0,
        lastDirY        : 0,
        distAxX         : 0,
        distAxY         : 0
    },
    items = {
        floating        : null,
        evTarget        : null,
        underMouse      : null,
        placeholder     : null
    },
    listCount = {
        amount: 0,
        increase: function() {
            this.amount++;
        }
    },
    rflOptions,
    $callObject;

function animAllArrowsListener() {
    $('.' + rflOptions.triggerClass).off('click', animAllArrows).on('click', animAllArrows);
}

function animAllArrows() {
    $(this).toggleClass(rflOptions.triggerRotClass);
}

// TODO: Decouple this into a separate text-editing module. Leave the listener here though.
function textListener() {
    $('.' + rflOptions.titleContentClass + ', .' +  rflOptions.itemContentClass).click(function() {
        var content = $(this).text(),
            newContent;
        $(this).off();
        $(this).html('');
        $('<textarea></textarea>')
            .attr({
                class: 'textbox',
                cols: 40,
                rows: 3
            })
            .appendTo(this)
            .focus()
            .html(content)
            .focusout(function(){
                newContent = $(this).val();
                $(this).parent().html(newContent);
                $(this).remove();
            });
        $(this).focusout(function() {
            textListener();
            rflOptions.domUpdate.call(this);
        });
        rflOptions.stateUpdate();
    });
}

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
    this.list.$rootList.find('.' + rflOptions.deleteClass).unbind().click(function() {
        var $callObj = $(this),
            confirmation;
        function deleteItem(confirmed) {
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

                rflOptions.domUpdate.call(this);
            }
        }
        confirmation = window.confirm("Are you sure you want to delete this card & all its children?");
        if (confirmation) {
            deleteItem(true);
        }

    });
};

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
        currNum = items.placeholder.parents('li[data-list-number]').data('list-number');
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
    rflOptions.domUpdate.call(this);
    rflOptions.domUpdate.call($callObject.data('list' + currNum));
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

})();