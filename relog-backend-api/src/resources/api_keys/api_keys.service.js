const debug = require("debug")("service:apiKeys");
const _ = require("lodash");
const { ApiKey } = require("./api_keys.model");

exports.getApiKeys = async (id) => {
   try {
      let apiKeys = {};
      if (id) {
         apiKeys = await ApiKey.findById(id).populate("users", ["_id", "email", "role", "active"]);
      } else {
         apiKeys = await ApiKey.find({}).populate("users", ["_id", "email", "role", "active"]);
      }
      return apiKeys;
   } catch (error) {
      throw new Error(error);
   }
};

exports.createApiKeys = async (apiKey) => {
   try {
      const apiKeys = new ApiKey(apiKey);
      await apiKeys.save();
      return apiKeys;
   } catch (error) {
      throw new Error(error);
   }
};

exports.findById = async (id) => {
   try {
      const apiKeys = await ApiKey.findById(id);
      return apiKeys;
   } catch (error) {
      throw new Error(error);
   }
};

exports.findByKey = async (id) => {
   try {
      const apiKeys = await ApiKey.findByKey(id);
      return apiKeys;
   } catch (error) {
      throw new Error(error);
   }
};

exports.updateApiKey = async (id, apiKeyEdited) => {
   try {
      const options = { runValidators: true, new: true };
      const apiKeys = await ApiKey.findByIdAndUpdate(id, apiKeyEdited, options);
      return apiKeys;
   } catch (error) {
      throw new Error(error);
   }
};