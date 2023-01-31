let openWeatherUrl = 'https://api.openweathermap.org/';
let apiKey = 'f0d5b36ac524cd99787b1fffeaf83c0d';
let damnThing = '';
let searchHistory = localStorage.getItem("search-history") ? JSON.parse(localStorage.getItem("search-history")) : [];


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
let weatherFetched = "";
let dayTime = '';
let forecastFiveGlobe = [];
let tomorrow = '';
let weatherIcon = "http://openweathermap.org/img/wn/";

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
        resultsBox.innerHTML += `
        <div class="result-details row" data-bs-toggle="modal" data-bs-target="#searchModal" data-backdrop="static">
            
            <div class="city primary col-12 text-center" id="${i}"><span class="float-start">></span>  ${searched[i]['name']}, ${searched[i]['state']}, ${searched[i]['country']}</div>
        </div>`;
    };
};

function init() {
    renderHistory();
}

init();

function renderHistory() {
    let add = '';
    // console.log(searchHistory.length);
    if(weatherFetched) {
        let weatherArray = {"name": weatherFetched.name,"lat": weatherFetched.lat,"lon": weatherFetched.lon};
        if (searchHistory.length == 0) {
            searchHistory.push(weatherArray);
            localStorage.setItem("search-history", JSON.stringify(searchHistory));
        } else {
            for (i = 0; i < searchHistory.length; i++) {
                if (JSON.stringify(weatherArray) == JSON.stringify(searchHistory[i])) {
                    add = false;
                    break;
                } else {
                    console.log("Works!")
                    add = true;
                };
            };
            if(add) {
                searchHistory.push(weatherArray);
                localStorage.setItem("search-history", JSON.stringify(searchHistory));
            } else { 
                return;
            };
            
        }
    }
    if(searchHistory.length > null) {
    historyBox.innerHTML = "";
    for (i = 0; i < searchHistory.length; i++) {
        if(searchHistory[i]['name']) {
                historyBox.innerHTML += `
                <div class="history-select row col-12">
                <div class="primary text-center col-12" id="${i}"><span class="float-start">></span>${searchHistory[i]['name']}</div>
                </div>`
        }
    }
    }
}


historyBox.addEventListener('click', function(event) {
    console.log("running!");
    weatherFetched = searchHistory[event.target.id];
    document.getElementById("main-block").setAttribute("style", "visibility: visible");
    renderHistory();
    weatherFetch();
    });

resultsBox.addEventListener('click', function(event) {
    weatherFetched = searched[event.target.id];
    resultsBox.innerHTML = undefined;
    document.getElementById("main-block").setAttribute("style", "visibility: visible");
    weatherFetch();
    renderHistory();
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
    let skiesNow = weathersNow['weather'][0]['description'];
    let skiesIcon = weatherIcon + weathersNow['weather'][0]['icon'].slice(0, -1) + "d@2x.png";
    let feelsLike = (weathersNow['main']['feels_like'] - 273.15).toFixed(1);
    let windSpeed = (weathersNow['wind']['speed'] * 3.6).toFixed(1);
    let humidNow = (weathersNow['main']['humidity']);

    document.querySelector('#current-temp').innerHTML = `
    <div class="row">
        <div id="current-city col-5"><h5>${city}</h5></div>
        </div>
    <div class="row" id="stats">
        <div id="climate" class="col-2"><img src=${skiesIcon}><div id="skies-now">${skiesNow}</div></div>
        <div class="row col-10">
            <div id="now-temp" class="row col-lg-3 col-sm-6 col-xs-6 align-middle"><span class="temp-header">Current Temp</span> <span id="now-tempra" class="align-middle">${nowTemp}°C</span></div>
            <div id="winds" class="row col-lg-3 col-sm-6 col-xs-6 align-middle"><span class="temp-header">Wind Speed</span><span id="wind-speed">${windSpeed}km/h</span></div>
            <div id="feels-temp" class="row col-lg-3 col-sm-6 col-xs-6 align-middle"><span class="temp-header">Feels like</span><span id="feels-like">${feelsLike}°C</span></div>
            <div id="humid" class="row col-lg-2 col-sm-6 col-xs-6 align-middle"><span class="temp-header">Humidity</span><span id="humid-now">${humidNow}</span></div>
        </div>
    </div>`;

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
        forecastTemp = (forecastFive[i]['main']['temp'] - 273.15).toFixed(1);
        forecastSkies = forecastFive[i]['weather'][0]['description'];
        forecastWind = (forecastFive[i]['wind']['speed'] * 3.6).toFixed(1);
        forecastFeels = (forecastFive[i]['main']['feels_like'] - 273.15).toFixed(1);
        forecastHumidity = forecastFive[i]['main']['humidity'];
        futureIcon = weatherIcon + forecastFive[i]['weather'][0]['icon'].slice(0, -1) + "n@2x.png";
        document.querySelector('#future-temp').innerHTML += `
        <div class="forecastBox card mx-1 col-lg col-md-3 col-sm-12">
                <div class="card-body">
                    <div class="future-date card-title">${forecastDate}</div>
                    <div class="future-skies col-12"><img src=${futureIcon}>
                        <div>${forecastSkies}
                        </div>
                    </div>
                    <div class="temp-box my-2 g-3">
                        <div class="future-temp row">
                            <div class="forecast-header col-sm-6 col-md-12">Temp
                            </div>
                            <div class="forecast-text col-sm-6 col-md-12">${forecastTemp}°C
                            </div>
                        </div>
                        <div class="future-wind row">
                            <div class="forecast-header col-sm-6 col-md-12">Wind
                            </div>
                            <div class="forecast-text col-sm-6 col-md-12">${forecastWind}km/h
                            </div>
                        </div>
                        <div class="future-feels row">
                            <div class="forecast-header col-sm-6 col-md-12">Feels like
                            </div>
                            <div class="forecast-text col-sm-6 col-md-12">${forecastFeels}°C
                            </div>
                        </div>
                        <div class="future-humidity row">
                            <div class="forecast-header col-sm-6 col-md">Humidity
                            </div>
                            <div class="forecast-text col-sm-6 col-md">${forecastHumidity}%
                            </div>
                        </div>
                    </div>
                    
                </div>
        </div>`
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
});
