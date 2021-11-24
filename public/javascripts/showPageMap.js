mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: restaurante.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(restaurante.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset:25 })
        .setHTML(
            `<h3>${restaurante.title}</h3><p>${restaurante.location}</p>`
        )
    )
    .addTo(map)
    map.addControl(new mapboxgl.NavigationControl());