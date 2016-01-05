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
            triggerRotClass     : 'fa-rotate-90',
            newItemMarkup       : newCard,
            openTriggerMarkup   : openTrigger,
            subListMarkup       : subList,
            subListMarkupMain   : subListMain,
            mainTriggerMarkup   : mainTrigger
        };
    // Start the RFL plugin.
    $('#base-list').richFunctionalList(rflOptions);

    // Set up dynamic media queries.
    updateWindow(window.innerWidth);
    $(window).resize(function() {
        updateWindow(window.innerWidth);
    });

    // Watch the menu button.
    $('#list-icon').click(function(){
        $(this).toggleClass('open');
        $('.mobile-menu-content').slideToggle(350);
    });
}

function updateWindow(windowSize) {
    if (windowSize > 1100) {
        $('nav').append($('.menu-items'));
    } else if (windowSize <= 1100) {
        $('.mobile-menu-content').append($('.menu-items'));
    } else if (windowSize >= 750) {
        $('.mobile-menu-content').append($('.menu-items'));
    } else {
        $('.mobile-menu-content').append($('.menu-items'));
    }
}
