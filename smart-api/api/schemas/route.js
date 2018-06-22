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
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      packing_code: String,
      time: {
        max: Number,
        min: Number,
        to_be_late: Number
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

}).plugin(mongoosePaginate);

routeSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Packing').update({routes: { $in: [this._id] }}, {$pull: {routes: this._id},  $set: {"traveling": false}}, {multi: true}, next);
});


module.exports = mongoose.model('Route', routeSchema);
