const { Position } = require("../db/models/position.model");
const { Packing } = require("../db/models/packings.model");

exports.createPosition = async (positionMessage) => {
  let actualPacking = await Packing.findOne({ "tag.code": positionMessage.src });

  if (actualPacking) {
    let messageTimestamp = positionMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualPacking, messageTimestamp);

    await Position.createPosition(
      {
        tag: positionMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        latitude: positionMessage.location.latitude,
        longitude: positionMessage.location.latitude,
        accuracy: positionMessage.location.accuracy,
      },
      actualPacking
    );
  }
};

const updateLastMessage = async (actualPacking, timestamp) => {
  if (actualPacking.last_message_signal) {
    if (timestamp * 1000 > new Date(actualPacking.last_message_signal).getTime()) {
      await Packing.findByIdAndUpdate(
        actualPacking._id,
        { last_message_signal: new Date(timestamp * 1000) },
        { new: true }
      ).exec();
    }
  } else {
    await Packing.findByIdAndUpdate(
      actualPacking._id,
      { last_message_signal: new Date(timestamp * 1000) },
      { new: true }
    ).exec();
  }
};
