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

var lastMessageTime = new Date().getTime();
var limitTimeWithoutMessageMinutes = 1;

//Authentication Token
//Token of DM
var token = "c8f16c13-f85c-48e9-bfc4-5fe54ae89429";

// Getting Dict DevicesIds x last DeviceData
let deviceDictList;

/**
 * Gets all the device list and create the dicionary of device data:
 * [{deviceId, lastDeviceData}]
 */
async function getDeviceDictList() {
  logger.info("aqui");
  await require("./db/db")();

  //logger.info("Getting Dict DevicesIds x last DeviceData");

  //Getting all DeviceIds
  let result = await Packing.find({'tag.code': '4071692'}, { _id: 0, tag: 1 })
    .populate("last_device_data")
    .then(packFind => {

      let packMapped = packFind
        .filter(packFilter => {
          return packFilter.tag.code != undefined;
        })
<<<<<<< HEAD
          .sort({ message_date_timestamp: -1 })
          .limit(1)
          .then(resultFind => {
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
              voltage: null
            },
            message: null
          };
        }
=======
        .map(async packMap => {
          
          let lastDeviceData = packMap.last_device_data;

          //Get last deviceData from DB
          // let lastDeviceData = await DeviceData.find({
          //   device_id: packMap.tag.code
          // })
          //   .sort({ _id: -1 })
          //   .limit(1)
          //   .then(resultFind => {
          //     return resultFind[0];
          //   });

          //Get last deviceData from mock empty
          if (lastDeviceData == null || lastDeviceData == undefined) {
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
>>>>>>> feature/fix-ws

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
      headers: { Authorization: "Bearer " + token }
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

// Start and manage the WebSocket
function initWebSocket() {
<<<<<<< HEAD
  client.on("connectFailed", async function(error) {
    logger.info("WebSocket Connect Failed: " + error.toString());
    await restartAfterMinutes(15);
=======
  client.on("connectFailed", function (error) {
    //logger.info("WebSocket Connect Failed: " + error.toString());
>>>>>>> feature/fix-ws
  });

  client.on("connect", function (connection) {
    logger.info("WebSocket Client Connected");

<<<<<<< HEAD
    connection.on("error", async function(error) {
=======
    connection.on("error", function (error) {
>>>>>>> feature/fix-ws
      logger.info("WebSocket Connection Error: " + error.toString());
      await restartAfterMinutes(10);
    });

<<<<<<< HEAD
    connection.on("close", async function() {
=======
    connection.on("close", function () {
>>>>>>> feature/fix-ws
      connection.removeAllListeners();
      logger.info("WebSocket Echo-protocol Connection Closed");
      await restartAfterMinutes(10);
    });

<<<<<<< HEAD
    connection.on("message", async function(message) {
      //console.log("message");
=======
    connection.on("message", async function (message) {
>>>>>>> feature/fix-ws
      if (message.type === "utf8") {
        if (
          !message.utf8Data.includes("java") &&
          !message.utf8Data.includes("exception")
        ) {
          //lastMessageTime = new Date().getTime();
          //logger.info("WebSocket Received: '" + message.utf8Data + "'");

          let jsonMessage = JSON.parse(message.utf8Data);

          //Save message
          messageCollection = {
            message: JSON.stringify(jsonMessage),
            message_date: new Date(jsonMessage.timestamp * 1000)
          };
          Message.create(messageCollection);

<<<<<<< HEAD
          let deviceDict = deviceDictList.find(function(elem) {
            return elem.deviceId == jsonMessage.src;
          });
=======
        let deviceDict = deviceDictList.find(function (elem) {
          return elem.deviceId == jsonMessage.src;
        });
>>>>>>> feature/fix-ws

          if (deviceDict) {
            let deviceData = deviceDict.lastDeviceData;

            let deviceDataToSave = await parserMessage(jsonMessage, deviceData);
            if (deviceDataToSave !== null) {
              await device_data_save(deviceDataToSave);
              deviceData = deviceDataToSave;
            }
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
  logger.info("Starting WS");
  await getDeviceDictList();
<<<<<<< HEAD
  await unsubscribingDeviceIds(deviceDictList);
  await subscribingDeviceIds(deviceDictList);
  await initWebSocket();
=======
  logger.info(deviceDictList);
  // await unsubscribingDeviceIds(deviceDictList);
  // await subscribingDeviceIds(deviceDictList);
  // await initWebSocket();
>>>>>>> feature/fix-ws
};

const restartAfterMinutes = async minutes => {
  logger.info("Waiting " + minutes + " minutes to restart the connection");
  client.abort();

  //console.log("aborted");

  await promise_wait(minutes);
  //console.log("RUN");

  await runWS();
};

const promise_wait = async minutes => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Aguardou ${minutes} minutos");
    }, minutes * 1000 * 60);
  });
};

//Check inactive time to restart
setInterval(async function() {
  //console.log("SET INTERVAL");
  //console.log("lastMessageTime " + lastMessageTime);
  var actualDate = new Date().getTime();
  var diff = actualDate - lastMessageTime;
  //console.log("diff " + diff);

  var diffMs = diff; // milliseconds between now & Christmas
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  //console.log("diffMins " + diffMins);
  if (diffMins >= limitTimeWithoutMessageMinutes) {
    //console.log("RESTARTING");
    lastMessageTime = actualDate;

    await restartAfterMinutes(2);
  }
}, limitTimeWithoutMessageMinutes * 60000);

exports.runWS = runWS;
