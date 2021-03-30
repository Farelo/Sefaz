const { Button } = require("../db/models/button.model");
const { Packing } = require("../db/models/packings.model");

exports.createButton = async (buttonMessage) => {
  let actualPacking = await Packing.findOne({ "tag.code": buttonMessage.src });

  if (actualPacking) {
    let messageTimestamp = buttonMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualPacking, messageTimestamp);

    await Button.createButton(
      {
        tag: buttonMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        detector_switch: !!buttonMessage.analog.value
      },
      actualPacking
    );
  }
};

exports.createButtonFromNetworkInformation = async (buttonMessage) => {
  let actualPacking = await Packing.findOne({ "tag.code": buttonMessage.src });

  if (actualPacking) {
    let messageTimestamp = buttonMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    // updateLastMessage(actualPacking, messageTimestamp);

    await Button.createButton(
      {
        tag: buttonMessage.src,
        timestamp: buttonMessage.timestamp,
        date: new Date(buttonMessage.timestamp * 1000),
        detector_switch: true,
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
