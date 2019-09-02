const logger = require("../config/winston.config");

const parserMessage = async (jsonMessage, deviceData) => {
  logger.info("DeviceData to update BEFORE parser: " + deviceData);

  let [key] = Object.keys(jsonMessage);
  logger.info("Message type: " + key);
  console.log("MESSAGE");
  console.log(jsonMessage);
  console.log("ANTES");
  console.log(deviceData);
  deviceData.message_type = key;
  deviceData.last_communication = new Date(
    deviceData.message_date_timestamp * 1000
  );
  deviceData.last_communication_timestamp = deviceData.message_date_timestamp;
  deviceData.message_date = new Date(jsonMessage.timestamp * 1000);
  deviceData.message_date_timestamp = jsonMessage.timestamp;
  deviceData.message = JSON.stringify(jsonMessage);
  console.log("Depois");
  console.log(deviceData);
  const {
    location: { latitude, longitude, accuracy },
    analog: { port, value }
  } = jsonMessage;
  switch (key) {
    case "location":
      deviceData.latitude = latitude;
      deviceData.longitude = longitude;
      deviceData.accuracy = accuracy;
      break;
    case "analog":
      switch (port) {
        case "102":
          deviceData.temperature = value;
          break;
        case "103":
          deviceData.battery.voltage = value;
          break;
        case "200":
          deviceData.battery.percentage = value;
          break;
      }
      break;
    case "networkInformation":
      deviceData.seq_number = jsonMessage.networkInformation.sequenceNumber;
      break;
  }

  logger.info("DeviceData to update AFTER parser: " + deviceData);

  return deviceData;
};

exports.parserMessage = parserMessage;
