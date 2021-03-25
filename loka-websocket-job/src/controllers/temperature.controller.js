const Temperature = require("../db/models/temperatures.model");

exports.createTemperature = async (temperatureMessage) => {
  let messageTimestamp = temperatureMessage.timestamp;
  if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

  await Temperature.createTemperature({
    tag: temperatureMessage.src,
    date: new Date(messageTimestamp * 1000),
    timestamp: messageTimestamp,
    value: temperatureMessage.analog.value,
  });
};

// exports.createTemperature = createTemperature;
