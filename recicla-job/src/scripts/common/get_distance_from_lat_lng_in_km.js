/**
 * Calcula o grau entre a latitude e longitude
 * @param {Number} deg grau
 */
const deg2rad = deg => deg * (Math.PI / 180)

/**
 * Calcula a distancia geodesica entre dois pontos de latitude e
 * longitude
 * @param {Number} lat1 Latitude 1
 * @param {Number} lon1 Longitude 1
 * @param {Number} lat2 Latitude 2
 * @param {Number} lon2 Longitude 2
 */
module.exports = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km

  return distance
}

// module.exports = {
//   getDistanceFromLatLonInKm,
// }
