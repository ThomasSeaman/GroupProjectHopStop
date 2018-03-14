// Global Variables
var idArray = []
var latLngArray = []
var locNameArray = []
var breweryIdArray = []
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1']
var labelIndex = 0

//On click for landing page modal
$("#enterButton").on('click', function () {


    swal({
        title: "Welcome to Hopstop",
        text: "By agreeing you are confirming you are over the age of 21.",
        buttons: {
            text: "Agree",
            cancel: true
        }
    }).then(function () {
        window.location.href = "main.html";
    })
})


//on enter within "formUserState" fire onclick associated with the submitBtn
$("#formUserCity").keyup(function (event) {
    if (event.keyCode === 13) {
        $('#submitBtn').click();
    }
});

// On Submit Button Click
$('#submitBtn').on('click', function () {


    // Empty any data from last instance
    $('#searchResults').empty()
    $('#map').remove()
    $('#muteSection').remove()
    var latLngArray = []
    var latLngArray = []
    var breweryIdArray = []
    var locNameArray = []

    // Grab user city and state input, and convert into URI code
    var userCity = $('#formUserCity').val()
    var userState = $('#formUserState').val()
    var userCity = encodeURIComponent(userCity.trim())
    var userState = encodeURIComponent(userState.trim())


    // ajax request for user input data
    $.ajax({
        url: "https://crossorigin.me/http://api.brewerydb.com/v2/locations?key=0cb4a8ec09ac574eca1569f7b038857d&locality=" + userCity + "&region=" + userState + "",
        method: "GET"
    }).then(function (response) {

        //Flow control for if/when breweryDB doesnt locate a brewery in the searched city.
        if (typeof response.data === "undefined") {
            $('#formUserCity').val("") // - clears city input 
            $('#formUserState').val("") // - clears state input 

            swal("Oops!", "We're unable to locate any breweries in that city. Check your spelling or try a different location. ", {
                closOnClickOutside: false,
            });


        }

        else {
            // add map div to page
            $('.mapDiv').append(`<div id="muteSection" class="uk-section uk-section-muted">
                <div class="uk-container">
                <div class="uk-width-1-1 uk-resize-verticle" id="map">
                </div>
                </div>
            </div>`)

            //Adds an empty search div to the page. Get's populated later with $('#breweryCard').append function. 
            $('#searchResults').append(`
             <div class="uk-section uk-section-muted">
                <div class="uk-container results-div uk-width-1-1">
                    <h4 style="font-family: 'Amatic SC', cursive; font-size:2.0em;">Click Marker on Map for Brewery Info</h4>
                    <h3 style="font-family: 'Amatic SC', cursive; font-size:2.0em; font-weight:bold;">Search Results</h3>
                        <div id="breweryCard"></div>
                </div>
            </div>
            `)

            // move to top of map
            $('html, body').animate({
                scrollTop: ($('#searchBar').offset().top)
            }, 500)


            // Loop through api data and send relevant information to global variables
            for (i = 0; i < response.data.length; i++) {
                var lat = response.data[i].latitude
                var lng = response.data[i].longitude
                var latLngObj = { lat: lat, lng: lng }
                var locName = response.data[i].brewery.name

                var breweryId = response.data[i].brewery.id

                // Push variables to global variable
                locNameArray.push(locName)
                latLngArray.push(latLngObj)
                breweryIdArray.push(breweryId)

                //Location endpoint variables
                var breweryName = (response.data[i].brewery.name)
                var description = (response.data[i].brewery.description)
                var website = (response.data[i].brewery.website)
                var stAddress = (response.data[i].streetAddress)
                var state = (response.data[i].region)
                var zip = (response.data[i].postal)
                var phone = (response.data[i].phone)
                var brewIcon
                var brewImages = response.data[i].brewery.images

                //if then to handle blank icons
                if (typeof brewImages != 'undefined') {
                    var brewIcon = response.data[i].brewery.images.large
                }
                else {
                    var brewIcon = "assets/images/brewPlaceholder.png"
                }

                // if then to handle undefined description
                if (typeof description != 'undefined') {
                    var description = (response.data[i].brewery.description)
                }
                else {
                    var description = "This brewery has no available description"
                }

                // if then to handle undefined street address
                if (typeof stAddress != 'undefined') {
                    var stAddress = (response.data[i].streetAddress)
                }
                else {
                    var stAddress = "Check Website for Address"
                }



                //Append search results to the empty search div
                $('#breweryCard').append(`
                        <div id="card-${breweryId}" class="uk-card uk-card-default uk-width-1-1">
                            <div class="uk-card-header">
                                <div class="uk-grid-small uk-flex-middle" uk-grid>
                                    <div class="uk-width">
                                        <img class="uk-border-circle uk-align-center" id="brewImage" src="${brewIcon}">
                                    </div>
                                </div>
                            </div>
                        <div class="uk-card-body">
                        <div class="uk-width">
                                        <h3 class="uk-margin-remove-bottom" style="font-family: 'Amatic SC', cursive; font-size:3.0em; text-align: center; font-weight: bold;">${breweryName}</h3>
                                    </div>
                            <p style="font-family: 'Amatic SC'; font-size:1.8em; text-decoration: underline; margin-bottom: -10px; font-weight: bold;">Description<p>
                                <p style="font-family: 'Oswald', sans-serif; font-size:1.2em; font-weight: lighter;">${description}</p>
                        </div>
                        <div class="uk-card-footer">
                        <span style="font-family: 'Amatic SC', cursive; font-size:2.0em;">
                        <a href=${website} target="_blank" class="uk-button uk-button-text" style="font-family: 'Amatic SC', cursive; font-size:1.0em;">Website</a><span>
                        <p class="uk-float-right">Address: ${stAddress}</p>
                            </div>
                        </div>
                        </div>
                        <br>
                        <br>
                        `)
            }

            // Initialize map with latLngArray data
            initMap(latLngArray)

        }

        //Error Log
    }).catch(function (err) {
        console.log(err)
    })


    // Create Map Function
    function initMap(beerMap) {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: beerMap[0]
        })

        for (i = 0; i < beerMap.length; i++) {
            var position = beerMap[i]
            var breweryId = breweryIdArray[i]
            var marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: position,
                map: map,
                title: locNameArray[i],
                label: alphabet[i],
            })

            // On Marker Click Event
            google.maps.event.addListener(marker, 'click', function (e) {

                var lat = e.latLng.lat();
                var lng = e.latLng.lng();

                var breweryIndex = 0

                // Reverse lookup comparing each element in latLngArray to lat lng values of the map marker the user clicked
                for (var i = 0; i < latLngArray.length; i++) {
                    var arrLat = latLngArray[i].lat;
                    var arrLng = latLngArray[i].lng;
                    //Math.round is rounding to the 3rd decimal place
                    if (Math.round(arrLat * 1000) / 1000 === Math.round(lat * 1000) / 1000
                        && Math.round(arrLng * 1000) / 1000 === Math.round(lng * 1000) / 1000) {
                        breweryIndex = i;//assign brewery index a value of index i
                        break;
                    }
                }

                var scrollBreweryId = breweryIdArray[breweryIndex];

                var scroll = $("#card-" + scrollBreweryId).offset().top;

                $('html, body').animate({
                    scrollTop: scroll
                }, 300)
            })
        }

        // show a button that allows the user to return to the top of the page
        window.onscroll = function () { scrollFunction() };

        function scrollFunction() {
            if (document.body.scrollTop > 850 || document.documentElement.scrollTop > 850) {
                document.getElementById("returnToTop").style.display = "block";
            } else {
                document.getElementById("returnToTop").style.display = "none";
            }
        }

        // When the user clicks on the return button, scroll to the top of the document
        $("#returnToTop").on("click", function () {
            $('html, body').animate({
                scrollTop: ($('#searchBar').offset().top)
            }, 500)

        })

    }

})
