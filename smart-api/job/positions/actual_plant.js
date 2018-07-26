module.exports = (packing, plants, settings) => {
  let distance = Infinity
  let actual_plant = {}

  plants.forEach(plant => {
    let calculate = getDistanceFromLatLonInKm(packing.position.latitude, packing.position.longitude, plant.lat, plant.lng)
    if (calculate < distance) {
      distance = calculate
      actual_plant = plant
    }
  })

  if (distance > settings.range_radius) {
    return null
  } else {
    return actual_plant
  }
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  let R = 6371 // Radius of the earth in km
  let dLat = deg2rad(lat2-lat1)  // deg2rad below
  let dLon = deg2rad(lon2-lon1)
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  let d = R * c // Distance in km

  return d
}

const deg2rad = (deg) => {
  return deg * (Math.PI/180)
}
