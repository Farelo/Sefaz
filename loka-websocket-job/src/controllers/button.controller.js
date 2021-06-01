const { Button } = require("../db/models/button.model");
const { Rack } = require("../db/models/racks.model");

exports.createButton = async (buttonMessage) => {
  let actualRack = await Rack.findOne({ "tag.code": buttonMessage.src });

  if (actualRack) {
    let messageTimestamp = buttonMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualRack, messageTimestamp);

    await Button.createButton(
      {
        tag: buttonMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        detector_switch: !!buttonMessage.analog.value
      },
      actualRack
    );
  }
};

exports.createButtonFromNetworkInformation = async (buttonMessage) => {
  let actualRack = await Rack.findOne({ "tag.code": buttonMessage.src });

  if (actualRack) {
    let messageTimestamp = buttonMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    // updateLastMessage(actualRack, messageTimestamp);

    await Button.createButton(
      {
        tag: buttonMessage.src,
        timestamp: buttonMessage.timestamp,
        date: new Date(buttonMessage.timestamp * 1000),
        detector_switch: true,
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
