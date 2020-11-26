const debug = require("debug")("controller:companies");
const HttpStatus = require("http-status-codes");
const positionsController = require("../positions/positions.controller");
const temperaturesController = require("../temperatures/temperatures.controller");
const batteriesController = require("../batteries/batteries.controller");

exports.dots = async (req, res) => {
   let actionsData = req.body;

   try {
      for (let action of actionsData) {
         for (let signal of action.signals) {
            switch (signal.UUID) {
               case "position":
                //   await resolvePosition(action.deviceUUID, signal.logs);
                  break;
               case "temperature":
                  await resolveTemperature(action.deviceUUID, signal.logs);
                  break;
               case "batteryTX":
                  break;
            }
         }
      }

      console.log("res");
      res.status(HttpStatus.CREATED).send({});
   } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
   }
};

const resolvePosition = async (tag, data) => {
   await positionsController.createMany(
      data.map((element) => {
         return {
            tag: tag,
            date: element.date,
            timestamp: new Date(element.date).getTime(),
            latitude: element.value.lat,
            longitude: element.value.lng,
            accuracy: element.value.radius,
         };
      })
   );
};

const resolveTemperature = async (tag, data) => {
    console.log(tag, data);
   await temperaturesController.createMany(
      data.map((element) => {
         return {
            tag: tag,
            date: element.date,
            timestamp: new Date(element.date).getTime(),
            value: element.value,
         };
      })
   );
};
