const logger = require("../config/winston.config");
const moment = require('moment')

const parserMessage = async (jsonMessage, deviceData) => {
  //logger.info("DeviceData to update BEFORE parser: " + deviceData);

  let key = Object.keys(jsonMessage)[0];
  //logger.info("Message type: " + key);

  deviceData.message_type = key;
  deviceData.last_communication = new Date(
    deviceData.message_date_timestamp * 1000
  );
  deviceData.last_communication_timestamp = deviceData.message_date_timestamp;
  deviceData.message_date = new Date(moment(jsonMessage.timestamp * 1000).subtract(3, 'h'))
  deviceData.message_date_timestamp = jsonMessage.timestamp;
  deviceData.message = JSON.stringify(jsonMessage);

  switch (key) {
    case "location":
      deviceData.latitude = jsonMessage.location.latitude;
      deviceData.longitude = jsonMessage.location.longitude;
      deviceData.accuracy = jsonMessage.location.accuracy;
      break;
    case "analog":
      let port = jsonMessage.analog.port;
      switch (port) {
        case "102":
          deviceData.temperature = jsonMessage.analog.value;
          break;
        case "103":
          deviceData.battery.voltage = jsonMessage.analog.value;
          break;
        case "200":
          deviceData.battery.percentage = jsonMessage.analog.value;
          break;
      }
      break;
    default:
      deviceData = null;
  }

  //logger.info("DeviceData to update AFTER parser: " + deviceData);

  return deviceData;
};

exports.parserMessage = parserMessage;
