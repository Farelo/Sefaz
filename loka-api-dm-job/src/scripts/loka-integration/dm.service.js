const debug = require('debug')('dm.service')
const config = require('config')
const request = require('request').defaults({ baseUrl: config.get('loka.baseUrl')/* 'https://dm.loka.systems' */ })
const qs = require('qs')

// inejta o certificado SSL para poder fazer as requisições https
// const sslRootCAs = require('ssl-root-cas')
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/COMODORSADomainValidationSecureServerCA.pem');
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/Bitbucket/Projeto - Embalagens Inteligentes/Software Reciclapac/api-migration-branch/recicla/recicla-api/src/security/keys/COMODORSADomainValidationSecureServerCA.pem');

/*
    Este arquivo contem as chamadas disponibilizadas pela Loka em sua api DM-api.

    Para mais detalhes entrar em https://dm.loka.systems/api

    Toda requisição feitas à api do DM da loka precisa de um cookie a ser enviado no header da requisição.

    Este cookie é capturado na requisição de login em dm-cookie.js
*/

//TODO: Deixar todas mensagens em português
exports.loginLokaDmApi = () => {
    return new Promise(function (resolve, reject) {

        let options = {
            url: `/auth/login`,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "username": config.get('loka.username'),//dm.username,
                "password": config.get('loka.password')//dm.password
            })
        }

        let callback = function (error, response, body) {
            if (error) {
                reject('Error on login request sent to loka: ' + error)
                console.log('Error on login request sent to loka: ', error)
            }
            try {
                let cookie = response.headers['set-cookie'][0].split(';')[0]

                resolve(cookie);
            }
            catch (err) {
                reject("Erro ao tentar extrair o cookie do response de login do DM Loka. ", err);
            }
        }
        request(options, callback);
    });
}

//desloga a sessao aberta no login: precisa passar o cookie retornado do login
exports.logoutLokaDmApi = (cookie) => {
    return new Promise(function (resolve, reject) {

        let path = `/auth/logout`

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`
            }
        }

        let callback = function (error, response, body) {

            if (error) {
                reject('Error on logoutLokaDMApi request sent to loka: ' + error)
                console.log('Error on logoutLokaDMApi request sent to loka: ', error)
            }

            try {
                resolve([response.statusCode, response.headers.connection]);
            }

            catch (err) {
                reject("Erro ao tentar deslogar");
            }
        }
        request(options, callback);

    })
}

//obtem conjunto de mensagens da sigfox de um device 
exports.messagesFromSigfox = (cookie, deviceId, startDate, endDate, max) => {
    return new Promise(function (resolve, reject) {

        let path = `/message/show/${deviceId}/sigfox` + qs.stringify({ startDate: startDate, endDate: endDate, max: max }, { addQueryPrefix: true });

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'close'
            }
        }

        let callback = function (error, response, body) {

            if (error) {
                reject('Error on messagesFromSigfox request sent to loka: ' + error)
                console.log('Error on messagesFromSigfox request sent to loka: ', error)
            }

            try {
                resolve(JSON.parse(body).data);
            }

            catch (err) {
                reject("Erro ao tentar realizar o parse do JSON de mensagens da sigfox do device " + deviceId + ".\nRetorno da requisicao - header: " + response + "Retorno da requisicao - body: " + body + "\n" + err);
            }
        }
        request(options, callback);
    });

}

//obtem conjunto de posicoes (lat, long, acuracia) ja resolvidos pela LOKA para um dispositivo
exports.positions = (cookie, deviceId, status, lowAccuracy, startDate, endDate, max) => {
    return new Promise(function (resolve, reject) {

        let path = `/position/get` + qs.stringify({ terminal: deviceId, status: status, lowAccuracy: lowAccuracy, startDate: startDate, endDate: endDate, max: max }, { addQueryPrefix: true });

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'close'
            }
        }

        let callback = function (error, response, body) {

            if (error) {
                reject('Error on positions request sent to loka: ' + error)
                console.log('Error on positions request sent to loka: ', error)
            }

            try {
                resolve(JSON.parse(body).data);
            }
            catch (err) {
                reject("Erro ao tentar realizar o parse do JSON de mensagens de posição da LOKA do device " + deviceId + ".\nRetorno da requisicao - header: " + response + "Retorno da requisicao - body: " + body + "\n" + err);
            }
        }

        request(options, callback);
    });
}

exports.deviceById = (cookie, deviceId) => {
    return new Promise(function (resolve, reject) {

        let path = `/terminal/get/${deviceId}`;

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'close'
            }
        }

        let callback = function (error, response, body) {

            if (error) {
                reject('Error on deviceById request sent to loka: ', error)
                console.log('Error on deviceById request sent to loka: ', error)
            }

            try {
                resolve(JSON.parse(body));
            }
            catch (err) {
                reject("Erro ao tentar realizar o parse do JSON dos dados do device vindos da LOKA. ", err);
            }
        }

        request(options, callback);
    });
}

exports.devicesList = (cookie, client, profile, status) => {
    return new Promise(function (resolve, reject) {

        let path = `/terminal/list` + qs.stringify({ client: client, profile: profile, status: status }, { addQueryPrefix: true });

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'close'
            }
        }

        let callback = function (error, response, body) {

            if (error) {
                reject('Error on devicesList request sent to loka: ', error)
                console.log('Error on devicesList request sent to loka: ', error)
            }

            try {
                resolve(JSON.parse(body).data);
            }
            catch (err) {
                console.log("Erro ao tentar realizar o parse do JSON da lista de devices vindos da LOKA. ", err);
            }
        }

        request(options, callback);
    });
}