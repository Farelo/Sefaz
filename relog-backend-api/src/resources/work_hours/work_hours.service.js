const { WorkHour } = require("./work_hours.model");


exports.get_work_hours = async (id) => {
   try {
       if (!id) return await WorkHour.find()
       .populate("Rack", ["_id", "name"]);

       const data = await WorkHour.findById(id)
       return data ? [data] : []
   } catch (error) {
       throw new Error(error)
   }
}

exports.find_by_id = async (id) => {
   try {
      const work_hour = await WorkHour.findById(id)
      return work_hour;
   } catch (error) {
      throw new Error(error);
   }
};

exports.create_work_hour = async (work_hour) => {
  try {
     const new_work_hour = new Work_hour(work_hour);
     await new_work_hour.save();
     return new_work_hour;
  } catch (error) {
     throw new Error(error);
  }
};
exports.update_work_hour = async (id, work_hour_edited) => {
   try {
      const options = { runValidators: true, new: true };
      const work_hour = await WorkHour.findByIdAndUpdate(id, work_hour_edited, options);
      return work_hour;
   } catch (error) {
      throw new Error(error);
   }
};
