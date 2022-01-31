const debug = require("debug")("model:integrations");
const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");
const Joi = require("joi");

const cicleSchema = new mongoose.Schema({

  id_rack: {
    type: mongoose.Schema.ObjectId,
    ref: "Rack",
    required: true,
  },
  control_point_destiny: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ControlPoint",
 },
  control_point_origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ControlPoint",
 },
  start_date: {
    type: Date,
    default: null,
  },
  end_date: {
    type: Date,
    
  },
});

const validate_cicles = (cicle) => {
  const schema = Joi.object().keys({

    id_rack: Joi.objectId().required(),
    control_point_destiny: Joi.string().min(2).max(30),
    start_date: Joi.date(),
    end_date: Joi.date(),
  });

  return Joi.validate(cicle, schema, { abortEarly: false });
};

cicleSchema.statics.findById = function (id, projection = "") {
  return this.findOne({ id }, projection);
};



const update_rack = async (cicles, next) => {
  try {
    await Rack.findByIdAndUpdate(
      cicless.id_rack,
      { last_cicle_record: cicles._id },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
};

cicleSchema.statics.findByRack = function (rack_id, projection = "") {
  return this.find({ rack: rack_id }, projection).sort({ created_at: -1 });
};

const saveCicleRecordToRack = function (doc, next) {
  update_rack(doc, next);
};

const update_updated_at_middleware = function (next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

cicleSchema.post("save", saveCicleRecordToRack);
cicleSchema.pre("update", update_updated_at_middleware);
cicleSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const Cicle = mongoose.model("Cicle", cicleSchema);

exports.Cicle = Cicle;
exports.cicleSchema = cicleSchema;
exports.validate_cicles = validate_cicles;
