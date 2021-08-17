const { Integration } = require("./integrations.model");



exports.create_integration = async (integration) => {
  try {
     const new_integration = new Integration(integration);
     await new_integration.save();

     return new_integration;
  } catch (error) {
     throw new Error(error);
  }
};


