module.exports = (packing, plants, settings) => {
    let distance = Infinity
    let current_plant = {}

    plants.forEach(plant => {
        let calculate = getDistanceFromLatLonInKm(packing.position.latitude, packing.position.longitude, plant.lat, plant.lng)
        if (calculate < distance) {
            distance = calculate
            current_plant = plant
        }
    })

    if (distance > settings.range_radius) {
        return null
    } else {
        return current_plant
    }
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)  // deg2rad below
    const dLon = deg2rad(lon2 - lon1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    return distance
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}
