/*
Abdelrahman Qamhia - aaq225
CSE264 - Programming Assignment 5
My Personal Library
*/

// this is similar to p4's addToDropDown function.
function addToDropDown(select, elements) {
    elements.forEach(element => {
        $(select).append(`<option value="${element.artist}">${element.artist}</option>`);
    });
}

// default value for the page initially should be 1
let currentPage = 1;

//  get the songs from the server which in turns queries the song db
function getSongs() {
    const artist = $('#artists-select').val();
    const keyword = $('#keyword').val();
    const limit = $('#display-amount-select').val();

    // this will be the data 
    const data = {
        artist: artist,
        keyword: keyword,
        page: currentPage
    };
    if (limit) {
        data.limit = limit; // only adds a limit property to the json object if the user selected a limit that's not the default val or ""
    }

    $.ajax({
        url: '/songs',
        type: 'GET',
        dataType: 'json',
        data: data,
        success: function (response) {
            const tableBody = $('#song-rows');
            tableBody.empty(); // set current rows to empty

            let firstSongInPageIndex;
            let indexPaginated;
            if (limit) {
                firstSongInPageIndex = (currentPage - 1) * parseInt(limit); // (if page = 5, limit = 10), (5-1) * 10 = 40 would be the starting index 
            } else {
                firstSongInPageIndex = 0; // I will increment this later when I append it (!!! REMEMBER THIS)
            }

            $.each(response, function (index, song) {
                indexPaginated = firstSongInPageIndex + index + 1; // if firstSongIndex = 40, then we add the index from the each loop, and 1 to account for index starting at 1
                const row = $('<tr></tr>');
                row.append($('<td></td>').text(indexPaginated));
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
}

// search button on click event handling
$('#search-btn').on('click', function () {
    currentPage = 1; // set the page index back to 1 when a new search is started
    getSongs();
});

// next-prev buttons on click event handling
$('#prev-btn').on('click', function () {
    if (currentPage > 1) { // only display prev page if the current page is not the first one
        currentPage--;
        getSongs();
    }
});

$('#next-btn').on('click', function () {
    currentPage++;
    getSongs();
});

// I ran into a problem when the user enters a value into the textbox for keyword, the form would refresh and the textbox cleared, so I looked into how to prevent that.
$('#song-library-form').on('submit', function (e) {
    e.preventDefault(); // this will not allow the submission proccess as normal; learned more about that here: https://stackoverflow.com/questions/3350247/how-to-prevent-form-from-being-submitted
    getSongs(); // once the user clicks enter after typing the keyword, I will trigger the song
});


// this will execute when the page loads! gets the artists from the server to the artists select
$(() => {
    $.ajax({
        url: "/artists",
        type: "GET",
        dataType: "json",
        success: function (response) {
            addToDropDown("#artists-select", response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error: " + jqXHR.responseText);
            alert("Error: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
});
