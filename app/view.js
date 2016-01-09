function startView() {
    var newCard         = '<li class="rfl-item">' +
                            '<div class="arrow-background"></div>' +
                            '<div class="rfl-list-content"></div>' +
                            '<div class="buttons">' +
                                '<span class="fa fa-times rfl-delete"></span>' +
                                '<span class="fa fa-plus-circle rfl-add"></span>' +
                                '<div class="rfl-handle fa icon-handle"></div>' +
                            '</div>' +
                          '</li>',
        openTrigger     = '<span class="fa fa-chevron-right rfl-trigger fa-rotate-90"></span>',
        subList         = '<li class="rfl-subaccordion-item"><ul style="display: block;" class="rfl-subAccordion rfl-list rfl-trigger-item rfl-open"></ul>',
        subListMain     = '<ul style="display: block;" class="rfl-subAccordion rfl-list rfl-mainAccordion rfl-trigger-item rfl-open"></ul>',
        mainTrigger     = '<span class="fa fa-chevron-right rfl-trigger rfl-trigger-main"></span>',
        rflOptions      = {
            stateUpdate         : function() {saveState.listsChanged = true;},
            domUpdate           : function() {gridsterUpdate.call(this);},
            removeMainList      : function($item) {gridsterRemoveItem($item);},
            triggerRotClass     : 'fa-rotate-90',
            newItemMarkup       : newCard,
            openTriggerMarkup   : openTrigger,
            subListMarkup       : subList,
            subListMarkupMain   : subListMain,
            mainTriggerMarkup   : mainTrigger
        },
        gridsterOptions = {
            widget_selector: '.brick',
            widget_margins: [10, 0],
            widget_base_dimensions: [535, 10],
            max_cols: 3,
            max_size_x: 1,
            avoid_overlapped_widgets: true,
            autogrow_cols: true,
            resize:{
                enabled: true,
                handle_class: false
            },
            draggable : {
                handle : '.buttons-title .dd-handle'
            }
        };
    // Start the RFL plugin.
    $('#base-list').richFunctionalList(rflOptions);

    // Set up media queries that work with Gridster. Starts Gridster based on the window/device size.
    pluginMediaQueries(false, gridsterOptions);
    $(window).resize(function() {
        pluginMediaQueries(true, gridsterOptions);
    });

    // Watch the menu button.
    $('#list-icon').click(function(){
        $(this).toggleClass('open');
        $('#menu-content').slideToggle(350);
    });

    // Watch the save button.
    $("#save").on("click", function() {
        saveData($('#base-list'));
    });

    // Watch the parent add button.
    $('#main-add').unbind().click(function() {
        saveState.listsChanged = true;
        var $baseList = $('#base-list'),
            listNumber = $baseList.getNumberLists(),
            rowNum = listNumber + 1;
        $(".gridster #base-list").gridster().data('gridster').add_widget('<li class="brick large rfl-list-title rfl-trigger-item" data-row="' + rowNum + '" data-col="1" data-sizex="1" data-sizey="1" data-list-number="' + listNumber + '"><div class="rfl-title-card"><div class="buttons-title"><span class="fa fa-times rfl-delete"></span><span class="fa fa-plus-circle rfl-add-title "></span><span class="dd-handle fa icon-handle"></span></div><h2 class="rfl-title-content"></h2></div></li>');
        $baseList.addNewList(rflOptions);
        $baseList.rflListeners();
        $baseList.find('h2:last').trigger('click');
    });
}

function gridsterRemoveItem($item) {
    var gridster = $(".gridster #base-list").gridster().data('gridster');
    gridster.remove_widget($item);
}

function gridsterResizeCard() {
    var numRows = Math.round(($(this).outerHeight() / 10) + 1);
    this.dataset.sizey = numRows;
}

function gridsterUpdate() {
    var $currList = $(this).parents('.brick:first').length ? $(this).parents('.brick:first') : this.list.$rootList,
        gridster = $(".gridster #base-list").gridster().data('gridster'),
        numRows;
    numRows = Math.ceil(($currList.outerHeight() / 10) + 1);
    gridster.resize_widget($currList, 1, numRows);
}

function pluginMediaQueries(reset, options) {
    if (window.innerWidth >= 1588) { updateWindow(reset, 3, 535, 1588, 1588, options); }
    else if (window.innerWidth >= 1050) { updateWindow(reset, 2, 535, 1050, 1050, options); }
    else if (window.innerWidth >= 650) { updateWindow(reset, 1, 535, 514, 650, options); }
    else if (window.innerWidth >= 515) { updateWindow(reset, 1, 535, 514, 515, options); }
    else { updateWindow(reset, 1, 320, 320, 320, options); }
}

function updateWindow(reset, columns, base, width, windowSize, options) {
    var newOptions = $.extend({}, options, {max_cols : columns});

    if (reset) {
        $(".gridster #base-list").gridster().data('gridster').destroy();
    }

    // Resize the list-cards to be compatible with Gridster.
    $('#base-list').children('li').each(gridsterResizeCard);
    // Start the gridster plugin.
    $(".gridster #base-list").gridster(newOptions);

    // Resize the menu.
    $('#base-list').css('width', width + 'px');
    if (windowSize >= 650) {
        $('#flash-messaging').insertAfter('h1');
        $('#menu-buttons').append($('#function-icons'));
    } else if (windowSize >= 515) {
        $('#flash-messaging').insertAfter('h1');
        $('#menu-content').prepend($('#function-icons'));
    } else {
        $('#menu-content').append($('#flash-messaging'));
        $('#menu-content').prepend($('#function-icons'));
    }
}
