const debug = require("debug")("model:integrations");
const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");
const Joi = require("joi");

const integrationSchema = new mongoose.Schema({
  id_engine_type: {
    type: mongoose.Schema.ObjectId,
    ref: "EngineType",
    required: true,
  },
  serial: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  serial2: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  fabrication_date: {
    type: Date,
  },
  family: {
    type: mongoose.Schema.ObjectId,
    ref: "Family",
    required: true,
  },
  id_rack: {
    type: mongoose.Schema.ObjectId,
    ref: "Rack",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  integration_date: {
    type: Date,
    default: Date.now,
  },
  Detach_integration_date: {
    type: Date,
    
  },
});

const validate_integrations = (integration) => {
  const schema = Joi.object().keys({
    id_engine_type: Joi.objectId().required(),
    serial: Joi.string().min(2).max(30).required(),
    serial2: Joi.string().min(2).max(30).required(),
    fabrication_date: Joi.date(),
    family: Joi.objectId().required(),
    id_rack: Joi.objectId().required(),
    active: Joi.boolean(),
    integration_date: Joi.date(),
  });

  return Joi.validate(integration, schema, { abortEarly: false });
};

integrationSchema.statics.findById = function (id, projection = "") {
  return this.findOne({ id }, projection);
};



const update_rack = async (integrations, next) => {
  try {
    await Rack.findByIdAndUpdate(
      integrations.id_rack,
      { last_integration_record: integrations._id },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
};

const saveIntegrationRecordToRack = function (doc, next) {
  update_rack(doc, next);
};

const update_updated_at_middleware = function (next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

integrationSchema.post("save", saveIntegrationRecordToRack);
integrationSchema.pre("update", update_updated_at_middleware);
integrationSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const Integration = mongoose.model("Integration", integrationSchema);

exports.Integration = Integration;
exports.integrationSchema = integrationSchema;
exports.validate_integrations = validate_integrations;
