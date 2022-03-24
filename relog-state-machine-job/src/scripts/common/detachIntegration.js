//const { Rack } = require("../models/racks.model");
const {Integration} = require("../../models/integrations.model")

module.exports = async (rack) => {

      try {

           // Integration.updateOne({ id_rack: rack._id }, { $set: { active: false } })
            const filter = { id_rack: rack._id  };
            const update = { active: false  };

            
             await Integration.findOneAndUpdate(filter, update, {
                  new: true
            });

      } catch (error) {
            console.error(error);
            throw new Error(error);
      }

};  