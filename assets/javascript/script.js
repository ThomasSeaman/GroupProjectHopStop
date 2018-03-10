// Global Variables
var idArray = []
var latLngArray = []
var locNameArray = []
var breweryIdArray = []
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
var labelIndex = 0

// On Submit Button Click
$('#submitBtn').on('click', function () {

    var userCity = $('#formUserCity').val()
    var userState = $('#formUserState').val()

    // ajax request for user input data
    $.ajax({
        url: "https://crossorigin.me/http://api.brewerydb.com/v2/locations?key=0cb4a8ec09ac574eca1569f7b038857d&locality=" + userCity + "&region=" + userState + "",
        method: "GET"
    }).then(function (response) {


        $('html, body').animate({
            scrollTop: ($('#map').offset().top)
        }, 50)

console.log(response.data[0])
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
                var brewIcon = response.data[i].brewery.images.icon
                console.log("found undefined")
            }
            else {
                var brewIcon = "brewPlaceholder.png"

            }

            // var pic = (response.data[i].brewery.images.icon)

            // console.log('image link =' + pic)

            //Append search results to the page - dynamic jquery using string interpolation
            $('#breweryCard').append(`
                        <div class="uk-card uk-card-default uk-width-1-2@m">
                            <div class="uk-card-header">
                                <div class="uk-grid-small uk-flex-middle" uk-grid>
                                    <div class="uk-width-auto">
                                        <img class="uk-border-circle" width="40" height="40" src="${brewIcon}">
                                    </div>
                                    <div class="uk-width-expand">
                                        <h3 id="card-${breweryId}" class="uk-card-title uk-margin-remove-bottom">${alphabet[i]}. ${breweryName}</h3>
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

        

        // Calculation for center of lat/long
        // for (m = 0; m < beerMap.length; m++) {
        //     var latLngHolder = 0
        //     var latLngHolder = latLngHolder + beerMap[m]
        //     console.log(latLngHolder)
        // }

        // Initialize map with latLngArray data
        initMap(latLngArray)

    }).catch(function (err) {
        console.log(err)
    })



// Create Map Function
function initMap(beerMap) {

    console.log(breweryIdArray)

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: beerMap[0]
    })

    for (i = 0; i < beerMap.length; i++) {
        var position = beerMap[i]
        var breweryId = breweryIdArray[i]
        //console.log('breweryIdArray', breweryIdArray);
        //console.log('breweryIdArray[' + i + ']', breweryIdArray[i]);
        // var locationInfowindow = new google.maps.InfoWindow({
        //     content: 'Test content',
        //   })
        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: position,
            map: map,
            title: locNameArray[i],
            label: alphabet[i],
            id: "marker" + i,
            class: "marker",
            breweryId: breweryIdArray[i], // doesn't do anything
        })

        console.log('marker', marker);

        // On Marker Click Event
        google.maps.event.addListener(marker, 'click', function(e) {
            console.log('e', e);
            //console.log(JSON.stringify(e.target));
            // map.setZoom(18);
            // map.setCenter(marker.getPosition())
            // var markerPosition = marker.getPosition()
            console.log('lat', e.latLng.lat());
            console.log('lng', e.latLng.lng());
            console.log('latLngArray', latLngArray);

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
                    console.log('matched on index', i);
                    breweryIndex = i;//assign brewery index a value of index i
                    break;
                }
            }
            
            //onsole.log('marker', marker)
            //console.log('breweryId', marker.breweryId)
            var scrollBreweryId = breweryIdArray[breweryIndex];

            var scroll = $("#card-"+scrollBreweryId).offset().top;
            //console.log('scroll', scroll);

            $('html, body').animate({
                scrollTop: scroll
            }, 300)
        })
    }

}

})



// populate container with test divs
// for (i = 0; i < 20; i++) {
//     $('.container').append('<div class="row" id="row' + i + '">').append('<div class="col-md-12"').append('<p id="p' + i + '">THIS IS TEST MATERIAL # ' + i + '</p>')
// }

// // on test btn click
// $('#testBtn').on('click', function () {
// // // scroll to third row
// $('html, body').animate({
//     scrollTop: ($('#row2').offset().top)
// },500);
// })



$("#testBtn").on('click', function () {
    $('html, body').animate({
        scrollTop: ($('#row3').offset().top)
    }, 300)
})
