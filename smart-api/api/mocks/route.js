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
      estimeted_time: Number,
      date_estimated: Object,
      hashPacking : String

});
 
routeSchema.plugin(mongoosePaginate);
mongoose.model('Route', routeSchema);
