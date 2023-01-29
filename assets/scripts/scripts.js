let openWeatherUrl = 'https://api.openweathermap.org/';
let apiKey = 'f0d5b36ac524cd99787b1fffeaf83c0d';
let damnThing = '';

//weather variables
let weatherUrl = 'data/2.5/forecast?'
let weatherLat = '0';
let weatherLon = '0';
let weatherFetchUrl = "";
let weathers = [];
let weatherNowUrl = 'data/2.5/weather?';
let weatherNowFetchUrl = "";
let weathersNow = [];
let weathersToCome = [];
let weatherFetched = [];


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
let currentTemp = document.querySelector('#current-temperature');
let futureTemp = document.querySelector('#future-temp');
let resultsBox = document.querySelector('#results-box');
let resultChoice = "";

function geoFetch (geoCity) {
    geoFetchUrl = openWeatherUrl + geoUrl + "q=" + geoCity + "&limit=" + geoLimit + "&appid=" + apiKey
    fetch(geoFetchUrl)
    .then((response) => response.json())
    .then((data) => 
    modalDisplay(data));
}

function modalDisplay(searched) {
    for (let i = 0; i < searched.length; i++) {
        cityName = searched[i]['name'];
        cityState = searched[i]['state'];
        cityCountry = searched[i]['country'];
        cityCoordLon = searched[i]['lon'];
        cityCoordLat = searched[i]['lat'];
        resultsBox.innerHTML += `<div class="result-details"><ul class="results">
        <li class="city primary">City: ${cityName}</li><li class="city primary">Province: ${cityState}</li><li class="city secondary">Country: ${cityCountry}</li><li class="city secondary">Lattitude: ${cityCoordLat}</li><li class="city second">Longitude: ${cityCoordLon}</li></div>`;
    };

};

function weatherFetch () {
    weatherLat = weatherFetched.parentElement.children[3].outerText.split(": ")[1];
    weatherLon = weatherFetched.parentElement.children[4].outerText.split(": ")[1];
    weatherFetchUrl = openWeatherUrl + weatherUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
    weatherNowFetchUrl = openWeatherUrl + weatherNowUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
    fetch(weatherFetchUrl)
        .then((response) => response.json())
        .then((data) => deployWeathersToCome(data));
    
    fetch(weatherNowFetchUrl)
        .then((response) => response.json())
        .then((data) => deployWeathersNow(data));

}

function deployWeathersNow(weathersNow) {
    let city = weathersNow['name'];
    let nowTemp = weathersNow['main']['temp'];
    let skiesNow = weathersNow['weather'][0]['main'];
    let feelsLike = weathersNow['main']['feels_like'];
    document.querySelector('#current-temp').innerHTML = `<div id="current-city">${city}</div>
    <div id="temps"><span id='now-temp'>${nowTemp}</span><span id="feels-like">${feelsLike}</span></div>
    <div id="climate"><span id="skies-now">${skiesNow}</span></div>`

}

//weathersToCome - pulled from OpenWeatherMap - must be dayjs converted
// tomorrow - today + 1 day
// fiveDays = dayjs five days from tomorrow

let dayTime = '';
let forecastFive = [];
let forecastFiveGlobe = [];
let tomorrow = '';
function deployWeathersToCome(weathersToCome) {
    // dayTime = weathersToCome['list'];

    nowTime = dayjs();
    tomorrow = nowTime.add(1, 'day').set('hour', 10).set('minute', 00).set('second', 00).tz("America/Toronto");
    let fiveDays = [];
    let forecastFive = [];
    for (i = 0; i < 5; i++) {
        fiveDays.push(tomorrow.add([i], 'day'));
    }
    for (i = 0; i < weathersToCome['list'].length; i++) {
        dayTime = dayjs.unix(weathersToCome['list'][i]['dt']).format("MM-DD-YYYY hh:mm A");
        for (j = 0; j < fiveDays.length; j++) {
            if (fiveDays[j].format("MM-DD-YYYY hh:mm A") == dayTime) {
                forecastFive.push(weathersToCome['list'][i]);
            }
        };
    };
    for (i = 0; i < forecastFive.length; i++) {
        console.log(forecastFive);
        forecastDate = dayjs.unix(forecastFive[i]['dt']).format("MMM DD, YYYY");
        forecastTemp = forecastFive[i]['main']['temp'];
        forecastSkies = forecastFive[i]['weather'][0]['main'];
        forecastWind = forecastFive[i]['wind']['speed'];
        forecastFeels = forecastFive[i]['main']['feels_like'];
        forecastHumidity = forecastFive[i]['main']['humidity'];
        document.querySelector('#future-temp').innerHTML += `<div class="forecastBox col cols-2"><div class="future-date">${forecastDate}</div><div class="future-skies">${forecastSkies}</div><div class="future-temp">${forecastTemp}</div><div class="future-wind">${forecastWind}<span class="future-feels">Feels like ${forecastFeels}</span></div><div class="future-humidity">${forecastHumidity}</div></div>`
        // console.log("This works!");
        // console.log(forecastSkies);
    }
};
resultsBox.addEventListener('click', function(event) {
    weatherFetched = event.target;
    resultsBox.innerHTML = "";
    weatherFetch();
})

// Event Variables
searchBtn.addEventListener('click',function () {
    searchTerm = searchField.value;
    resultsBox.innerHTML = "";
    geoFetch(searchTerm);
})


