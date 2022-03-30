const api = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    base: "https://api.openweathermap.org/data/2.5/"
}

var FavouriteLocals = ['Melbourne', 'New york', 'London', 'Cape Town', 'Tokyo', 'Rio de Janeiro', 'Cairo', 'Bangkok']
var tst;
var mapProperities =
{
    lng: 0,
    lat: 0,
    location: "",
    temp: 0,
    wind: "",
    dirrection: "",
    description: ""
}

FavouriteLocals.forEach(element => {
    $('.Favourites').append(`
    <button class="FavBtn" value="${element}">${element}</button>
`)
})


function addFavourite(location){
    if(FavouriteLocals.find(element => {
        return element.toLowerCase() === location.toLowerCase();
    })){
        $('.error').text(`${location} already in favourities`);
        window.setTimeout(() => {
            $('.error').text(``);
        }, 3000)
    }else{
        FavouriteLocals.splice(0, 0, location);
        FavouriteLocals.splice((FavouriteLocals.length-1), 1)
        $('.Favourites').html('');
        FavouriteLocals.forEach(element => {
            $('.Favourites').append(`
            <button>${element}</button>
        `)
        })
    }
    
}

function weatherToIcon(weather){
    let icon;
    switch(weather){
        case "broken clouds":
            icon =`<i class="fa-solid fa-cloud-sun fa-2xl"></i>`;
            break;
        case "clear skys":
            icon = `<i class="fa-solid fa-sun fa-2xl"></i>`;
            break;
        case "light rain":
            icon = `<i class="fa-solid fa-cloud-sun-rain fa-2xl"></i>`;
            break;
        case "rain and snow":
            icon = `<i class="fa-solid fa-cloud-sleet fa-2xl"></i>`;
            break;
        case "scattered clouds":
            icon = `<i class="fa-solid fa-sun-cloud fa-2xl"></i>`;
            break;
        case "moderate rain":
            icon = `<i class="fa-solid fa-cloud-showers-heavy fa-2xl"></i>`;
            break;
        case "overcast clouds":
            icon = `<i class="fa-solid fa-clouds fa-2xl"></i>`;
            break;
        case "light snow":
            icon = `<i class="fa-solid fa-snowflake fa-2xl"></i>`;
            break;
        case "snow":
            icon = `<i class="fa-solid fa-cloud-snow fa-2xl"></i>`;
            break;
        case "heavy intensity rain":
            icon = `<i class="fa-solid fa-cloud-showers-water fa-2xl"></i>`
            break;
        default:
            icon = `<i class="fa-solid fa-cloud-rainbow fa-2xl"></i>`;
            break;
    }
    return icon;
}


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

async function apiRequest(location){
    $('.forecastCard').html('');
    var lat, lon;
    await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(result =>{ 
            console.log(result)
            mapProperities.location = result.name + ", " + result.sys.country;
            mapProperities.temp = result.main.temp + "°";
            mapProperities.wind = result.wind.speed + " Km/h";
            mapProperities.dirrection = degToCardinal(result.wind.deg);
            mapProperities.description = result.weather[0].description;
            mapProperities.lat = result.coord.lat;
            mapProperities.lng = result.coord.lon;
        })
        .catch(err => console.log(err));
    await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${mapProperities.lat}&lon=${mapProperities.lng}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(result =>{
        tst = result;
        console.log(result);
        }).catch(err => console.log(err));

    $('.locationCard').html(
        `
            <h2>${mapProperities.location}</h2>
            <p>Temperature: ${mapProperities.temp}</p>
            <p>Wind: ${mapProperities.wind} ${mapProperities.dirrection}</p>
            <p>${mapProperities.description}</p>
        `
    );

    var count = 0;
    tst.daily.forEach(element => {
        if(count < 5){
        console.log(element)
        
        $('.forecastCard').append(
            `
                <div class="forecastDay">
                    <h3>${moment.unix(element.dt).format("dddd DD  MMMM")}</h3>
                    <p class="weatherIcon">${weatherToIcon(element.weather[0].description)}</p>
                    <p>Minimum Temp: ${element.temp.min}°</p>
                    <p>Maximum Temp: ${element.temp.max}°</p>
                    <p>Wind: ${element.wind_speed}km/h ${degToCardinal(element.wind_deg)}</p>
                    <p>humidity ${element.humidity}%</p>
                </div>
            `
            )
        }
        console.log(weatherToIcon(element.weather[0].description));
        count++;
    })
}

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