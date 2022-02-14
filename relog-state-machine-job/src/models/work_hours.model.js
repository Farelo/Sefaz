const debug = require("debug")("model:control_points");
const mongoose = require("mongoose");
const { Rack } = require("./racks.model");

const workHourSchema = new mongoose.Schema({
   id_rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rack",
   },
   current_control_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ControlPoint",
   },
   work_start: {
      type: Date,
      default: null
  },
  work_end: {
      type: Date,
      default: null
  },
  last_work_duration: {
      type: Number,
      default: 0
  },
  total_work_duration: {
   type: Number,
   default: 0
},
});


const update_rack = async (work_hours, next) => {
   try {
      await Rack.findByIdAndUpdate(work_hours.rack, { last_work_hours: work_hours._id }, { new: true });
      next();
   } catch (error) {
      next(error);
   }
};

workHourSchema.statics.findByRack = function (rack_id, projection = "") {
   return this.find({ rack: rack_id }, projection).sort({ created_at: -1 });
};

const saveWorkHourToRack = function (doc, next) {
   update_rack(doc, next);
};

const update_updated_at_middleware = function (next) {
   let update = this.getUpdate();
   update.update_at = new Date();
   next();
};

workHourSchema.post("save", saveWorkHourToRack);
workHourSchema.pre("update", update_updated_at_middleware);
workHourSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const WorkHour = mongoose.model("WorkHour", workHourSchema);

exports.WorkHour = WorkHour
exports.workHourSchema = workHourSchema;

