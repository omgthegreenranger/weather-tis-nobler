let openWeatherUrl = 'https://api.openweathermap.org/';
let apiKey = 'f0d5b36ac524cd99787b1fffeaf83c0d';
let damnThing = '';
let searchHistory = localStorage.search-history ? JSON.parse(localStorage.seach-history) : [];


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
let dayTime = '';
let forecastFiveGlobe = [];
let tomorrow = '';


// Geocoding variables
let geoUrl = "geo/1.0/direct?";
let geoCity = "";
let geoLimit = 5;
let geoFetchUrl = "";
let searched = "";

// Page variables
let searchBtn = document.querySelector('#city-submit');
let searchField = document.querySelector('#city-name');
let currentTemp = document.querySelector('#current-temperature');
let futureTemp = document.querySelector('#future-temp');
let resultsBox = document.querySelector('#results-box');
let historyBox = document.querySelector('#history');
let resultChoice = "";

function geoFetch (geoCity) {
    geoFetchUrl = openWeatherUrl + geoUrl + "q=" + geoCity + "&limit=" + geoLimit + "&appid=" + apiKey
    fetch(geoFetchUrl, {cache: "no-store"})
    .then((response) => response.json())
    .then((data) => modalDisplay(data))}

function modalDisplay(data) {
    searched = data;
    for (let i = 0; i < searched.length; i++) {
        resultsBox.innerHTML += `<div class="result-details row" data-bs-toggle="modal" data-bs-target="#searchModal" data-backdrop="static">
        <div class="city primary col-11 text-center" id="${i}">${searched[i]['name']}, ${searched[i]['state']}, ${searched[i]['country']}</div><div class="city secondary col-1" data-bs-dismiss="modal" aria-label="Close"><</div></div>`;
    };
};

function init() {
    renderHistory();
}

init();

function renderHistory() {
    let weatherArray = {"name": weatherFetched.name,"lat": weatherFetched.lat,"lon": weatherFetched.lon}
    if (weatherArray.name) {
    searchHistory.push(weatherArray)};
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    historyBox.innerHTML = "";
    for (i = 0; i < searchHistory.length; i++) {
        if(searchHistory[i]['name']) {
                historyBox.innerHTML += `<div class="history-select row"><div class="primary text-center col-11" id="${i}">${searchHistory[i]['name']}</div><div class="secondary col-1"><</div></div>`
        }
        
    }
    historyBox.addEventListener('click', function(event) {
        console.log("running!");
        weatherFetched = searchHistory[event.target.id];
        renderHistory();
        weatherFetch();
        })
}


resultsBox.addEventListener('click', function(event) {
    weatherFetched = searched[event.target.id];
    resultsBox.innerHTML = undefined;
    renderHistory();
    weatherFetch();
    });

function weatherFetch () {
    weatherLat = weatherFetched.lat;
    weatherLon = weatherFetched.lon;
    weatherFetchUrl = openWeatherUrl + weatherUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
    weatherNowFetchUrl = openWeatherUrl + weatherNowUrl + "lat=" + weatherLat + "&lon=" + weatherLon + "&appid=" + apiKey;
    fetch(weatherNowFetchUrl,{cache: "no-store"})
        .then((response) => response.json())
        .then((data) => deployWeathersNow(data));
    fetch(weatherFetchUrl, {cache: "no-store"})
        .then((response) => response.json())
        .then((data) => deployWeathersToCome(data));
};

function deployWeathersNow(weathersNow) {
    let city = weathersNow['name'];
    let nowTemp = (weathersNow['main']['temp'] - 273.15).toFixed(1);
    let skiesNow = weathersNow['weather'][0]['main'];
    let feelsLike = (weathersNow['main']['feels_like'] - 273.15).toFixed(1);
    document.querySelector('#current-temp').innerHTML = `<div id="current-city">${city}</div>
    <div id="temps"><span id='now-temp'>${nowTemp}</span><span id="feels-like">${feelsLike}</span></div>
    <div id="climate"><span id="skies-now">${skiesNow}</span></div>`
    console.log("Now data!");
    console.log(weathersNow);
};


function deployWeathersToCome(weathersToCome) {
    
    nowTime = dayjs();
    tomorrow = [];
    tomorrow = nowTime.add(1, 'day').set('hour', 10).set('minute', 00).set('second', 00).tz("America/Toronto");
    let fiveDays = [];
    let forecastFive = [];
    for (i = 0; i < 5; i++) {
        fiveDays.push(tomorrow.add([i], 'day'));
    };
    for (i = 0; i < weathersToCome['list'].length; i++) {
        dayTime = dayjs.unix(weathersToCome['list'][i]['dt']).format("MM-DD-YYYY hh:mm A");
        for (j = 0; j < fiveDays.length; j++) {
            if (fiveDays[j].format("MM-DD-YYYY hh:mm A") == dayTime) {
                forecastFive.push(weathersToCome['list'][i]);
            } else {
                console.log("Already did");
            };
        };

    };
    console.log("ForecastFive!");
    console.log(forecastFive);
    document.getElementById('future-temp').innerHTML = "";
    for (i = 0; i < forecastFive.length; i++) {
        forecastDate = dayjs.unix(forecastFive[i]['dt']).format("MMM DD, YYYY");
        forecastTemp = (forecastFive[i]['main']['temp'] - 273.15).toFixed(2);
        forecastSkies = forecastFive[i]['weather'][0]['main'];
        forecastWind = forecastFive[i]['wind']['speed'];
        forecastFeels = (forecastFive[i]['main']['feels_like'] - 273.15).toFixed(2);
        forecastHumidity = forecastFive[i]['main']['humidity'];
        document.querySelector('#future-temp').innerHTML += `<div class="forecastBox col cols-2"><div class="future-date">${forecastDate}</div><div class="future-skies">${forecastSkies}</div><div class="future-temp">${forecastTemp}</div><div class="future-wind">${forecastWind}<span class="future-feels">Feels like ${forecastFeels}</span></div><div class="future-humidity">${forecastHumidity}</div></div>`
    };
    forecastFive = undefined;
};


// Event Variables
searchBtn.addEventListener('click',function (event) {
    searchTerm = event.target.previousElementSibling.value;
    console.log(searchTerm);
    event.target.previousElementSibling.value = "";
    resultsBox.innerHTML = "";
    geoFetch(searchTerm);
    searchTerm = undefined;
});
