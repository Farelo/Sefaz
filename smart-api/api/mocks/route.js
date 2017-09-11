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
      time: {
        max: Number,
        min: Number
      },
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

routeSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Packing').update({routes: { $in: [this._id] }}, {$pull: {routes: this._id}}, {multi: true}, next);

});
routeSchema.plugin(mongoosePaginate);
mongoose.model('Route', routeSchema);
