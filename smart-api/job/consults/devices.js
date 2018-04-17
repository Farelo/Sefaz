'use strict';

const request = require('request');

//refatorar isso utilizando request-promise
module.exports = function (token) {
    return new Promise(function(resolve, reject) {
        let options = {
            url: 'https://loka-app.com/api/deviceList',
            method: 'POST',
            headers : {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        let callback = function(error, response, body) {
            if (error)
                reject(error);

            try {
              let info = JSON.parse(body);
              resolve(info);
            }
            catch(err) {
                reject(err);
            }
        }

        request(options, callback);
    });
}
