const mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNiZXN0ZXIiLCJhIjoiY2t1NmhnMTlkNWFtbDJ2bzJvaDV2MHN1MiJ9.Puw8sJNEnDYvULGp0odUhQ';

const api = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    base: "https://api.openweathermap.org/data/2.5/"
}


const map = new mapboxgl.map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8182],
    zoom: 9
});