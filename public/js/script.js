/*
Abdelrahman Qamhia - aaq225
CSE264 - Programming Assignment 5
My Personal Library
*/

function addToDropDown(select, elements) {

    elements.forEach(element => {
        $(select).append(`<option value ="${element.artist}">${element.artist}</option>`)
    });
}

$('#search-btn').on('click', function (e) {
    const artist = $('#artists-select').val();
    const keyword = $('#keyword').val();

    $.ajax({
        url: '/songs',
        type: 'GET',
        dataType: 'json',
        data: { // this sends over the artist and keyword the client chose
            artist: artist,
            keyword: keyword
        },
        success: function (response) {
            const tableBody = $('#song-rows'); 
            tableBody.empty(); // set current rows to empty

            $.each(response, function (index, song) {
                const row = $('<tr></tr>');
                row.append($('<td></td>').text(index + 1));
                row.append($('<td></td>').text(song.title));
                row.append($('<td></td>').text(song.artist));

                // this will highlight the song if it's numone field = 1
                if (song.numone === 1) {
                    row.css('backgroundColor', '#BDF3BC');
                }

                tableBody.append(row);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error: " + jqXHR.responseText);
            alert("Error: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
});


$(() => {
    $.ajax({
        url: "/artists",
        type: "GET",
        dataType: "json",
        success: function (response) {
            addToDropDown("#artists-select", response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error: " + jqXHR.responseText);
            alert("Error: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
})
