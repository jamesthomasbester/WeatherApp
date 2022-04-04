//setting global varriables 
const api = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    base: "https://api.openweathermap.org/data/2.5/"
}
var FavouriteLocals = ['Sydney', 'New york', 'London', 'Cape Town', 'Tokyo', 'Rio de Janeiro', 'Cairo', 'Bangkok']
var currentData;
var loop = 0;
var historyData;
var xValues = [];
var yValues = [];
var WeatherChart;
const ctx = document.getElementById('myChart').getContext('2d');

/*
    getting and setting the localstoraged cached data, i initially set the 'Favourites' to the FavouriteLocals array,
    then let the user add locations to the array.
*/
function cacheFavourites(){
    if(localStorage.getItem('Favourites')){
        FavouriteLocals = JSON.parse(localStorage.getItem('Favourites'));
    
    }else{
        localStorage.setItem('Favourites', JSON.stringify(FavouriteLocals));
    }
}


//creating the favourite locations buttons based predefined locations if there are none in localstorage
function createFavouritesection(){
    $('.Favourites').html('<h2>Favourite Locations</h2>');
    FavouriteLocals.forEach(element => {
        $('.Favourites').append(`
        <button class="FavBtn" value="${element}">${element}</button>
    `)
    })
    $('.FavBtn').click(function(e){
        apiRequest(e.target.value);
    })
}

 //   adding the location in the search bar to favourite locations,

function addFavourite(location){
    //checking if the location is already in favourite locations and displaying an error if it is
    if(FavouriteLocals.find(element => {
        return element.toLowerCase() === location.toLowerCase();
    })){
        $('.error').text(`${location} already in favourities`);
        window.setTimeout(() => {
            $('.error').text(``);
        }, 3000)
        //altering the favourite locations list by removing the last item and inserting in the new item at the first position
    }else{
        FavouriteLocals.splice(0, 0, location);
        FavouriteLocals.splice((FavouriteLocals.length-1), 1)
        localStorage.setItem('Favourites', JSON.stringify(FavouriteLocals));
        createFavouritesection();
    }
    
}

//creating a chart using chart.js, mapping data from openweather api
function CreateChart(){
    WeatherChart = new window.Chart(myChart,{
        type: "line",
        data: 
        {
            labels: xValues,
            datasets: 
            [{
                borderColor: "#fff",
                data: yValues,
                pointRadius: 6
            }]
        },
        options: 
        {   
            scales: {
                
                yAxes: [{
                    ticks: 
                    {
                        fontColor: "white",
                        fontSize: 18,
                        stepSize: 1,
                    },
                    scaleLabel: {
                        fontColor: "white",
                        display: true,
                        labelString: "Temperature (C°)"
                      }
                }],
                xAxes: [{
                    ticks: 
                    {
                        fontColor: "white",
                        fontSize: 14,
                        stepSize: 1,
                    }
                }],

            },
            title: {
                display: false,
            },
            legend: {
                display: false
            }
        }
    });
}

//function that converts the weather description into fontawesome icons using switch statement for easier to read/edit
function weatherToIcon(weather){
    let icon;
    switch(weather){
        case "broken clouds":
            icon =`<i class="fa-solid fa-cloud-sun fa-2xl"></i>`;
            break;
        case "clear sky":
            icon = `<i class="fa-solid fa-sun fa-2xl"></i>`;
            break;
        case "light rain":
            icon = `<i class="fa-solid fa-cloud-sun-rain fa-2xl"></i>`;
            break;
        case "rain and snow":
            icon = `<i class="fa-regular fa-snowflake fa-2xl"></i>`;
            break;
        case "scattered clouds":
            icon = `<i class="fa-solid fa-cloud-sun fa-2xl"></i>`;
            break;
        case "moderate rain":
            icon = `<i class="fa-solid fa-cloud-rain fa-2xl"></i>`;
            break;
        case "overcast clouds":
            icon = `<i class="fa-solid fa-cloud-sun fa-2xl"></i>`;
            break;
        case "light snow":
            icon = `<i class="fa-solid fa-snowflake fa-2xl"></i>`;
            break;
        case "snow":
            icon = `<i class="fa-solid fa-snowflake fa-2xl"></i>`;
            break;
        case "heavy intensity rain":
            icon = `<i class="fa-solid fa-cloud-showers-water fa-2xl"></i>`
            break;
        case "few clouds":
            icon = `<i class="fa-solid fa-cloud fa-2xl"></i>`
            break;
        default:
            icon = `<i class="fa-solid fa-cloud-meatball fa-2xl"></i>`;
            break;
    }
    return icon;
}

//function to convert the degrees that the api returns into cardinal directions
function degToCardinal(deg){
    let cardinal;
    if(deg <= 22.5 || deg >= 338.5){
        cardinal = "N"
    }else if(deg <= 67.5){
        cardinal = "NE"
    }else if(deg <= 112.5){
        cardinal = "E"
    }else if(deg <= 157.5){
        cardinal = "SE"
    }else if(deg <= 202.5){
        cardinal = "S"
    }else if(deg <= 247.5){
        cardinal = "SW"
    }else if(deg <= 292.5){
        cardinal = "W"
    }else if(deg <= 337.5){
        cardinal = "NW"
    }
    return cardinal;
}

//the main function of the script, where the api calls are made and the elements are mapped to the html accordanly
async function apiRequest(location){
    //2 api calls the first get current weather data, the second get historical data and uses the coordinates from the first api call
    $('.forecastCard').html('');
    await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(result =>{ 
            if(result.cod != 200){
                //simple check whether api responds with 200 'ok', if no 200 displays an error message
                $('.error').text(`cannot find location`);
                window.setTimeout(() => {
                    $('.error').text(``);
                }, 3000)
            }else{
                currentData = result;
            }
        })
        .catch(err => console.log(err));
    await fetch(`${api.base}onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(result =>{
        historyData = result;
        window.location.href = "#currentWeather"
        }).catch(err => console.log(err));

    $('.locationLeft').html(
        `
            <h2>${currentData.name}, ${currentData.sys.country}</h2>
            ${weatherToIcon(currentData.weather[0].description)}
            <p class="current">${currentData.main.temp}°</p>
            <p>${currentData.weather[0].description}</p>
            <p>Wind: ${currentData.wind.speed}Km/h ${degToCardinal(currentData.wind.deg)}</p>
            <p>Humidity: ${historyData.current.humidity}%</p>
        `
    );

    //reseting the chart data to an empty list (these arrays are for saving data to the chart)
    xValues = [];
    yValues = [];

    //pushing data into the chart arrays X for date and Y for temperature values
    historyData.hourly.forEach(element => {
        xValues.push(moment.unix(element.dt).format("h a, dddd"));
        yValues.push(element.temp);
    })

    /*
        checking whether this is the first time the code has been run, 
        so that the script doesn't create a new chart unnecessarily.
        if the script has run before i just update the data of the chart. 
    */
    if(loop > 0){
        WeatherChart.data.datasets[0].data = yValues;
        WeatherChart.update()
    }else{
        CreateChart();
    }
    //clearing the forecast section
    $('.forecastCard').html('');
    //mapping a daily weather summary for each object in historydata
    historyData.daily.forEach(element => {
    $('.forecastCard').append(
        `
            <div class="forecastDay">
                <h3>${moment.unix(element.dt).format("dddd DD  MMMM")}</h3>
                ${weatherToIcon(element.weather[0].description)}
                <p>Minimum Temp: ${element.temp.min}°</p>
                <p>Maximum Temp: ${element.temp.max}°</p>
                <p>Wind: ${element.wind_speed}km/h ${degToCardinal(element.wind_deg)}</p>
                <p>humidity ${element.humidity}%</p>
            </div>
        `
        )
    }) 
    loop++;
}

//onload function calls
apiRequest(FavouriteLocals[0]);
cacheFavourites();
createFavouritesection();

//eventlisteners & jquery event handlers
$('.addbtn').click(function(e){
    addFavourite($('#inputRequest').val())
})

$('.searchbtn').click(function(e) {
     e.preventDefault()
     apiRequest($('#inputRequest').val())
})

$('.FavBtn').click(function(e){
    apiRequest(e.target.value);
})

window.addEventListener("keypress", function(e) {
    if (e.key == 'Enter'){
        e.preventDefault();
        apiRequest($('#inputRequest').val());
    }
})

