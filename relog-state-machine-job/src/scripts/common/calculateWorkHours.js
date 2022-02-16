//const { Rack } = require("../models/racks.model");
const moment = require("moment");
const {WorkHour} = require("../../models/work_hours.model");




module.exports = async (rack) => {
    try {
      var work_hour_calculate = await WorkHour.findByIdAndUpdate(
         rack._id,
         {
            work_end: Date.now(),  
         },
         { new: true }
      );

      let total_work_duration = total_work_duration + (work_hour_calculate.work_start - work_hour_calculate.work_end);
       total_work_duration = getDiffDateTodayInHours(total_work_duration);
       //console.log("teste");

       await WorkHour.findByIdAndUpdate(
         rack._id,
         {
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
