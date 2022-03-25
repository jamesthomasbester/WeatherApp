const api = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    base: "https://api.openweathermap.org/data/2.5/"
}

var mapProperities =
{
    lng: 144.9631,
    lat: -37.8182,
    zoom: 11,
    location: "",
    temp: 0,
    wind: "",
    dirrection: "",
    description: ""
}

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNiZXN0ZXIiLCJhIjoiY2t1NmhnMTlkNWFtbDJ2bzJvaDV2MHN1MiJ9.Puw8sJNEnDYvULGp0odUhQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [144.9631, -37.818], // starting position [lng, lat]
zoom: 11 // starting zoom
});

map.on('load', () => {
    
})

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
    var img = "";
    const options = {
        method: 'GET',
        headers: {
            'X-User-Agent': 'desktop',
            'X-Proxy-Location': 'EU',
            'X-RapidAPI-Host': 'google-search3.p.rapidapi.com',
            'X-RapidAPI-Key': '32b02794cbmsh72da06d86753b95p1dab23jsnd1ca9c7aceae'
        }
    };
        await fetch('https://google-search3.p.rapidapi.com/api/v1/images/q=melbourne', options)
        .then(response => response.json())
        .then(result => {
            console.log(result.image_results[0].image.src);
            img = result.image_results[0].image.src;
        })
        .catch(err => console.error(err))
        .then(
           fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
            .then(response => response.json())
            .then(result =>{ 
                mapProperities.location = result.name + ", " + result.sys.country;
                mapProperities.temp = result.main.temp + "°";
                mapProperities.wind = result.wind.speed + " Km/h";
                mapProperities.dirrection = degToCardinal(result.wind.deg);
                mapProperities.description = result.weather[0].description;
            }).then(    
                $('#locationCard').html(`
                <img class="locationImg" src=""/>
                <div class="locationTitle">
                <h3>${mapProperities.location}</h3>
                <br><p id="coords"> ${mapProperities.lng}, ${mapProperities.lat}</p>
                </div>
                <div class="locationWeather">
                <h4>Weather</h4>
                <p> ${mapProperities.temp}, ${mapProperities.description}<p>
                <p> ${mapProperities.wind}  ${mapProperities.dirrection}<p>
                </div>
                <div class="locationDetails">
                <h4>Population</h4> <p>1,000,000<p>
                <h4>Current Events</h4> <p>Night Market<p>
                </div>
                `)
                ),
    )
    
    
}

window.addEventListener("keypress", function(e) {
    if (e.key == 'Enter'){
        apiRequest($('#inputRequest').val());
    }
})