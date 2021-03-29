const { Battery } = require("../db/models/batteries.model");
const { Packing } = require("../db/models/packings.model");

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
  ).exec();
};

exports.createBatteryLevel = async (batteryMessage) => {
  let actualPacking = await Packing.findOne({ "tag.code": batteryMessage.src });

  if (actualPacking) {
    let messageTimestamp = batteryMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualPacking, messageTimestamp);

    console.log(batteryMessage);
    
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
      async (err, newDoc) => {
        //An error occured
        if (err) {
          if (err.code == 11000) {
            //Try to upsert the battery again
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
                try {
                  //Proceed to update the packing.last_battery
                  await Packing.findOneAndUpdate(
                    { "tag.code": newDoc.tag },
                    { last_battery: newDoc._id },
                    { new: true }
                  ).exec();
                } catch (error) {}
              }
            );
          }
        }

        //Proceed to update the packing.last_battery
        await Packing.findOneAndUpdate({ "tag.code": newDoc.tag }, { last_battery: newDoc._id }, { new: true }).exec();
      }
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
