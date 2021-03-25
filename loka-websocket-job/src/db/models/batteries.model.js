const debug = require("debug")("model:battery");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

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
 * Creates a new Battery document and links to the packing
 * @param {*} battery
 * @param {*} actualPacking
 */
const createBattery = async (battery, actualPacking = null) => {
  if (!actualPacking) {
    actualPacking = await Packing.findOne({ "tag.code": battery.tag });
  }

  let newBattery = new Battery({
    tag: actualPacking.tag,
    date: new Date(battery.date),
    timestamp: battery.timestamp,
    battery: battery.battery,
    batteryVoltage: battery.batteryVoltage,
  });

  await newBattery
    .save()
    .then((newDocument) => referenceFromPackage(actualPacking, newDocument))
    .catch((error) => debug(error));
};

const createOrUpdateBattery = async (battery, actualPacking = null) => {
  if (!actualPacking) {
    actualPacking = await Packing.findOne({ "tag.code": battery.tag });
  }

  let newBattery = new Battery({
    tag: actualPacking.tag,
    date: new Date(battery.date),
    timestamp: battery.timestamp,
    battery: battery.battery,
    batteryVoltage: battery.batteryVoltage,
  });

  await newBattery
    .save()
    .then((newDocument) => referenceFromPackage(actualPacking, newDocument))
    .catch((error) => debug(error));
};

const referenceFromPackage = async (packing, position) => {
  try {
    if (packing) await Packing.findByIdAndUpdate(packing._id, { last_battery: position._id }, { new: true });
  } catch (error) {
    debug(error);
  }
};

batterySchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Battery = mongoose.model("Battery", batterySchema);

exports.Battery = Battery;
exports.createBattery = createBattery;
exports.batterySchema = batterySchema;
