function buildDom(jsonData) {
    var domList ="";
    // Go through each object (main list card).
    for (var i = 0; i < jsonData.length; i++) {
        domList += buildTitleCard(jsonData[i], i);
        domList += buildCards(jsonData[i]);
        domList += closeList();
    }
    return domList;
}

function buildTitleCard(data, listNumber) {
    var rowNum = listNumber + 1;
    return '<li class="brick large rfl-list-title rfl-trigger-item" data-row="' + rowNum + '" data-col="1" data-sizex="1" data-sizey="1" data-list-number="' + listNumber + '" > ' +
                '<div class="rfl-title-card">' +
                    '<div class="buttons-title"><span class="fa fa-times rfl-delete"></span><span class="fa fa-plus-circle rfl-add-title "></span><span class="dd-handle fa icon-handle"></span>' +
                    '</div><span class="fa fa-chevron-right rfl-trigger rfl-trigger-main"></span>' +
                    '<h2 class="rfl-title-content">' + data.listTitle + '</h2>' +
                '</div>' +
                '<ul class="rfl-subAccordion rfl-list rfl-mainAccordion rfl-trigger-item">';
}

function buildCards(data) {
    var cardList = '';
    for (var i = 0; i < data.listData.length; i++) {
        if (typeof data.listData[i] === 'object') {
            cardList += buildSublist(data.listData[i]);
        } else {
            cardList += '<li class=" rfl-item">' +
                '<div class="arrow-background"></div>' +
                '<div class="rfl-list-content">' + data.listData[i] + '</div>' +
                '<div class="buttons"><span class="fa fa-times rfl-delete"></span><span class="fa fa-plus-circle rfl-add"></span>' +
                    '<div class="rfl-handle fa icon-handle "></div>' +
                '</div>' +
            '</li>';
        }
    }
    return cardList;
}

function buildSublist(data) {
    var sublist = '<li class="rfl-list-title rfl-item">' +
                    '<div class="arrow-background"></div>' +
                    '<div class="rfl-list-content">' + data.listTitle + '</div>' +
                    '<span class="fa fa-chevron-right rfl-trigger "></span>' +
                    '<div class="buttons"><span class="fa fa-times rfl-delete"></span><span class="fa fa-plus-circle rfl-add"></span>' +
                        '<div class="rfl-handle fa icon-handle "></div>' +
                    '</div>' +
                 '</li>' +
                 '<li class="rfl-subaccordion-item">' +
                    '<ul class="rfl-subAccordion rfl-list rfl-trigger-item">';
    sublist += buildCards(data) + '</li></ul>';
    return sublist;
}

function closeList() {
    return '</ul></li>';
}
