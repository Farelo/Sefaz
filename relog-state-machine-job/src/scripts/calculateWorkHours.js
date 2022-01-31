const { Rack } = require("../models/racks.model");
const moment = require("moment");


module.exports = async (rack) => {
    try {
            let calculate = 0;
            
         
            if (rack.work_start)calculate = getDiffDateTodayInHours(rack.work_start);
            let total_work_duration = total_work_duration + calculate;
            total_work_duration = getDiffDateTodayInHours(total_work_duration);
            
            await Rack.findByIdAndUpdate(
               rack._id,
               {
                  work_end: new Date(),
                  last_work_duration: calculate,
                  total_work_duration: total_work_duration,
               },
               { new: true }
            );
         

        
    } catch (error) {
        console.error(error);
      throw new Error(error);
    }
   }



const getDiffDateTodayInHours = (date) => {
    const today = moment();
    date = moment(date);
    const duration = moment.duration(today.diff(date));
    return duration.asHours();
 };
