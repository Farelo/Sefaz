const debug = require('debug')('job:evaluators:evaluates_current_department')
const schemas = require("../../api/schemas/require_schemas")


module.exports = async (packing, plant) => {
    try {
        const departments = await schemas.department.find({ plant: plant._id })
        const response = getNearDepartment(packing, departments)
    
        debug(response)
    
        return response
    } catch (error) {
        debug('Something failed when evaluates a current department')
        throw new Error(error)
    }
}

const getNearDepartment = (packing, departments) => {
    let distance = Infinity
    let current_department = {}

    departments.forEach(department => {
        let calculate = getDistanceFromLatLonInKm(packing.position.latitude, packing.position.longitude, department.lat, department.lng)
        if (calculate < distance) {
            distance = calculate
            current_department = department
        }
    })

    return current_department
}


const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    let R = 6371 // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1)  // deg2rad below
    let dLon = deg2rad(lon2 - lon1)
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let distance = R * c // Distance in km

    return distance
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}
