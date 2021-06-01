const { Position } = require("../db/models/position.model");
const { Rack } = require("../db/models/racks.model");

exports.createPosition = async (positionMessage) => {
  let actualRack = await Rack.findOne({ "tag.code": positionMessage.src });

  if (actualRack) {
    let messageTimestamp = positionMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualRack, messageTimestamp);

    await Position.createPosition(
      {
        tag: positionMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        latitude: positionMessage.location.latitude,
        longitude: positionMessage.location.longitude,
        accuracy: positionMessage.location.accuracy,
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
