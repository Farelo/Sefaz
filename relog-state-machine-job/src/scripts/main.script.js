const cron = require("node-cron");

const { Setting } = require("../models/settings.model");
const { Position } = require("../models/position.model");
const { Battery } = require("../models/battery.model");
const { Temperature } = require("../models/temperature.model");
const { Rack } = require("../models/racks.model");
const { ControlPoint } = require("../models/control_points.model");
const { Buttons } = require("../models/button.model");

const runSM = require("./runSM.script"); 

module.exports = async () => {
   let setting = await getSettings();

   let nextSemaphor = true;

   cron.schedule(`*/1 * * * *`, async () => {
      if (nextSemaphor) {
         //close the semaphor
         nextSemaphor = false;

         setTimeout(async () => {
            // spinner.start();

            console.log("Job running ...");
            console.log("Started at", new Date().toISOString());

            setting = await getSettings();

            const controlPoints = await ControlPoint.find({}).sort({company: 1}).populate("company").populate("type");

            //const racks = await Rack.find({ })
            const racks = await Rack.find({})
               .populate("family")
               .populate("last_current_state_history")
               .populate("last_event_record")
               .populate("last_position")
               .populate("last_battery")
               .populate("last_temperature")
               //.populate("last_integration_record")
               .populate("last_detector_switch");

            await iterateRacks(setting, racks, controlPoints);

            console.log("Finished at", new Date().toISOString());

            //open the semaphore
            nextSemaphor = true;
         }, setting.job_schedule_time_in_sec * 1000);
      }
   });
};

const iterateRacks = async (setting, racks, controlPoints) => {
   for await (let rack of racks) {
      runSM(setting, rack, controlPoints);
   }
};

const getSettings = async () => {
   const settings = await Setting.find({});
   return settings[0];
};
