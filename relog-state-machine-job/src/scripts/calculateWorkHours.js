const { Rack } = require("../models/racks.model");
const moment = require("moment");


module.exports = async (rack) => {
    try {
            let calculate = 0;
            if (rack.work_start) calculate = getDiffDateTodayInHours(rack.work_start);
            await Rack.findByIdAndUpdate(
               rack._id,
               {
                  
                  work_end: new Date(),
                  last_cicle_duration: calculate,
               },
               { new: true }
            );
         

        
    } catch (error) {
        console.error(error);
      throw new Error(error);
    }






const getDiffDateTodayInHours = (date) => {
    const today = moment();
    date = moment(date);
 
    const duration = moment.duration(today.diff(date));
    return duration.asHours();
 };