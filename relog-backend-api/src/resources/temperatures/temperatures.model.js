const debug = require("debug")("model:temperature");
const mongoose = require("mongoose");
const { Packing } = require("../packings/packings.model");

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

temperatureSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Temperature = mongoose.model("Temperature", temperatureSchema);

exports.Temperature = Temperature;
exports.temperatureSchema = temperatureSchema; 
