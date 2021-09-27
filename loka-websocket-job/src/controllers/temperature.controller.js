const { Temperature } = require("../db/models/temperatures.model");
const { Rack } = require("../db/models/racks.model");

exports.createTemperature = async (temperatureMessage) => {
  let actualRack = await Rack.findOne({ "tag.code": temperatureMessage.src });

  if (actualRack) {
    let messageTimestamp = temperatureMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualRack, messageTimestamp);

    await Temperature.createTemperature(
      {
        tag: temperatureMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        value: temperatureMessage.analog.value,
      },
      actualRack
    );
  }
};

const updateLastMessage = async (actualRack, timestamp) => {
  if (actualRack.last_message_signal) {
    if (timestamp * 1000 > new Date(actualRack.last_message_signal).getTime()) {
      await Rack.findByIdAndUpdate(
        actualRack._id,
        { last_message_signal: new Date(timestamp * 1000) },
        { new: true }
      ).exec();
    }
  } else {
    await Rack.findByIdAndUpdate(
      actualRack._id,
      { last_message_signal: new Date(timestamp * 1000) },
      { new: true }
    ).exec();
  }
};
