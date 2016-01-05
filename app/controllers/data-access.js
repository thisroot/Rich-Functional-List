function getData(callback, errorCB) {
    $.ajax({
        method: "GET",
        url: "data/todo-list-data.json",
        dataType: "json",
        error: function (request, status, error) {
            errorCB(error);
        }
    }).done(function (data) {
        $('#base-list').html(buildDom(data));
        callback();
    });
}

function saveJSON(data, errorCB) {
    $.ajax({
        method: "POST",
        url: "data/save-json-data.php",
        data: JSON.stringify(data),
        processData: false,
        error: function (request, status, error) {
            errorCB(error);
        }
    }).done(function(result) {
        if (result) {
            $("#flash-messaging").show().html("Saved successfully.").addClass('positive');
            setTimeout(function() {
                $("#flash-messaging").fadeOut(1000);
            }, 1000);
            saveState.listsChanged = false;
        } else {
            $("#flash-messaging").show().html("Save error.").addClass('negative');
            setTimeout(function() {
                $("#flash-messaging").fadeOut(1000);
            }, 1000);
        }
    }).fail(function(){
        $("#flash-messaging").show().html("Save error.").addClass('negative');
        setTimeout(function() {
            $("#flash-messaging").fadeOut(1000);
        }, 1000);
    });
}
