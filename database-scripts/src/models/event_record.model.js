const debug = require("debug")("model:control_points");
const mongoose = require("mongoose");

const eventRecordSchema = new mongoose.Schema({
  packing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Packing"
  },
  control_point: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ControlPoint"
  },
  distance_km: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    required: true,
    enum: ["inbound", "outbound"],
    lowercase: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  },
  device_data_id: {
    type: mongoose.Schema.Types,
    ref: "DeviceData"
  }
});

const EventRecord = mongoose.model("EventRecord", eventRecordSchema);

exports.EventRecord = EventRecord;
exports.eventRecordSchema = eventRecordSchema;
