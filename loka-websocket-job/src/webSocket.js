process.setMaxListeners(0);
const logger = require("./config/winston.config");
var https = require("https");
var WebSocketClient = require("websocket").client;
var client = new WebSocketClient();
const { Packing } = require("./db/models/packings.model");
const { Message } = require("./db/models/message.model");

const {
  DeviceData,
  device_data_save
} = require("./db/models/device_data.model");
const { parserMessage } = require("./util/parserMessage");

//Authentication Token
//Token of DM
var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

// Getting Dict DevicesIds x last DeviceData
let deviceDictList;
async function getDeviceDictList() {
  logger.info("aqui");
  await require("./db/db")();

  //logger.info("Getting Dict DevicesIds x last DeviceData");

  //Getting all DeviceIds
  let result = await Packing.find({}, { _id: 0, tag: 1 }).then(packFind => {
    let packMapped = packFind
      .filter(packFilter => {
        return packFilter.tag.code != undefined;
      })
      .map(async packMap => {
        //Get last deviceData from DB
        logger.info("here");
        let lastDeviceData = await DeviceData.find({
          device_id: packMap.tag.code
        })
          .sort({ _id: -1 })
          .limit(1)
          .then(resultFind => {
            return resultFind[0];
          });
        logger.info(lastDeviceData);

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
              voltage: null
            },
            message: null
          };
        }
        logger.info(lastDeviceData);

        let dict = {
          deviceId: packMap.tag.code,
          lastDeviceData: lastDeviceData
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
    console.log(deviceDict);
    //deviceDictList.forEach(async deviceDict => {
    //logger.info("Subscribing device with id " + deviceDict.deviceId);
    var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/subscribe_terminal/" + deviceDict.deviceId,
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    };

    // do the GET request
    logger.info("id: " + deviceDict.deviceId);
    await requestUrl(optionsget);
    //});
  }
}
function requestUrl(optionsget) {
  return new Promise((resolve, reject) => {
    var reqGet = https.request(optionsget, function(res) {
      /*logger.info(
        "Response code on subscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          res.statusCode
      );*/
      res.on("data", function(d) {
        logger.info("GET result:\n" + d);
        resolve(d);
      });
    });

    reqGet.end();
    reqGet.on("error", function(e) {
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
  //logger.info("Unsubscribing Devices in Websocket");

  deviceDictList.forEach(async deviceDict => {
    //logger.info("Unsubscribing device with id " + deviceDict.deviceId);
    var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/unsubscribe_terminal/" + deviceDict.deviceId,
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    };

    // do the GET request
    var reqGet = https.request(optionsget, function(res) {
      /*logger.info(
        "Response code on Unsubscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          res.statusCode
      );*/
      res.on("data", function(d) {
        logger.info("GET result:\n" + d);
      });
    });

    reqGet.end();
    reqGet.on("error", function(e) {
      /*logger.info(
        "Error on Unsubscribing of device with id " +
          deviceDict.deviceId +
          ": " +
          e
      );*/
      logger.info(e);
    });
  });
}

// Start and manage the WebSocket
function initWebSocket() {
  client.on("connectFailed", function(error) {
    //logger.info("WebSocket Connect Failed: " + error.toString());
  });

  client.on("connect", function(connection) {
    logger.info("WebSocket Client Connected");

    connection.on("error", function(error) {
      logger.info("WebSocket Connection Error: " + error.toString());
      initWebSocket();
    });

    connection.on("close", function() {
      connection.removeAllListeners();
      logger.info("WebSocket Echo-protocol Connection Closed");
      initWebSocket();
    });

    connection.on("message", async function(message) {
      if (message.type === "utf8") {
        //logger.info("WebSocket Received: '" + message.utf8Data + "'");
        console.log(message);
        let jsonMessage = JSON.parse(message.utf8Data);

        //Save message
        messageCollection = {
          message: JSON.stringify(jsonMessage),
          message_date: new Date(jsonMessage.timestamp * 1000)
        };
        logger.info(messageCollection);
        Message.create(messageCollection);

        let deviceDict = deviceDictList.find(function(elem) {
          return elem.deviceId == jsonMessage.src;
        });

        if (deviceDict) {
          let deviceData = deviceDict.lastDeviceData;

          let deviceDataToSave = await parserMessage(jsonMessage, deviceData);
          if (deviceDataToSave !== null) {
            await device_data_save(deviceDataToSave);
            deviceData = deviceDataToSave;
            console.log("deviceData");
            console.log(deviceData);
          }
        }
      }
    });
  });

  client.connect(
    "wss://core.loka.systems/messages",
    null,
    null,
    { Authorization: "Bearer " + token },
    null
  );
}

const runWS = async () => {
  await getDeviceDictList();
  logger.info(deviceDictList);
  //await subscribingDeviceIds(deviceDictList);
  //await unsubscribingDeviceIds(deviceDictList);
  //await initWebSocket();
};

exports.runWS = runWS;
