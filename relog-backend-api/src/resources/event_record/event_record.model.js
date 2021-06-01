const debug = require("debug")("model:control_points");
const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");

const eventRecordSchema = new mongoose.Schema({
   rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rack",
   },
   control_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ControlPoint",
   },
   distance_km: {
      type: Number,
      default: 0,
   },
   accuracy: {
      type: Number,
      default: 0,
   },
   type: {
      type: String,
      required: true,
      enum: ["inbound", "outbound"],
      lowercase: true,
      trim: true,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
   update_at: {
      type: Date,
      default: Date.now,
   },
   device_data_id: {
      type: mongoose.Schema.Types,
      ref: "DeviceData",
   },
   position: {
      type: mongoose.Schema.Types,
      ref: "DeviceData",
   },
});

const update_rack = async (event_record, next) => {
   try {
      await Rack.findByIdAndUpdate(event_record.rack, { last_event_record: event_record._id }, { new: true });
      next();
   } catch (error) {
      next(error);
   }
};

eventRecordSchema.statics.findByRack = function (rack_id, projection = "") {
   return this.find({ rack: rack_id }, projection).sort({ created_at: -1 });
};

const saveEventRecordToRack = function (doc, next) {
   update_rack(doc, next);
};

const update_updated_at_middleware = function (next) {
   let update = this.getUpdate();
   update.update_at = new Date();
   next();
};

eventRecordSchema.post("save", saveEventRecordToRack);
eventRecordSchema.pre("update", update_updated_at_middleware);
eventRecordSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const EventRecord = mongoose.model("EventRecord", eventRecordSchema);

exports.EventRecord = EventRecord;
exports.eventRecordSchema = eventRecordSchema;
