const ora = require("ora");
const cron = require("node-cron");

const { Setting } = require("../models/settings.model");
const { Position } = require("../models/position.model");
const { Battery } = require("../models/battery.model");
const { Temperature } = require("../models/temperature.model");
const { Packing } = require("../models/packings.model");
const { ControlPoint } = require("../models/control_points.model");

const runSM = require("./runSM.script");
const spinner = ora("State Machine working...");

module.exports = async () => {
   let setting = await getSettings();

   let nextSemaphor = true;

   cron.schedule(`*/1 * * * *`, async () => {
      if (nextSemaphor) {
         //close the semaphor
         nextSemaphor = false;

         setTimeout(async () => {
            spinner.start();

            console.log("START");
            console.log(new Date().toISOString());

            setting = await getSettings();

            // const device_data_array = await DeviceData.find({})
            const controlPoints = await ControlPoint.find({}).populate("company").populate("type");

            //const packings = await Packing.find({ })
            const packings = await Packing.find({ "tag.code": "4081800" })
               .populate("family")
               .populate("last_device_data")
               .populate("last_device_data_battery")
               .populate("last_current_state_history")
               .populate("last_event_record")
               .populate("last_position")
               .populate("last_battery")
               .populate("last_temperature");

            await iteratePackings(setting, packings, controlPoints);

            // packings.forEach(packing => {
            //     runSM(setting, packing, controlPoints)
            // })

            spinner.succeed("Finished!");

            //open the semmaphor
            nextSemaphor = true;
         }, setting.job_schedule_time_in_sec * 1000);
      }
   });
};

// const iteratePackings = (setting, packings, controlPoints) => {
//     for(let packing of packings) {
//         runSM(setting, packing, controlPoints)
//     }
// }

const iteratePackings = async (setting, packings, controlPoints) => {
   for await (let packing of packings) {
      runSM(setting, packing, controlPoints);
   }
};

const getSettings = async () => {
   const settings = await Setting.find({});
   return settings[0];
};
