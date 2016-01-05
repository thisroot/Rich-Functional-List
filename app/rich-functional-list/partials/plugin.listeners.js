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
