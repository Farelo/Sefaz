const debug = require("debug")("model:control_points");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

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

const update_packing = async (event_record, next) => {
  try {
    await Packing.findByIdAndUpdate(
      event_record.packing,
      { last_event_record: event_record._id },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
};

eventRecordSchema.statics.findByPacking = function(
  packing_id,
  projection = ""
) {
  return this.find({ packing: packing_id }, projection).sort({
    created_at: -1
  });
};

const saveEventRecordToPacking = function(doc, next) {
  update_packing(doc, next);
};

const update_updated_at_middleware = function(next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

eventRecordSchema.post("save", saveEventRecordToPacking);
eventRecordSchema.pre("update", update_updated_at_middleware);
eventRecordSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const EventRecord = mongoose.model("EventRecord", eventRecordSchema);

exports.EventRecord = EventRecord;
exports.eventRecordSchema = eventRecordSchema;
