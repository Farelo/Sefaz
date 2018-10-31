const getDistanceFromLatLonInKm = require('../../common/get_distance_from_lat_lng_in_km')

/**
 *
 * @param {Object} lastDeviceData Objeto seguindo o schema criado para embalagens
 * @param {Object} controlPoints Objeto seguindo o schema criado para controlPointas
 * @param {Object} setting Objeto seguindo o schema criado para Configurações
 */
module.exports = (lastDeviceData, controlPoints, setting) => {
    let distance = Infinity
    let currentControlPoint = {}

    controlPoints.forEach((controlPoint) => {
        const calculate = getDistanceFromLatLonInKm(
            lastDeviceData.latitude,
            lastDeviceData.longitude,
            controlPoint.lat,
            controlPoint.lng,
        )
        if (calculate < distance) {
            distance = calculate
            currentControlPoint = controlPoint
        }
    })

    if (distance > setting.range_radius) return null

    return currentControlPoint
}
