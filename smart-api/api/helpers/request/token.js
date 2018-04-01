const request      = require('request');
const constants    = require('../utils/constants');


/**
 * Realiza a autenticação do usuário para recuperar um token de acesso
 */
module.exports = function () {
    return new Promise(function (resolve, reject) {
        var options = {
            url: 'https://loka-app.com/api/login',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "username": constants.loka_api.username,
                "password": constants.loka_api.password
            })
        }

        var callback = function (error, response, body) {
            if (error)
                reject(error);

            try {
                var info = JSON.parse(body);
                resolve(info.access_token);
            }
            catch (err) {
                reject(err);
            }

        }

        request(options, callback);
    });
}
