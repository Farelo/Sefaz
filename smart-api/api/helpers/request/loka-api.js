const request = require('request');

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
function positions(token, device) {

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



                    info.positions.forEach(o => array.markers.push({ 'start': new Date(o.date * 1000), 'end': (o.to == null ? null : new Date(o.to * 1000)), 'battery': o.battery, 'position': [o.latitude, o.longitude] }))
                  
                    // array.markers.sort(function(a,b){
                    //   if (a.start < b.start) {
                    //     return 1;
                    //   }
                    //   if (a.start > b.start) {
                    //     return -1;
                    //   }
                    //   // a must be equal to b
                    //   return 0;
                    // });
                    array.markers.forEach(o => array.positions.push({ lat: o.position[0], lng: o.position[1] }));

                    resolve(array);
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