const Position = require("../db/models/position.model");

exports.createPosition = async (positionMessage) => {
  console.log(positionMessage);
  
  let messageTimestamp = positionMessage.timestamp;
  if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

  await Position.createPosition({
    tag: positionMessage.src,
    date: new Date(messageTimestamp * 1000),
    timestamp: messageTimestamp,
    latitude: positionMessage.location.latitude,
    longitude: positionMessage.location.latitude,
    accuracy: positionMessage.location.accuracy,
  });
};
