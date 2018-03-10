
// Global Variables
var userInput = "irvine,ca"
var cityInput
var idArray = []
var latLngArray = []

// // On submit button click
// $("#").on("click", function () {
//     // Store user input as variable
//     userInput = $("#").val().trim().toString()
//     // Request for ID array

// 


$.ajax({
    url: "https://crossorigin.me/http://api.brewerydb.com/v2/locations?key=0cb4a8ec09ac574eca1569f7b038857d&locality=san%20clemente&region=california",
    method: "GET"
}).then(function (response) {

    for (i = 0; i < response.data.length; i++) {
        var lat = response.data[i].latitude
        var lng = response.data[i].longitude
        var latLngObj = { lat: lat, lng: lng }

        latLngArray.push(latLngObj)

    }

    initMap(latLngArray)

}).catch(function(err){
    console.log(err)
})


function initMap(beerMap) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 33.4517901, lng: -117.6069427}
    })

    for (i = 0; i < beerMap.length; i++) {
        var position = beerMap[i]
        var marker = new google.maps.Marker({
            position: position,
            map: map
        })
        console.log(beerMap[i])
    }
}
