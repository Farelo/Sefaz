'use strict';

const request = require('request');

//refatorar isso utilizando request-promise
module.exports = function (token) {
    return new Promise(function(resolve, reject) {
        var options = {
            url: 'https://loka-app.com/api/deviceList',
            method: 'POST',
            headers : {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        var callback = function(error, response, body) {
            if (error)
                reject(error);

            try {
              var info = JSON.parse(body);
              resolve(info);
            }
            catch(err) {
                reject(err);
            }
        }

        request(options, callback);
    });
}
