const { Rack } = require("../models/racks.model");
//const { Integration } = require("../models/integrations.model");
const logs_controller = require("")



module.exports = async (rack) =>{ 
        
try {
if (rack.last_integration_record.active === "true") {
        await Rack.findByIdAndUpdate(
                rack._id,
                { active: false},
                { new: true }
             );
          
          rack.last_integration_record.active = false;
          return rack;
        }
} catch (error) {
      console.error(error);
      throw new Error(error);
}

};  