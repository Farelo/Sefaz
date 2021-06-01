const debug = require("debug")("model:battery");
const mongoose = require("mongoose");
const { Rack } = require("./racks.model");

const batterySchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  battery: {
    type: Number,
  },
  batteryVoltage: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Creates a new Battery document and links to the rack
 * @param {*} battery
 * @param {*} actualRack
 */
const createBattery = async (battery, actualRack = null) => {
  if (!actualRack) {
    actualRack = await Rack.findOne({ "tag.code": battery.tag });
  }

  let newBattery = new Battery({
    tag: actualRack.tag,
    date: new Date(battery.date),
    timestamp: battery.timestamp,
    battery: battery.battery,
    batteryVoltage: battery.batteryVoltage,
  });

  await newBattery
    .save()
    .then((newDocument) => referenceFromPackage(actualRack, newDocument))
    .catch((error) => debug(error));
};

const createOrUpdateBattery = async (battery, actualRack = null) => {
  if (!actualRack) {
    actualRack = await Rack.findOne({ "tag.code": battery.tag });
  }

  let newBattery = new Battery({
    tag: actualRack.tag,
    date: new Date(battery.date),
    timestamp: battery.timestamp,
    battery: battery.battery,
    batteryVoltage: battery.batteryVoltage,
  });

  await newBattery
    .save()
    .then((newDocument) => referenceFromPackage(actualRack, newDocument))
    .catch((error) => debug(error));
};

const referenceFromPackage = async (rack, position) => {
  try {
    if (rack) await Rack.findByIdAndUpdate(rack._id, { last_battery: position._id }, { new: true });
  } catch (error) {
    debug(error);
  }
};

batterySchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Battery = mongoose.model("Battery", batterySchema);

exports.Battery = Battery;
exports.createBattery = createBattery;
exports.batterySchema = batterySchema;
