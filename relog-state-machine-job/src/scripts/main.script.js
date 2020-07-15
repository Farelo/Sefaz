const ora = require("ora");
const cron = require("node-cron");

const { Setting } = require("../models/settings.model");
const { Packing } = require("../models/packings.model");
const { ControlPoint } = require("../models/control_points.model");
const { Company } = require("../models/companies.model");

const runSM = require("./runSM.script");
// const spinner = ora("State Machine working...");

module.exports = async () => {
  let setting = await getSettings();

  let nextSemaphor = true;

  cron.schedule(`*/1 * * * *`, async () => {
    if (nextSemaphor) {
      //close the semaphor
      nextSemaphor = false;

      setTimeout(async () => {
        // spinner.start();

        setting = await getSettings();

        // const device_data_array = await DeviceData.find({})
        const controlPoints = await ControlPoint.find({})
          .populate("company")
          .populate("type");

        const companies = await Company.find({});
        
        //const packings = await Packing.find({ })
        const packings = await Packing.find({ })
          .populate("family")
          .populate("last_device_data")
          .populate("last_device_data_battery")
          .populate("last_current_state_history")
          .populate("last_event_record");

        //await iteratePackings(setting, packings, controlPoints)
        await iteratePackings(setting, packings, controlPoints, companies);

        // packings.forEach(packing => {
        //     runSM(setting, packing, controlPoints)
        // })

        // spinner.succeed("Finished!");

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

const iteratePackings = async (setting, packings, controlPoints, companies) => {
  console.log("\nstart state machine . . .");
  let timeStart = new Date();
  
  for await (let packing of packings) {
    runSM(setting, packing, controlPoints, companies);
  }

  console.log(`Job encerrado. Inicio em  ${timeStart} e finalizado em  ${new Date()}`)
};

const getSettings = async () => {
  const settings = await Setting.find({});
  return settings[0];
};
