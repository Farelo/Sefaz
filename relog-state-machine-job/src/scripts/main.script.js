const cron = require("node-cron");

const { Setting } = require("../models/settings.model");
const { Position } = require("../models/position.model");
const { Battery } = require("../models/battery.model");
const { Temperature } = require("../models/temperature.model");
const { Packing } = require("../models/packings.model");
const { ControlPoint } = require("../models/control_points.model");

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

            //const packings = await Packing.find({ })
            const packings = await Packing.find({})
               .populate("family")
               .populate("last_current_state_history")
               .populate("last_event_record")
               .populate("last_position")
               .populate("last_battery")
               .populate("last_temperature");

            await iteratePackings(setting, packings, controlPoints);

            console.log("Finished at", new Date().toISOString());

            //open the semaphore
            nextSemaphor = true;
         }, setting.job_schedule_time_in_sec * 1000);
      }
   });
};

const iteratePackings = async (setting, packings, controlPoints) => {
   for await (let packing of packings) {
      runSM(setting, packing, controlPoints);
   }
};

const getSettings = async () => {
   const settings = await Setting.find({});
   return settings[0];
};
