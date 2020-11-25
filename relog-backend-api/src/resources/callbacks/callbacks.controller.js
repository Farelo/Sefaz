const debug = require("debug")("controller:companies");
const HttpStatus = require("http-status-codes");
const positionsController = require("../positions/positions.controller");
const temperaturesController = require("../temperatures/temperatures.controller");
const batteriesController = require("../batteries/batteries.controller");

exports.dots = async (req, res) => {
   let actionsData = req.body;
   console.log('controller');
   console.log(actionsData);

   actionsData.forEach((action) => {
    action.signals.forEach(async signal=>{
        switch(signal.UUID){
            case "position":
                await positionsController.createMany(signal.logs.map( element=>{ 
                    return {
                        tag: action.deviceUUID,
                        ...element
                    } 
                }))
                break;
            case "temperature":
                break;
            case "batteryTX":
                break;
        }
    });
   });

   res.status(HttpStatus.CREATED).send(company);
};
