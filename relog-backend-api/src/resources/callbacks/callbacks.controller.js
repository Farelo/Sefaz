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
                     await positionsController.createMany(
                        signal.logs.map((element) => {
                           return {
                              tag: action.deviceUUID,
                              date: element.date,
                              timestamp: new Date(element.date).getTime(), 
                              latitude: element.value.lat,
                              longitude: element.value.log,
                              accuracy: element.value.radius
                           };
                        })
                     );
                     break;
                  case "temperature":
                     break;
                  case "batteryTX":
                     break;
               }
         };
      };

      console.log("res");
      res.status(HttpStatus.CREATED).send({});
   } catch (error) {
      console.log("res error ..");
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid action" });
   }
};
