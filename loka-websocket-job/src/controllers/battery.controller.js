const { Battery } = require("../db/models/batteries.model");

exports.createBatteryVoltage = async (batteryMessage) => {
  let messageTimestamp = batteryMessage.timestamp;
  if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

  await Battery.findOneAndUpdate(
    { tag: batteryMessage.src, timestamp: messageTimestamp },
    {
      tag: batteryMessage.src,
      date: new Date(messageTimestamp * 1000),
      timestamp: messageTimestamp,
      batteryVoltage: batteryMessage.analog.value,
    },
    {
      new: true,
      upsert: true,
    }
  );
};

exports.createBatteryLevel = async (batteryMessage) => {
  let messageTimestamp = batteryMessage.timestamp;
  if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

  await Battery.findOneAndUpdate(
    { tag: batteryMessage.src, timestamp: messageTimestamp },
    {
      tag: batteryMessage.src,
      date: new Date(messageTimestamp * 1000),
      timestamp: messageTimestamp,
      battery: batteryMessage.analog.value,
    },
    {
      new: true,
      upsert: true,
    },
    async (newDoc) => {
      let actualPacking = await Packing.findOne({ "tag.code": battery.tag });
      if (actualPacking) await Packing.findByIdAndUpdate(packing._id, { last_battery: position._id }, { new: true });
    }
  );
};
