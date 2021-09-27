const debug = require("debug")("model:temperature");
const mongoose = require("mongoose");
const { Rack } = require("./racks.model");

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

temperatureSchema.statics.createTemperature = async (temperature, rack = null) => {
  let actualRack = null;

  if (!rack) actualRack = await Rack.findOne({ "tag.code": temperature.tag });
  else actualRack = rack;

  let newTemperature = new Temperature({
    tag: temperature.tag,
    date: temperature.date,
    timestamp: temperature.timestamp,
    value: temperature.value,
  });

  try {
    await newTemperature
      .save()
      .then((newDocument) => referenceFromPackage(actualRack, newDocument))
      .catch((error) => debug(error));
  } catch (error) {
    console.log(error);
  }
};

const referenceFromPackage = async (rack, temperature) => {
  try {
    if (rack)
      await Rack.findByIdAndUpdate(rack._id, { last_temperature: temperature._id }, { new: true }).exec();
  } catch (error) {
    debug(error);
  }
};

temperatureSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Temperature = mongoose.model("Temperature", temperatureSchema);

exports.Temperature = Temperature;
exports.temperatureSchema = temperatureSchema;
