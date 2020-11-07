const debug = require("debug")("dm.controller");
const dm_service = require("./dm.service");

const loginDM = async () => {
   try {
      return await dm_service.loginLokaDmApi();
   } catch (error) {
      debug(error);
      return null;
   }
};

async function logoutDM(cookie) {
   try {
      dm_service.logoutLokaDmApi(cookie);
      return Promise.resolve("Logout with success!");
   } catch (error) {
      return Promise.reject("Logout error");
   }
}

const fetchAndSavePositions = async (packing, startDate, endDate, cookie) => {
   debug("fetchAndSavePositions")
   try {
      if (!cookie) cookie = await dm_service.loginLokaDmApi();
      let result = await dm_service.fetchPositions(packing.tag.code, startDate, endDate, true, cookie);

      if (result.length > 0) await dm_service.createManyPositionMessages(packing, result);
      return result;
   } catch (error) {
      return [];
   }
};

const fetchAndSaveSensors = async (packing, startDate, endDate, cookie) => {
   try {
      if (!cookie) cookie = await dm_service.loginLokaDmApi();

      let result = await dm_service.fetchSensors(packing.tag.code, startDate, endDate, cookie);

      //TEMPERATURE
      let allTemperatures = retrieveTemperature(result);
      if (allTemperatures.length > 0) await dm_service.createManyTemperatureMessages(packing, allTemperatures);

      //BATTERY
      let allBattery = retrieveBattery(result);
      if (allBattery.length > 0) await dm_service.createManyBatteryMessages(packing, allBattery);

      //ALPS BUTTON
      let allButton = retrieveButton(result);
      if (allButton.length > 0) await dm_service.createManyButtonMessages(packing, allButton);


      return result;
   } catch (error) {
      debug(error);
      return [];
   }
};

const retrieveTemperature = (sensorsArray) => {
   let result = [];

   sensorsArray.forEach((sigfoxMessage) => {
      let existentValue = searchProperty("Temperature", sigfoxMessage.messageDecoded);
      if (existentValue) {
         result.push({
            timestamp: sigfoxMessage.timestamp,
            date: sigfoxMessage.date,
            value: Number(existentValue),
         });
      }
   });
   return result;
};

const retrieveBattery = (sensorsArray) => {
   let result = [];

   sensorsArray.forEach((sigfoxMessage) => {
      let existentBattery = searchProperty("Battery", sigfoxMessage.messageDecoded);
      let existentBatteryStatus = searchProperty("Battery Status", sigfoxMessage.messageDecoded);
      let existentBatteryVoltage = searchProperty("Battery Voltage", sigfoxMessage.messageDecoded);

      if (existentBattery || existentBatteryStatus || existentBatteryVoltage) {
         result.push({
            timestamp: sigfoxMessage.timestamp,
            date: sigfoxMessage.date,
            battery: existentBattery || existentBatteryStatus ? Number(existentBattery || existentBatteryStatus) : null,
            batteryVoltage: existentBatteryVoltage ? Number(existentBatteryVoltage) : null,
         });
      }
   });
   return result;
};


const retrieveButton = (sensorsArray) => {
   let result = [];

   sensorsArray.forEach((sigfoxMessage) => {
      let existentButton = searchProperty("Detector Switch", sigfoxMessage.messageDecoded);

      if (existentButton) {

         existentButton == "True" ?  existentButton = true : existentButton = false; 
   
         result.push({
            timestamp: sigfoxMessage.timestamp,
            date: sigfoxMessage.date,
            detector_switch: existentButton
         });
      }
   });
   return result;
};

/**
 * Função para varrer o array messageDecoded retornado pela LOKA que contem subarrays com informações dos sensores.
 * Exemplo de messageDecoded:
 *  messageDecoded: [ ["Temperature", "27&deg;C"], [], ["Battery Voltage", "2.96V"], [], ["Battery","83.1%"], [] ]
 * @param {*} propToFind termo a ser buscado na posição 0 do subarray que contém informação
 * @param {*} messageDecoded mensagem decodificada contida no retorno da loka sobre o device
 */
const searchProperty = (propToFind, messageDecoded) => {
   let propertySet = messageDecoded.find((msg) => {
      return msg[0] === propToFind;
   });

   if (propertySet) {
      try {
         if (propToFind === "Temperature") {
            return propertySet[1].toString().split("&")[0];
         }

         if (propToFind === "Battery") {
            return propertySet[1].toString().split("%")[0];
         }

         if (propToFind === "Battery Voltage") {
            return propertySet[1].toString().split("V")[0];
         }

         if (propToFind === "Battery Status") {
            return translateALPSBattery(propertySet[1]);
         }

         if (propToFind === "Detector Switch") {
           return propertySet[1].toString(propertySet[1])
         }
      } catch (error) {
         debug(error);
      }
   }
   return null;
};

const translateALPSBattery = (value) => {
   let result = null;

   if (value !== null) {
      if (value == "Excellent" || value == 3) result = 100;
      if (value == "Good" || value == 2) result = 70;
      if (value == "Almost empty" || value == 1) result = 40;
      if (value == "Empty" || value == 0) result = 0;
   }

   return result;
};

module.exports = {
   loginDM,
   logoutDM,
   fetchAndSavePositions,
   fetchAndSaveSensors,
};
