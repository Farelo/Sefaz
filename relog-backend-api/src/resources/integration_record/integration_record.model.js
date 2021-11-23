const debug = require("debug")("model:control_points");
const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");


const integrationRecordSchema = new mongoose.Schema({
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
      type: mongoose.Schema.integration_date,
      ref:"Integration",
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

integrationRecordSchema.statics.findByRack = function (rack_id, projection = "") {
   return this.find({ rack: rack_id }, projection).sort({ created_at: -1 });
};

const update_updated_at_middleware = function (next) {
   let update = this.getUpdate();
   update.update_at = new Date();
   next();
};

integrationRecordSchema.pre("update", update_updated_at_middleware);
integrationRecordSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const IntegrationRecord = mongoose.model("IntegrationRecord", integrationRecordSchema);

exports.IntegrationRecord = IntegrationRecord;
exports.integrationRecordSchema = integrationRecordSchema;
