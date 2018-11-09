const getDistanceFromLatLonInKm = require('../common/get_distance_from_lat_lng_in_km')
const { EventRecord } = require('../../models/event_record.model')

module.exports = async (packing, controlPoints, setting) => {
    let distance = Infinity
    let currentControlPoint = {}

    controlPoints.forEach( async (controlPoint) => {
        const calculate = getDistanceFromLatLonInKm(packing.last_device_data.latitude, packing.last_device_data.longitude, controlPoint.lat, controlPoint.lng)

        if (calculate < distance) {
            distance = calculate
            currentControlPoint = controlPoint
        }
    })

    await checkIn(packing, setting, distance, currentControlPoint)
    
    if (distance > setting.range_radius) return null


    return currentControlPoint
}

const checkIn = async (packing, setting, distance, currentControlPoint) => {
    if (!packing.last_event_record) {
        console.log('EMBALAGEM SEM EVENT RECORD')
        if (distance < setting.range_radius) {
            console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
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
        console.log('EMBALAGEM JÁ TEM O EVENT RECORD')
        if (distance < setting.range_radius) {
            console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
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
            }
        } else {
            console.log('EMBALAGEM NÃO ESTÀ EM UM PONTO DE CONTROLE')
            // Não estou em um ponto de controle próximo!
            // Checa se o último ponto de controle é um INBOUND
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
}