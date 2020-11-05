const debug = require("debug")("dm.service");
const config = require("config");
const request = require("request").defaults({ baseUrl: config.get("loka.baseUrl") /* 'https://dm.loka.systems' */ });
const { axios } = require("../../tools/axios");
const Position = require("../../models/position.model");
const Temperature = require("../../models/temperature.model");
const Battery = require("../../models/battery.model");

// const axios = require("axios");
const qs = require("qs");

// inejta o certificado SSL para poder fazer as requisições https
// const sslRootCAs = require('ssl-root-cas')
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/COMODORSADomainValidationSecureServerCA.pem');
// sslRootCAs.inject().addFile('/home/miguel/Reciclapac/Bitbucket/Projeto - Embalagens Inteligentes/Software Reciclapac/api-migration-branch/recicla/recicla-api/src/security/keys/COMODORSADomainValidationSecureServerCA.pem');

/*
    Este arquivo contem as chamadas disponibilizadas pela Loka em sua api DM-api.
    Para mais detalhes entrar em https://dm.loka.systems/api
    Toda requisição feita à api do DM da loka precisa de um cookie enviado no header da requisição. 
*/

exports.loginLokaDmApi = async () => {
   return new Promise(function (resolve, reject) {
      let options = {
         url: `/auth/login`,
         method: "POST",
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify({
            username: config.get("loka.username"), //dm.username,
            password: config.get("loka.password"), //dm.password
         }),
      };

      let callback = function (error, response, body) {
         if (error) {
            reject("Error on login request sent to loka: " + error);
         }
         try {
            let cookie = response.headers["set-cookie"][0].split(";")[0];

            resolve(cookie);
         } catch (err) {
            reject("Erro ao tentar extrair o cookie do response de login do DM Loka. ", err);
         }
      };
      request(options, callback);
   });
};

//desloga a sessao aberta no login: precisa passar o cookie retornado do login 
exports.logoutLokaDmApi = (cookie) => {
   return new Promise(function (resolve, reject) {
      let path = `/auth/logout`;

      let options = {
         url: path,
         method: "GET",
         headers: {
            "content-type": "application/json",
            Cookie: `${cookie}`,
         },
      };

      let callback = function (error, response, body) {
         if (error) {
            reject("Error on logoutLokaDMApi request sent to loka: " + error);
            debug("Error on logoutLokaDMApi request sent to loka: ", error);
         }

         try {
            resolve([response.statusCode, response.headers.connection]);
         } catch (err) {
            reject("Erro ao tentar deslogar");
         }
      };
      request(options, callback);
   });
};

exports.fetchPositions = async (deviceId, startDate, endDate, lowAccuracy, cookie) => {
   let path = config.get("loka.baseUrl") + "/position/get";

   let options = {
      params: {
         terminal: deviceId,
         startDate: startDate,
         endDate: endDate,
         lowAccuracy: lowAccuracy
      },
      headers: {
         "content-type": "application/json",
         Cookie: `${cookie}`,
      },
   };

   try {
      const result = await axios.get(path, options);
      return result.data.data;
   } catch (error) {
      debug("error", error);
      return [];
   }
};

exports.createManyPositionMessages = async (packing, messages) => {
   await Position.createMany(packing, messages);
};

exports.fetchSensors = async (deviceId, startDate, endDate, cookie) => {
   let path = `${config.get("loka.baseUrl")}/message/show/${deviceId}/sigfox`;

   let options = {
      params: {
         startDate: startDate,
         endDate: endDate,
      },
      headers: {
         "content-type": "application/json",
         Cookie: `${cookie}`,
         Connection: "close",
      },
   };

   try {
      const result = await axios.get(path, options);
      return result.data.data;
   } catch (error) {
      debug("error", error);
      return [];
   }
};

exports.createManyTemperatureMessages = async (packing, messages) => {
   await Temperature.createMany(packing, messages);
};

exports.createManyBatteryMessages = async (packing, messages) => {
   await Battery.createMany(packing, messages);
};
