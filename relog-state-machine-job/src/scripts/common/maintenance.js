const { Rack } = require("../../models/racks.model");


module.exports = async (rack) => {

    try {

          const filter = { id_rack: rack._id  };
          const update = { in_maintenance: false  };

          
           await Rack.findOneAndUpdate(filter, update, {
                new: true
          });

    } catch (error) {
          console.error(error);
          throw new Error(error);
    }

};  