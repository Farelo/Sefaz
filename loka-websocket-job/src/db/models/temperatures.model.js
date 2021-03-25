const debug = require("debug")("model:temperature");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

const temperatureSchema = new mongoose.Schema({
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
  value: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const create = async (temperature, actualPacking = null) => {
  if (!actualPacking) {
    actualPacking = await Packing.findOne({ "tag.code": temperature.tag });
  }

  let newTemperature = new Temperature({
    tag: actualPacking.tag,
    date: new Date(temperature.date),
    timestamp: temperature.timestamp,
    value: temperature.value,
  });

  await newTemperature
    .save()
    .then((newDocument) => referenceFromPackage(actualPacking, newDocument))
    .catch((error) => debug(error));
};

const referenceFromPackage = async (packing, temperature) => {
  try {
    if (packing) await Packing.findByIdAndUpdate(packing._id, { last_temperature: temperature._id }, { new: true });
  } catch (error) {
    debug(error);
  }
};

temperatureSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Temperature = mongoose.model("Temperature", temperatureSchema);

exports.Temperature = Temperature;
exports.temperatureSchema = temperatureSchema;
exports.create = create;
