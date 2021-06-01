const debug = require("debug")("model:battery");
const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");

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

batterySchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Battery = mongoose.model("Battery", batterySchema);

exports.Battery = Battery;
exports.batterySchema = batterySchema;
