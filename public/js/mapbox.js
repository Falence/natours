const locations = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations)

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFsZW5jZWxlbXVuZ29oIiwiYSI6ImNrc2YzZmxjczExZTgydXAyanFnamduaGoifQ.mxZorn1qj_6Zg_ztGpQfDw'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/falencelemungoh/cksf46kr44urf19muqjjf7nzj',
    scrollZoom: false   
    // center: [-118.113491, 34.111745],    // longitude and latitude
    // zoom: 9,
    // interactive: false
})
// map.scrollZoom.disable()

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    // create marker element
    const el = document.createElement('div')
    el.className = 'marker'

    // add marker to map
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map)

    // add popup to marker
    new mapboxgl.Popup()
        .setLngLat(loc.coordinates)
        .setOffset(40)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)

    // extend map bounds to include current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
})