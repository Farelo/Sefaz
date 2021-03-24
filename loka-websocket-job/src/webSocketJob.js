process.setMaxListeners(0);
const config = require("config");
const logger = require("./config/winston.config");
const axios = require("axios");
const WebSocket = require("ws");
const { Packing } = require("./db/models/packings.model");
const Position = require("./db/models/position.model");
const Temperature = require("./db/models/temperature.model");
const Battery = require("./db/models/battery.model");
const { Message } = require("./db/models/message.model");
const { DeviceData, device_data_save } = require("./db/models/device_data.model");
const { parserMessage } = require("./util/parserMessage");

let wss = null;

// Getting Dict DevicesIds x last DeviceData
let deviceDictList;
async function getDeviceDictList() {
  logger.info("aqui");
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
    logger.info("id: " + deviceDict.deviceId);
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
        logger.info("GET result:\n" + d);
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
      logger.info(e);
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
    logger.info("id: " + deviceDict.deviceId);
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
        logger.info("GET result:\n" + d);
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
      logger.info(e);
      reject(e);
    });
  });
}

/**
 * Establishes a new websocket connection
 */
function initWebSocket() {
  const wss = new WebSocket(config("ws.host"), { headers: { Authorization: "Bearer " + config("ws.tokens") } });
  // client.connect(config("ws.host"), null, null, { Authorization: "Bearer " + config("ws.tokens") }, null);

  wss.on("connection", (ws) => {
    console.info("WebSocket client is connected");

    ws.on("message", (message) => {
      messageReceived(message);
    });

    ws.on("close", () => {
      console.log("stopping client");
    });

    ws.on("error", (message) => {
      console.log("error on trying to connect", message);
    });
  });
}

const messageReceived = (message) => {
  // console.log(`Received message => ${message}`)
  if (message.type === "utf8") {
    //Save message
    // Message.create({
    //    message: JSON.stringify(jsonMessage),
    //    message_date: new Date(jsonMessage.timestamp * 1000),
    //    device_id: jsonMessage.timestamp,
    // });

    let jsonMessage = JSON.parse(message.utf8Data);

    if (Object.keys(jsonMessage).includes("location")) {
      createPositionMessage(jsonMessage);
    } else if (Object.keys(jsonMessage).includes("analog")) {
      switch (jsonMessage.analog.port) {
        case "102":
          createTemperatureMessage();
          break;
        case "103":
          createBatteryMessage();
          break;
        case "200":
          createBatteryMessage();
          break;
      }
    }
  }
};

const createPositionMessage = async (positionMessage) => {
  let messageTimestamp = jsonMessage.timestamp;
  if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

  let newPosition = {
    tag: packing.tag.code,
    date: new Date(messageTimestamp),
    timestamp: messageTimestamp,
    latitude: positionMessage.location.latitude,
    longitude: positionMessage.location.latitude,
    accuracy: positionMessage.location.accuracy,
  };

  await Position.create(newPosition);
};

const createTemperatureMessage = async () => {
  // await Temperature.createMany()
};

const createBatteryMessage = async () => {
  // await Battery.createMany()
};

const runWebSocket = async () => {
  // await getDeviceDictList();
  // await unsubscribingDeviceIds(deviceDictList);
  // await subscribingDeviceIds(deviceDictList);
  await initWebSocket();
};

exports.runWebSocket = runWebSocket;
