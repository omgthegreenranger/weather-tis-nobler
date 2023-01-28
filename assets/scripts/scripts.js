let openWeatherUrl = 'https://api.openweathermap.org/';
let apiKey = 'f0d5b36ac524cd99787b1fffeaf83c0d';
let damnThing = '';

//weather variables
let weatherUrl = 'data/2.5/forecast?'
let weatherLat = '0';
let weatherLon = '0';
let weatherFetchUrl = "";

// Geocoding variables
let geoUrl = "geo/1.0/direct?";
let geoCity = "";
let geoLimit = 5;
let geoFetchUrl = "";
let cityName = "";
let cityState = "";
let cityCountry = "";
let cityCoordLon = '';
let cityCoordLat = '';
let searched = [];

// Page variables
let searchBtn = document.querySelector('#city-submit');
let searchField = document.querySelector('#city-name');
let resultsBox = document.querySelector('#results-box');
let resultChoice = "";

// function weatherFetch (event) {
//     console.log("works!");
//     lat = event.target.parentElement.children[4].outerText.split(": ")[1];
//     lon = event.target.parentElement.children[3].outerText.split(": ")[1];
//     weatherFetchUrl = openWeatherUrl + weatherUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
//     console.log(weatherFetchUrl);
//     fetch(weatherFetchUrl)
//         .then((response) => response.json())
//         .then((data) => console.log(data));
//     // console.log(weatherFetchUrl);
// }

function geoFetch (geoCity) {
    geoFetchUrl = openWeatherUrl + geoUrl + "q=" + geoCity + "&limit=" + geoLimit + "&appid=" + apiKey
    fetch(geoFetchUrl)
    .then((response) => response.json())
    .then((data) => 
    modalDisplay(data));
}

function modalDisplay(searched) {
    // $('#searchModal').on('shown.bs.modal', function () {
    //     $('#city-submit').trigger('focus')
    for (let i = 0; i < searched.length; i++) {
        cityName = searched[i]['name'];
        cityState = searched[i]['state'];
        cityCountry = searched[i]['country'];
        cityCoordLon = searched[i]['lon'];
        cityCoordLat = searched[i]['lat'];
        resultsBox.innerHTML += `<div class="result-details"><ul class="results">
        <li class="city primary">City: ${cityName}</li><li class="city primary">Province: ${cityState}</li><li class="city secondary">Country: ${cityCountry}</li><li class="city secondary">Lattitude: ${cityCoordLat}</li><li class="city second">Longitude: ${cityCoordLon}</li></div>`;
    };
    
    resultsBox.addEventListener('click', function weatherFetch (event) {
        console.log("works!");
        weatherLat = event.target.parentElement.children[3].outerText.split(": ")[1];
        weatherLon = event.target.parentElement.children[4].outerText.split(": ")[1];
        weatherFetchUrl = openWeatherUrl + weatherUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
        console.log(weatherFetchUrl);
        fetch(weatherFetchUrl)
            .then((response) => response.json())
            .then((data) => console.log(data));
    })
    };


// Event Variables
searchBtn.addEventListener('click',function () {
    searchTerm = searchField.value;
    resultsBox.innerHTML = "";
    geoFetch(searchTerm);
})




