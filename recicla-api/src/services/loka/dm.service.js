const dm = require('./dm.utils')
const request = require('request').defaults({baseUrl: 'https://dm.loka.systems'})
const qs = require('qs')
const _ = require('lodash')
const sslRootCAs = require('ssl-root-cas')

module.exports = {
    loginLokaDmApi: loginLokaDmApi,
    // logoutLokaDmApi: logoutLokaDmApi,
    messagesFromSigfox: messagesFromSigfox,
    positions: positions,
    deviceById: deviceById,
    devicesList: devicesList
}

// inejta o certificado SSL para poder fazer as requisições https
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/COMODORSADomainValidationSecureServerCA.pem');
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/Bitbucket/Projeto - Embalagens Inteligentes/Software Reciclapac/api-migration-branch/recicla/recicla-api/src/security/keys/COMODORSADomainValidationSecureServerCA.pem');

/*
    Este arquivo contem as chamadas disponibilizadas pela Loka em sua api DM-api.

    Para mais detalhes entrar em https://dm.loka.systems/api

    Toda requisição feita à api do DM da loka precisa de um cookie a ser enviado no header da requisição.

    Este cookie é capturado na requisição de login em dm-cookie.js
*/

//TODO: Deixar todas mensagens em português
function loginLokaDmApi () {
    return new Promise(function(resolve, reject) {
        let options = {
            url: `/auth/login`,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "username": dm.username,
                "password": dm.password
            })
        }

        let callback = function (error, response, body) {
            if (error) {
                reject('Error on login request sent to loka: ' + error)
                console.log('Error on login request sent to loka: ', error)
            }
            try {
                let cookie = response.headers['set-cookie'][0].split(';')[0] 
                
                // console.log("login: logou na api e gerou o cookie: " + cookie);
                
                resolve(cookie);
            }
            catch (err) {
                reject("Erro ao tentar extrair o cookie do response de login do DM Loka. ", err);
            }
        }
        request(options, callback);
    });
}

//TODO: terminando ainda o logout - preciso falar com a loka
// function logoutLokaDmApi(cookie) {
//     return new Promise(function (resolve, reject) {

//         let path = `/auth/logout`
        
//         let options = {
//             url: path,
//             method: 'GET',
//             headers: {
//                 'content-type': 'application/json',
//                 'Cookie': `${cookie}`
//             }
//         }

//         //body: onde esta o JSON com os dados
//         let callback = function (error, response, body) {

//             if (error){
//                 reject('Error on messagesFromSigfox request sent to loka: ' + error)    
//                 console.log('Error on messagesFromSigfox request sent to loka: ', error)
//             }

//             try {
//                 resolve(JSON.parse(body).data);
//             }
            
//             catch (err) {
//                 reject("Erro ao tentar realizar o parse do JSON de mensagens da sigfox do device " + deviceId + ".\nRetorno da requisicao - header: " + response + "Retorno da requisicao - body: " + body + "\n" + err);
//             }
//         }
//         request(options, callback);

//     })
// }

//obtem conjunto de mensagens da sigfox de um device 
function messagesFromSigfox (cookie, deviceId, startDate, endDate, max) { 
    return new Promise (function (resolve, reject) {

        let path = `/message/show/${deviceId}/sigfox` + qs.stringify( {startDate: startDate, endDate: endDate, max: max}, { addQueryPrefix: true });
        
        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'keep-alive'
            }
        }

        //body: onde esta o JSON com os dados
        let callback = function (error, response, body) {

            if (error){
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
function positions (cookie, deviceId, status, lowAccuracy, startDate, endDate, max) {
    return new Promise (function (resolve, reject) {

        let path = `/position/get` + qs.stringify({terminal: deviceId, status: status, lowAccuracy: lowAccuracy, startDate: startDate, endDate: endDate, max: max}, {addQueryPrefix: true} );

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'keep-alive'
            }
        }

        let callback = function (error, responde, body) {

            if (error) {
                reject('Error on positions request sent to loka: ' + error)
                console.log('Error on positions request sent to loka: ', error)
            }

            try{
                resolve(JSON.parse(body).data);
            }
            catch (err){
                reject("Erro ao tentar realizar o parse do JSON de mensagens de posição da LOKA do device " + deviceId + ".\nRetorno da requisicao - header: " + response + "Retorno da requisicao - body: " + body + "\n" + err);
            }
        }

        request(options, callback);
    });
}

function deviceById (cookie, deviceId) {
    return new Promise(function(resolve, reject){

        let path = `/terminal/get/${deviceId}`;

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'keep-alive'
            }
        }

        let callback = function(error, response, body) {

            if (error){
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

function devicesList (cookie, client, profile, status) {
    return new Promise(function(resolve, reject){

        let path = `/terminal/list` + qs.stringify({client: client, profile: profile, status: status}, {addQueryPrefix: true});

        let options = {
            url: path,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'keep-alive'
            }
        }

        let callback = function (error, response, body) {
            
            if (error){
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

