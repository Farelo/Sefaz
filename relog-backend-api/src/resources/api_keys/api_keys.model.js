const debug = require("debug")("model:companies");
const mongoose = require("mongoose");
const Joi = require("joi");

const ApiKeySchema = new mongoose.Schema({
   key: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
   update_at: {
      type: Date,
      default: Date.now,
   },
});

ApiKeySchema.statics.findByKey = function (key, projection = "") {
   return this.findOne({ key }, projection);
};

ApiKeySchema.statics.findByName = function (name, projection = "") {
   return this.findOne({ name }, projection);
};

const validateApiKey = (apiKey) => {
   const schema = Joi.object().keys({
      key: Joi.string().min(2).max(200).required(),
      name: Joi.string().min(2).max(200).required(),
   });
   return Joi.validate(apiKey, schema, { abortEarly: false });
};

const updateCallback = function (next) {
   let update = this.getUpdate();
   update.update_at = new Date();
   next();
};

ApiKeySchema.pre("update", updateCallback);
ApiKeySchema.pre("findOneAndUpdate", updateCallback);

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

exports.ApiKey = ApiKey;
exports.ApiKeySchema = ApiKeySchema;
exports.validateApiKey = validateApiKey;
