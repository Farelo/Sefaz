const debug = require("debug")("model:positions");
const mongoose = require("mongoose");
const { Packing } = require("../packings/packings.model");

const positionSchema = new mongoose.Schema({
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
   last_communication: {
      type: Date,
   },
   last_communication_timestamp: {
      type: Number,
   },
   latitude: {
      type: Number,
   },
   longitude: {
      type: Number,
   },
   accuracy: {
      type: Number,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

positionSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const Position = mongoose.model("Position", positionSchema);

exports.Position = Position;
exports.positionSchema = positionSchema; 
