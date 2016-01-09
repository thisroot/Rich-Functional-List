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
        removeMainList       : function() {return;},

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
