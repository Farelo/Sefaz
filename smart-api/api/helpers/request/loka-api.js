const request = require('request');
const _ = require('lodash')

module.exports = {
    confirmDevice: confirmDevice,
    positions: positions
}

/**
 * Realiza a requisição para API da LOKA avaliando se 
 * o ID inserido no sistema realmente existe no sistema da loka.
 */
function confirmDevice(token, device) {
    return new Promise(function (resolve, reject) {
        let options = {
            url: `https://loka-app.com/api/deviceDetails?deviceId=${device}`,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        let callback = function (error, response, body) {
            if (error)
                reject(error);

            try {
                if (!body.match(`Device ${device} not found`)) {
                    let info = JSON.parse(body);
                    resolve("Exist device in the system");
                } else {
                    reject("Code not exist in the system");
                }
            }
            catch (err) {
                reject(err);
            }

        }

        request(options, callback);
    });
}

/**
 * Avalia a posição de um beacon no sistema através do
 * seu ID.
 */
function positions(token, device, initial_date, final_date) {

    return new Promise(function (resolve, reject) {
        let date = new Date();
        let start = date.getTime() - (1000 * 60 * 60 * 24 * 10);
        let end = date.getTime();

        let options = {
            url: `https://loka-app.com/api/deviceDetails?deviceId=${device}`,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        let callback = function (error, response, body) {
           
            if (error)
                reject(error);

            try {
                if (!body.match(`Device ${device} not found`)) {
                    let info = JSON.parse(body);
                    let array = {
                        markers: [],
                        positions: []
                    };

                    if (!initial_date){
                        info.positions.forEach(o => array.markers.push({ 'start': new Date(o.date * 1000), 'end': (o.to == null ? null : new Date(o.to * 1000)), 'battery': o.battery, 'position': [o.latitude, o.longitude], 'accuracy': o.accuracy}))
                    } else {
                        let markersFiltered = _.filter(info.positions, (position) => {
                            let positionDate = new Date(position.date * 1000)

                            if (final_date) return positionDate >= initial_date && positionDate <= final_date

                            return positionDate >= initial_date
                        })
                    }
                    
                    array.markers.forEach(o => array.positions.push({ lat: o.position[0], lng: o.position[1] }))
                    
                    console.log(array)
                    resolve(array)
                } else {
                    reject("Code not exist in the system");
                }
            }
            catch (err) {

                reject(err);
            }

        }

        request(options, callback);
    });

}

// const filterByAccuracy = async (positions, accuracy) => {
//     let positionFiltered = _.filter(positions.markers, (item) => item.accuracy < accuracy)

//     console.log('====================================')
//     console.log(positionFiltered)
//     console.log('====================================')

//     return positions
// }