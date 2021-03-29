// process.setMaxListeners(0);
// const logger = require("./config/winston.config");
const config = require("config");
const axios = require("axios");
const WebSocket = require("ws");
const { Packing } = require("./db/models/packings.model");
const PositionController = require("./controllers/position.controller");
const TemperatureController = require("./controllers/temperature.controller");
const BatteryController = require("./controllers/battery.controller");
const ButtonController = require("./controllers/button.controller");

const WebSocketClient = require("websocket").client;
const client = new WebSocketClient();

// let wss = null;

// Getting Dict DevicesIds x last DeviceData
let deviceDictList;
async function getDeviceDictList() {
  await require("./db/db")();

  //logger.info("Getting Dict DevicesIds x last DeviceData");

  //Getting all DeviceIds
  let result = await Packing.find({}, { _id: 0, tag: 1 }).then((packFind) => {
    let packMapped = packFind
      .filter((packFilter) => {
        return packFilter.tag.code != undefined;
      })
      .map(async (packMap) => {
        //Get last deviceData from DB
        let lastDeviceData = await DeviceData.find({
          device_id: packMap.tag.code,
        })
          .sort({ _id: -1 })
          .limit(1)
          .then((resultFind) => {
            return resultFind[0];
          });

        //Get last deviceData from mock empty
        if (!lastDeviceData) {
          lastDeviceData = {
            device_id: packMap.tag.code,
            message_date: null,
            message_date_timestamp: null,
            message_type: null,
            last_communication: null,
            last_communication_timestamp: null,
            latitude: null,
            longitude: null,
            accuracy: null,
            temperature: null,
            seq_number: null,
            battery: {
              percentage: null,
              voltage: null,
            },
            message: null,
          };
        }

        let dict = {
          deviceId: packMap.tag.code,
          lastDeviceData: lastDeviceData,
        };
        return dict;
      });

    return packMapped;
  });
  deviceDictList = await Promise.all(result);
  return deviceDictList;
}

// Subscribing Devices in Websocket
async function subscribingDeviceIds(deviceDictList) {
  //logger.info("Subscribing Devices in Websocket");
  for (let index in deviceDictList) {
    deviceDict = deviceDictList[index];
    //deviceDictList.forEach(async deviceDict => {
    //logger.info("Subscribing device with id " + deviceDict.deviceId);
    var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/subscribe_terminal/" + deviceDict.deviceId,
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    };

    // do the GET request
    // logger.info("id: " + deviceDict.deviceId);
    await requestSubscribe(optionsget);
    //});
  }
}

function requestSubscribe(optionsget) {
  return new Promise((resolve, reject) => {
    var reqGet = https.request(optionsget, function (res) {
      /*logger.info(
        "Response code on subscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          res.statusCode
      );*/
      res.on("data", function (d) {
        // logger.info("GET result:\n" + d);
        resolve(d);
      });
    });

    reqGet.end();
    reqGet.on("error", function (e) {
      /*logger.info(
        "Error on subscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          e
      );*/
      // logger.info(e);
      reject(e);
    });
  });
}

// Unsubscribing Devices in Websocket
async function unsubscribingDeviceIds(deviceDictList) {
  for (let index in deviceDictList) {
    deviceDict = deviceDictList[index];
    var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/unsubscribe_terminal/" + deviceDict.deviceId,
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    };
    // do the GET request
    // logger.info("id: " + deviceDict.deviceId);
    await requestUnsubscribe(optionsget);
  }
}

function requestUnsubscribe(optionsget) {
  return new Promise((resolve, reject) => {
    // do the GET request
    var reqGet = https.request(optionsget, function (res) {
      /*logger.info(
        "Response code on Unsubscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          res.statusCode
      );*/
      res.on("data", function (d) {
        // logger.info("GET result:\n" + d);
        resolve(d);
      });
    });

    reqGet.end();
    reqGet.on("error", function (e) {
      /*logger.info(
        "Error on Unsubscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          e
      );*/
      // logger.info(e);
      reject(e);
    });
  });
}

/**
 * Establishes a new websocket connection
 */
// function initWebSocket0() {
//   console.log("Iniciando ...", config.get("ws.host"), config.get("ws.token"));

//   try {
//     const wss = new WebSocket(config.get("ws.host"), { headers: { Authorization: config.get("ws.token") } });
//     // console.log(wss);
//     // client.connect(config("ws.host"), null, null, { Authorization: "Bearer " + config("ws.tokens") }, null);

//     wss.on("connection", (ws) => {
//       console.info("WebSocket client is connected");

//       ws.on("message", (message) => {
//         messageReceived(message);
//       });

//       ws.on("close", () => {
//         console.log("stopping client");
//       });

//       ws.on("error", (message) => {
//         console.log("error on trying to connect", message);
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

function initWebSocket() {
  client.on("connectFailed", async function (error) {
    console.log("falha", error);
  });

  client.on("connect", function (connection) {
    console.log("sucesso");

    connection.on("error", async function (error) {
      console.log("erro", error);
    });

    connection.on("close", async function () {
      console.log("close");
    });

    connection.on("message", async function (message) {
      messageReceived(message);
    });
  });

  client.connect(config.get("ws.host"), null, null, { Authorization: "Bearer " + config.get("ws.token") }, null);
}

const messageReceived = async (message) => {
  // console.log("Received message");
  console.log(message);

  if (message.type === "utf8") {
    //Save message
    // Message.create({
    //    message: JSON.stringify(jsonMessage),
    //    message_date: new Date(jsonMessage.timestamp * 1000),
    //    device_id: jsonMessage.timestamp,
    // });

    let jsonMessage = JSON.parse(message.utf8Data);

    updateLastMessage(jsonMessage);

    if (Object.keys(jsonMessage).includes("location")) {
      createPositionMessage(jsonMessage);
    } else if (Object.keys(jsonMessage).includes("analog")) {
      switch (jsonMessage.analog.port) {
        case "102":
          //102 = Temperature
          await createTemperatureMessage(jsonMessage);
          break;
        case "103":
          //103 = Voltage
          await createBatteryVoltageMessage(jsonMessage);
          break;
        case "112":
          //112 = Bateria ALPS
          let auxMessage = jsonMessage;
          auxMessage.analog.value = translateALPSBattery(auxMessage.analog.value);
          await createBatteryLevelMessage(auxMessage);

          break;
        case "114":
          //114 = Detector Switch
          await createSwitchButtonMessage(jsonMessage);
          break;
        case "200":
          //200 = Battery level
          await createBatteryLevelMessage(jsonMessage);
          break;
      }
    }
  }
};

const updateLastMessage = async (jsonMessage) => {};

/**
 * Create a position.
 * Example of a position message from WS:
    {
      type: 'utf8',
      utf8Data: '{"location":{"latitude":-23.2094,"longitude":-45.9517,"accuracy":32000.0},"src":"28422663","dst":"28422663","timestamp":1616637500,"historical":false}'
    }
 * @param {*} positionMessage 
 */
const createPositionMessage = async (positionMessage) => {
  await PositionController.createPosition(positionMessage);
};

/**
 * Create a temperature message.
 * Example of a temperature message from WS:
    {
      type: 'utf8',
      utf8Data: '{"analog":{"port":"102","value":20.0},"timestamp":1616637561,"src":4064451,"dst":4064451}'
    }
 * @param {*} temperatureMessage 
 */
const createTemperatureMessage = async (temperatureMessage) => {
  await TemperatureController.createTemperature(temperatureMessage);
};

/**
 * Create a battery message.
 * Battery Level and voltage level came in different messages. Example:
 *  // 104 = voltage; 200 = percentage
    {
      type: 'utf8',
      utf8Data: '{"analog":{"port":"104","value":3.328125},"timestamp":1616636910,"src":4080782,"dst":4080782}'
    },
    {
      type: 'utf8',
      utf8Data: '{"analog":{"port":"200","value":100},"timestamp":1616636910,"src":4080782,"dst":4080782}'
    }
 */
const createBatteryVoltageMessage = async (batteryMessage) => {
  await BatteryController.createBatteryVoltage(batteryMessage);
};

const createBatteryLevelMessage = async (batteryMessage) => {
  await BatteryController.createBatteryLevel(batteryMessage);
};

/**
 * TODO: analog message of switch button
 */
const createSwitchButtonMessage = async (buttonMessage) => {
  await ButtonController.createButton(buttonMessage);
};

const runWebSocket = async () => {
  // await getDeviceDictList();
  // await unsubscribingDeviceIds(deviceDictList);
  // await subscribingDeviceIds(deviceDictList);
  await initWebSocket();
};

//////////////////////////////////////////////////////////
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

exports.runWebSocket = runWebSocket;
