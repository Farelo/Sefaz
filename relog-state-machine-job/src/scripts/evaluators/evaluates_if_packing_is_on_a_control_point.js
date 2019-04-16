const jsts = require('jsts')
const turf = require('@turf/turf')
const getDistanceFromLatLonInKm = require('../common/get_distance_from_lat_lng_in_km')
const { EventRecord } = require('../../models/event_record.model')

module.exports = async (packing, controlPoints, setting) => {
    try {
        let distance = Infinity
        let currentControlPoint = null
        let range_radius = 0
        let isInsidePolygon = false

        //Deve ser otimizado para sair do loop quando for encontrado dentro de um polígono
        controlPoints.forEach(async (controlPoint) => {
            //isInsidePolygon = false
            //console.log('controlPoints')

            if (controlPoint.geofence.type === 'p') {
                if (!isInsidePolygon){
                    //if (pnpoly(packing, controlPoint)) {
                    if (intersectionpoly(packing, controlPoint)) {
                        console.log(`>> POLIGONO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}` )
                        distance = 0
                        currentControlPoint = controlPoint
                        isInsidePolygon = true
                    }
                }
            } else {
                if (!isInsidePolygon){
                    console.log(`== CIRCULO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}`)

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
            }
        })

        //diferenciar intersecção de inbound e outbound
        if (!isInsidePolygon && (distance > (range_radius + packing.last_device_data.accuracy)) ) {
            //console.log('SEM INTERSECÇÃO')
            await newcheckOut(packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon)
            return null
            
        } else {
            console.log('COM INTERSECÇÃO') 

            if (packing.last_event_record){
                if (packing.last_event_record.type === 'inbound'){
                    console.log('FEZ INBOUND') 
                    await newcheckIn(packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon)
                    return currentControlPoint

                } else{
                    console.log('FEZ OUTBOUND')

                    if (packing.last_device_data.accuracy <= setting.accuracy_limit) {
                        console.log('BOA ACURACIA')
                        await newcheckIn(packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon)
                        return currentControlPoint
                    } else {
                        console.log('NÃO TEM BOA ACURACIA')
                        return null
                    }
                }

            }else{
                console.log('NÃO TEM EVENT RECORD')
                if(packing.last_device_data.accuracy <= setting.accuracy_limit){
                    console.log('BOA ACURACIA')
                    await newcheckIn(packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon)
                    return currentControlPoint
                } else {
                    console.log('NÃO TEM BOA ACURACIA')
                    return null
                }
            }
        }
        //

        //await checkIn(packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon)

        //Emanoel
        ////if ((distance > range_radius) && (packing.last_device_data.accuracy > setting.accuracy_limit)) return null
        //if ((distance > range_radius) || (packing.last_device_data.accuracy > setting.accuracy_limit)) return null
        //else return currentControlPoint
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }

}

const verifyCheck = async (distance, range_radius, accuracy, accuracy_limit, isInsidePolygon) => {
    //console.log('verifyCheck: ' + ((isInsidePolygon || (distance <= (range_radius + accuracy))) && (accuracy <= accuracy_limit)))
    return ((isInsidePolygon || (distance <= (range_radius + accuracy))) && (accuracy <= accuracy_limit))
}

const newcheckOut = async (packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon) => {
    //console.log('EMBALAGEM NÃO ESTÁ EM UM PONTO DE CONTROLE')
    // Não estou em um ponto de controle próximo!
    // Checa se o último poncheckInto de controle é um INBOUND
    if (packing.last_event_record){
        if (packing.last_event_record.type === 'inbound') {
            //console.log('CRIAR OUTBOUND!')
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

const newcheckIn = async (packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon) => {

    
    try {
        if (!packing.last_event_record) {
            //console.log('EMBALAGEM SEM EVENT RECORD')
            //if (verifyCheck(distance, range_radius, packing.last_device_data.accuracy, setting.accuracy_limit, isInsidePolygon) == true) {
            if (((isInsidePolygon && (packing.last_device_data.accuracy <= setting.accuracy_limit)) || (distance <= (range_radius + packing.last_device_data.accuracy))) && (packing.last_device_data.accuracy <= setting.accuracy_limit)) {
                console.log('.EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
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
            if ((isInsidePolygon || (distance <= (range_radius + packing.last_device_data.accuracy))) && (packing.last_device_data.accuracy <= setting.accuracy_limit)) {
                console.log('..EMBALAGEM ESTÁ EM UM PONTO DE CONTROLE')
                // Estou em um ponto de controle!
                // Checa se o ponto de controle onde a embalagem está é novo
                if (packing.last_event_record.control_point.toString() !== currentControlPoint._id.toString()) {
                    console.log('TENTAR OUTBOUND')

                    if (packing.last_event_record.type === 'inbound') {
                        console.log('CRIAR OUTBOUND')
                        const eventRecord = new EventRecord({
                            packing: packing._id,
                            control_point: packing.last_event_record.control_point._id,
                            distance_km: packing.last_event_record.distance_km,
                            accuracy: packing.last_device_data.accuracy,
                            type: 'outbound'
                        })

                        await eventRecord.save()
                    }

                    console.log('CRIAR INBOUND')
                    const eventRecord = new EventRecord({
                        packing: packing._id,
                        control_point: currentControlPoint._id,
                        distance_km: distance,
                        accuracy: packing.last_device_data.accuracy,
                        type: 'inbound'
                    })

                    await eventRecord.save()

                } else {
                    console.log('TENTAR INBOUND')
                    if (packing.last_event_record.type === 'outbound') {
                        console.log('CRIAR INBOUND')

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
                console.log('EMBALAGEM NÃO ESTÀ EM UM PONTO DE CONTROLE')
                // Não estou em um ponto de controle próximo!
                // Checa se o último poncheckInto de controle é um INBOUND
                // if (packing.last_event_record.type === 'inbound') {
                //     //console.log('INBOUND!')
                //     // Se sim
                //     const eventRecord = new EventRecord({
                //         packing: packing._id,
                //         control_point: packing.last_event_record.control_point._id,
                //         distance_km: distance,
                //         accuracy: packing.last_device_data.accuracy,
                //         type: 'outbound'
                //     })

                //     await eventRecord.save()
                // }

            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }

}



/**
 * With the informations about the nearest control point, this method
 * calculate if the packing is inside or outside that control point
 * @param {*} packing The packing to verify 
 * @param {*} setting The user settings
 * @param {*} range_radius 
 * @param {*} distance 
 * @param {*} currentControlPoint 
 */
const checkIn = async (packing, setting, range_radius, distance, currentControlPoint) => {

    //// console.log('range_radius: ' + range_radius)
    //// console.log('distance: ' + distance)
    //// console.log('packing.last_device_data.accuracy: ' + packing.last_device_data.accuracy)
    //// console.log('setting.accuracy_limit: ' + setting.accuracy_limit)

    try {
        if (!packing.last_event_record) {
            //console.log('EMBALAGEM SEM EVENT RECORD')
            if (distance < range_radius && packing.last_device_data.accuracy <= setting.accuracy_limit) {
                //console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
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
            //console.log('EMBALAGEM JÁ TEM O EVENT RECORD')
            if ((distance < range_radius) && (packing.last_device_data.accuracy <= setting.accuracy_limit)) {
                //console.log('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
                // Estou em um ponto de controle!
                // Checa se o ponto de controle onde a embalagem está é novo
                if (packing.last_event_record.control_point.toString() !== currentControlPoint._id.toString()) {
                    //console.log('TENTAR INBOUND')

                    if (packing.last_event_record.type === 'inbound') {
                        //console.log('INBOUND!')
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
                    //console.log('TENTAR OUTBOUND')
                    if (packing.last_event_record.type === 'outbound') {
                        //console.log('OUTBOUND!')

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
                //console.log('EMBALAGEM NÃO ESTÀ EM UM PONTO DE CONTROLE')
                // Não estou em um ponto de controle próximo!
                // Checa se o último poncheckInto de controle é um INBOUND
                if (packing.last_event_record.type === 'inbound') {
                    //console.log('INBOUND!')
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

const intersectionpoly = (packing, controlPoint) => {
    //turf
    
    //criar polígono da planta
    let coordinates = controlPoint.geofence.coordinates
    
    let path = []
    let templateTurfPolygon = []

    coordinates.forEach(elem => {
        path.push([elem.lat, elem.lng])
    })
    path.push(path[0])
    //console.log([path])

    let controlPointLine  = turf.lineString(path)
    controlPointPolygon = turf.lineToPolygon(controlPointLine);
    //console.log(controlPointPolygon)

    //criar polígono da embalagem
    let center = [packing.last_device_data.latitude, packing.last_device_data.longitude] 
    let radius = packing.last_device_data.accuracy / 1000
    let options = {steps: 64, units: 'kilometers'}

    //console.log(center, radius)
    let packingPolygon = turf.circle(center, radius, options);
    //console.log('c: ')
    //console.log(JSON.stringify(packingPolygon))

    //checar intersecção
    let intersection = turf.intersect(controlPointPolygon, packingPolygon);

    console.log(' ')
    console.log('i: ', packing.tag.code, packing.serial) 
    console.log(intersection)

    return intersection
}

// const intersectionpoly = (packing, controlPoint) => {
//     //turf
    
//     //criar polígono da planta
//     let coordinates = controlPoint.geofence.coordinates
    
//     let path = []
//     let templateTurfPolygon = []

//     coordinates.forEach(elem => {
//         path.push([elem.lat, elem.lng])
//     })
//     path.push(path[0])
//     //console.log([path])

//     let controlPointPolygon = turf.polygon([path])
//     //console.log(controlPointPolygon)

//     //criar polígono da embalagem
//     let center = [packing.last_device_data.latitude, packing.last_device_data.longitude] 
//     let radius = packing.last_device_data.accuracy / 1000
//     let options = {steps: 64, units: 'kilometers'}

//     //console.log(center, radius)
//     let packingPolygon = turf.circle(center, radius, options);
//     console.log('c: ')
//     console.log(JSON.stringify(packingPolygon))


//     //checar intersecção
//     let intersection = turf.intersect(controlPointPolygon, packingPolygon);

//     // console.log('i:')
//     // console.log(intersection)
// }

// const intersectionpoly = (packing, controlPoint) => {
//     console.log('intersectionpoly')
//     //console.log(jsts)
//     let geometryFactory = new jsts.geom.GeometryFactory();
//     let controlPointPolygon = createJstsPolygon(geometryFactory, controlPoint);
//     let packingCircle = pointJSTS({x: packing.last_device_data.latitude, y: packing.last_device_data.longitude}, packing.last_device_data.accuracy);
//     let intersection = controlPointPolygon.intersection(packingCircle);
//     console.log(intersection);
// }

// const createJstsPolygon = (geometryFactory, controlPoint) => {
//     var path = controlPoint.geofence.coordinates;
//     var coordinates = path.map(coord => {
//       return new jsts.geom.Coordinate(coord.lat, coord.lng);
//     });
//     coordinates.push(coordinates[0]);
//     var shell = geometryFactory.createLinearRing(coordinates);
//     return geometryFactory.createPolygon(shell);
// }

// // this returns a JSTS polygon circle approximation with provided center and radius
// // b = pointJSTS({x:10,y:20}, 40);
// const pointJSTS = (center, radius) => {
//     console.log(center)
//     console.log(radius)
//     var point = new jsts.geom.Point(center);
//     return point.buffer(radius);
// }