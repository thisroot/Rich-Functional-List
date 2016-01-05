function mapData($baseList) {
    var domList = [];
    $baseList.children().each(function(i) {
        domList.push({});
        domList[i].listTitle = mapTitle($(this));
        domList[i].listData = mapTitleCards($(this));
    });
    return domList;
}

function mapTitle($list) {
    return $list.find('.rfl-title-content').html();
}

function mapSubTitle($list) {
    return $list.find('.rfl-list-content').html();
}

function mapTitleCards($list) {
    var listData = [],
        i = 0;
    $list.children('.rfl-list').children().each(function(){
        if ($(this).hasClass('rfl-list-title')) {
            listData.push({});
            listData[i].listTitle = mapSubTitle($(this));
            listData[i].listData = mapSubCards($(this));
            i++;
        } else if ($(this).hasClass('rfl-item')) {
            listData.push($(this).children('.rfl-list-content').html());
            i++;
        }
    });
    return listData;
}

function mapSubCards($list) {
    var listData = [],
        i = 0;
    $list.next('.rfl-subaccordion-item').children('.rfl-list').children().each(function(){
        if ($(this).hasClass('rfl-list-title')) {
            listData.push({});
            listData[i].listTitle = mapSubTitle($(this));
            listData[i].listData = mapSubCards($(this));
            i++;
        } else if ($(this).hasClass('rfl-item')) {
            listData.push($(this).children('.rfl-list-content').html());
            i++;
        }
    });
    return listData;
}
