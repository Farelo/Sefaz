const getDistanceFromLatLonInKm = require('../common/get_distance_from_lat_lng_in_km')
const { EventRecord } = require('../../models/event_record.model')

module.exports = async (packing, controlPoints, setting) => {
    try {
        let distance = Infinity
        let currentControlPoint = {}
        let range_radius = setting.range_radius

        controlPoints.forEach(async (controlPoint) => {
            if (controlPoint.geofence.type === 'p') {
                if (pnpoly(packing, controlPoint)) {
                    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>> POLIGONO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}` )
                    distance = 0
                    currentControlPoint = controlPoint
                    await checkIn(packing, setting, range_radius, distance, currentControlPoint)
                }
            } else {
                const calculate = getDistanceFromLatLonInKm(
                    packing.last_device_data.latitude, 
                    packing.last_device_data.longitude, 
                    controlPoint.geofence.coordinates[0].lat, 
                    controlPoint.geofence.coordinates[0].lng
                )

                if (calculate < distance) {
                    distance = calculate
                    currentControlPoint = controlPoint
                    range_radius = controlPoint.geofence.radius
                }
            }
        })

        await checkIn(packing, setting, range_radius, distance, currentControlPoint)

        if (distance > range_radius && packing.last_device_data.accuracy > setting.accuracy_limit) return null
        return currentControlPoint
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
    
}

const checkIn = async (packing, setting, range_radius, distance, currentControlPoint) => {
    try {
        if (!packing.last_event_record) {
            // console.log('EMBALAGEM SEM EVENT RECORD')
            if (distance < range_radius && packing.last_device_data.accuracy <= setting.accuracy_limit) {
                // console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
                const eventRecord = new EventRecord({
                    packing: packing._id,
                    control_point: currentControlPoint._id,
                    distance_km: distance,
                    accuracy: packing.last_device_data.accuracy,
                    type: 'inbound'
                })

                await eventRecord.save()
            }
        } else {
            // console.log('EMBALAGEM JÁ TEM O EVENT RECORD')
            if (distance < range_radius && packing.last_device_data.accuracy <= setting.accuracy_limit) {
                // console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
                // Estou em um ponto de controle!
                // Checa se o ponto de controle onde a embalagem está é novo
                if (packing.last_event_record.control_point.toString() !== currentControlPoint._id.toString()) {

                    if (packing.last_event_record.type === 'inbound') {
                        const eventRecord = new EventRecord({
                            packing: packing._id,
                            control_point: packing.last_event_record.control_point._id,
                            distance_km: packing.last_event_record.distance_km,
                            accuracy: packing.last_device_data.accuracy,
                            type: 'outbound'
                        })

                        await eventRecord.save()
                    }

                    const eventRecord = new EventRecord({
                        packing: packing._id,
                        control_point: currentControlPoint._id,
                        distance_km: distance,
                        accuracy: packing.last_device_data.accuracy,
                        type: 'inbound'
                    })

                    await eventRecord.save()

                } else {
                    if (packing.last_event_record.type === 'outbound') {
                        const eventRecord = new EventRecord({
                            packing: packing._id,
                            control_point: currentControlPoint._id,
                            distance_km: distance,
                            accuracy: packing.last_device_data.accuracy,
                            type: 'inbound'
                        })

                        await eventRecord.save()
                    }
                }
            } else {
                // console.log('EMBALAGEM NÃO ESTÀ EM UM PONTO DE CONTROLE')
                // Não estou em um ponto de controle próximo!
                // Checa se o último poncheckInto de controle é um INBOUND
                if (packing.last_event_record.type === 'inbound') {
                    // Se sim
                    const eventRecord = new EventRecord({
                        packing: packing._id,
                        control_point: packing.last_event_record.control_point._id,
                        distance_km: distance,
                        accuracy: packing.last_device_data.accuracy,
                        type: 'outbound'
                    })

                    await eventRecord.save()
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
    
}

// const checkInWithPolygon = async () => {

// }

const pnpoly = (packing, controlPoint) => {
    let i, j, nvert = 0
    let c = false
    nvert = controlPoint.geofence.coordinates.length

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((controlPoint.geofence.coordinates[i].lng > packing.last_device_data.longitude) != (controlPoint.geofence.coordinates[j].lng > packing.last_device_data.longitude)) && (packing.last_device_data.latitude < (controlPoint.geofence.coordinates[j].lat - controlPoint.geofence.coordinates[i].lat) * (packing.last_device_data.longitude - controlPoint.geofence.coordinates[i].lng) / (controlPoint.geofence.coordinates[j].lng - controlPoint.geofence.coordinates[i].lng) + controlPoint.geofence.coordinates[i].lat)) {
            c = !c
        }
    }

    return c
}