// Global Variables
var idArray = []
var latLngArray = []
var locNameArray = []
var breweryIdArray = []
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K','L1','M1','N1','O1','P1','Q1','R1','S1','T1','U1','V1','W1','X1','Y1','Z1']
var labelIndex = 0

//on enter within "formUserState" fire onclick associated with the submitBtn
$("#formUserState").keyup(function(event) {
    if (event.keyCode === 13) {
        $('#submitBtn').click();
    }
});

// On Submit Button Click
$('#submitBtn').on('click', function () {

    // Empty any previous data from brewery card container
    $('#breweryCard').empty()
    $('#map').empty()
    var latLngArray = []
    var latLngArray = []

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

        // move to top of map
        $('html, body').animate({
            scrollTop: ($('#map').offset().top)
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

            //Append search results to the page - dynamic jquery using string interpolation
            $('#breweryCard').append(`
                        <div class="uk-card uk-card-default uk-width-1-1">
                            <div class="uk-card-header">
                                <div class="uk-grid-small uk-flex-middle" uk-grid>
                                    <div class="uk-width-auto">
                                        <img class="uk-border-circle" width="100" height="100" src="${brewIcon}">
                                    </div>
                                    <div class="uk-width-expand">
                                        <h3 id="card-${breweryId}" class="uk-card-title uk-margin-remove-bottom">${breweryName}</h3>
                                    </div>
                                </div>
                            </div>
                        <div class="uk-card-body">
                            <h6>Description<h6>
                                <p>${description}</p>
                        </div>
                        <div class="uk-card-footer">
                            <a href=${website} target="_blank" class="uk-button uk-button-text">Website</a>
                        </div>
                        </div>
                        </div>
                        <br>
                        <br>
                        `)
        }

        // Initialize map with latLngArray data
        initMap(latLngArray)

    }).catch(function (err) {
        console.log(err)
    })

// Create Map Function
function initMap(beerMap) {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
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
        google.maps.event.addListener(marker, 'click', function(e) {

            var lat = e.latLng.lat();
            var lng = e.latLng.lng();

            var breweryIndex;

            // Reverse lookup comparing each element in latLngArray to lat lng values of the map marker the user clicked
            for (var i = 0; i < latLngArray.length; i++) {
                var arrLat = latLngArray[i].lat;
                var arrLng = latLngArray[i].lng;
                //Math.round is rounding to the 3rd decimal place
                if (Math.round(arrLat * 1000) / 1000 === Math.round(lat * 1000) / 1000
                    && Math.round(arrLng * 1000) / 1000 === Math.round(lng * 1000) / 1000) {
                    // console.log('matched on index', i);
                    breweryIndex = i;//assign brewery index a value of index i
                    break;
                }
            }
            
            var scrollBreweryId = breweryIdArray[breweryIndex];

            var scroll = $("#card-"+scrollBreweryId).offset().top;

            $('html, body').animate({
                scrollTop: scroll
            }, 300)
        })
    }

}

})