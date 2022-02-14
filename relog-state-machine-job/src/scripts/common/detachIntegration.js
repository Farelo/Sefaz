// const { Rack } = require("../models/racks.model");
// //const { Integration } = require("../models/integrations.model");
// const logs_controller = require("");
// const { Integration } = require("../../../relog-backend-api/src/resources/integrations/integrations.model");



// module.exports = async (rack) =>{ 
        
// try {

//         let integration_detach = await Integration.findById(rack._id)

//         await Rack.findByIdAndUpdate(
//                 rack._id,
//                 { active: false},
//                 { new: true }
//              );
          
//           rack.last_integration_record.active = false;
//           return rack;
        
// } catch (error) {
//       console.error(error);
//       throw new Error(error);
// }

// };  