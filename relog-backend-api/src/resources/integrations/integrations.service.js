const { Integration } = require("./integrations.model");
const { WorkHour } = require("../work_hours/work_hours.model");


exports.get_integrations = async (id) => {
   try {
       if (!id) return await Integration.find().populate('EngineType', ['_id', 'code']).populate('family', ['_id', 'code', 'company']).populate("Rack", ["_id", "name"]);
       const data = await Integration.findById(id)
       return data ? [data] : []
   } catch (error) {
       throw new Error(error)
   }
}

exports.create_integration = async (integration) => {
  try {
     const new_integration = new Integration(integration);
     await new_integration.save();
     return new_integration;
  } catch (error) {
     throw new Error(error);
  }
};

exports.create_work_hour = async (Work_hour) => {
   try {
      const new_Work_hour = new WorkHour(Work_hour);
      await new_Work_hour.save();
      return new_Work_hour;
   } catch (error) {
      throw new Error(error);
   }
 };


exports.find_by_id = async (id) => {
   try {
      const integration = await Integration.findById(id)
      return integration;
   } catch (error) {
      throw new Error(error);
   }
};


exports.update_integration = async (id, integration_edited) => {
   try {
      const options = { runValidators: true, new: true };
      const integration = await Integration.findByIdAndUpdate(id, integration_edited, options);
      return integration;
   } catch (error) {
      throw new Error(error);
   }
};
