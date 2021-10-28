const { Integration } = require("./integrations.model");



exports.create_integration = async (integration) => {
  try {
     const new_integration = new Integration(integration);
     await new_integration.save();

     //console.log(req)
    // logs_controller.create({
    //   token: req.headers.authorization,
    //   log: "create_integration",
    //   newData: req.body,
    // });

     return new_integration;
  } catch (error) {
     throw new Error(error);
  }
};


