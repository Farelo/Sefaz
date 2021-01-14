const debug = require("debug")("controller:device_data");
const HttpStatus = require("http-status-codes");
const positionsService = require("../positions/positions.service");
const batteriesService = require("../batteries/batteries.service");
const temperaturesService = require("../temperatures/temperatures.service");
const packingsService = require("../packings/packings.service");
const _ = require("lodash");

exports.all = async (req, res) => {
   const { device_id, start_date, end_date } = req.params;
   const query = {
      tag: device_id,
      start_date: start_date ? start_date : null,
      end_date: end_date ? end_date : null,
   };

   console.log(query);

   if (device_id) {
      const packing = await packingsService.find_by_tag(device_id);
      if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid tag" });
   }

   const resultPositions = await positionsService.getPosition(query);
   const resultTemperatures = await temperaturesService.get(query);
   const resultBatteries = await batteriesService.get(query);

   console.log(resultPositions.length, resultTemperatures.length, resultBatteries.length);

   let iPosition = 0;
   let iTemperature = 0;
   let iBattery = 0;
   let result = [];

   console.log(_.max([resultPositions.length, resultTemperatures.length, resultBatteries.length]));

   for (let i = 0; i < _.max([resultPositions.length, resultTemperatures.length, resultBatteries.length]); i++) {
      // console.log("for ...");
      let newer = _.max([
         resultPositions.length > 0 ? resultPositions[iPosition].timestamp : 0,
         resultTemperatures.length > 0 ? resultTemperatures[iTemperature].timestamp : 0,
         resultBatteries.length > 0 ? resultBatteries[iBattery].timestamp : 0,
      ]);
      // console.log(newer);

      let newData = {
         battery: {
            percentage: null,
            voltage: null,
         },
         device_id: device_id,
         message_date: null,
         message_date_timestamp: null,
         latitude: null,
         longitude: null,
         accuracy: null,
         temperature: null,
      };

      if (resultPositions.length > 0)
         if (resultPositions[iPosition].timestamp == newer) {
            newData.message_date = resultPositions[iPosition].date;
            newData.message_date_timestamp = resultPositions[iPosition].timestamp;
            newData.latitude = resultPositions[iPosition].latitude;
            newData.longitude = resultPositions[iPosition].longitude;
            newData.accuracy = resultPositions[iPosition].accuracy;

            resultPositions.shift();
         }

      if (resultTemperatures.length > 0)
         if (resultTemperatures[iTemperature].timestamp == newer) {
            newData.message_date = resultTemperatures[iTemperature].date;
            newData.message_date_timestamp = resultTemperatures[iTemperature].timestamp;
            newData.temperature = resultTemperatures[iTemperature].value;

            resultTemperatures.shift();
         }

      if (resultBatteries.length > 0)
         if (resultBatteries[iBattery].timestamp == newer) {
            newData.message_date = resultBatteries[iBattery].date;
            newData.message_date_timestamp = resultBatteries[iBattery].timestamp;
            newData.battery.percentage = resultBatteries[iBattery].battery;

            resultBatteries.shift();
         }

      result.push(newData);
   }

   res.json(result);
};

// exports.geolocation = async (req, res) => {
//    const query = {
//       company_id: req.query.company_id ? req.query.company_id : null,
//       family_id: req.query.family_id ? req.query.family_id : null,
//       packing_serial: req.query.packing_serial ? req.query.packing_serial : null,
//    };

//    if (req.query.family_id) {
//       const family = await families_service.get_family(req.query.family_id);
//       if (!family) return res.status(HttpStatus.NOT_FOUND).send("Invalid family");
//    }

//    if (req.query.company_id) {
//       const company = await companies_service.get_company(req.query.company_id);
//       if (!company) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");
//    }

//    const device_data = await device_data_service.geolocation(query);

//    res.json(device_data);
// };

// exports.create = async (req, res) => {
//    deviceData = await device_data_service.createDeviceData(req.body);

//    res.status(HttpStatus.CREATED).send(deviceData);
// };
