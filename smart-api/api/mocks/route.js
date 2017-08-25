const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const routeSchema = new mongoose.Schema({
      supplier: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Supplier'
      },
      plant_factory: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      plant_supplier: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      packing_code: String,
      location : {
        distance: {
          text: String,
          value: Number
        },
        duration: {
          text: String,
          value: Number
        },
        start_address: String,
        end_address: String
      },
      hashPacking : String

});
 
routeSchema.plugin(mongoosePaginate);
mongoose.model('Route', routeSchema);
