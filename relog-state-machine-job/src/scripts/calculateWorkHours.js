const { Rack } = require("../models/racks.model");
const { Integration } = require("../models/integrations.model");
const logs_controller = require("")



const detachIntegration = (integration) =>{
    if(integration.active =="true"){
        await integration.remove();
        await logs_controller.create({ token: req.headers.authorization, log: "delete_integration", newData: integration });



    }


}

const  registerWorkHour = (rack, controlPoint) =>{
//TODO coleção registro de horas de trabalho
}