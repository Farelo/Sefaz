const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const logisticOperatorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    cpf:{type: String, required: true, unique: true},
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    },
    plant: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plant'
    },
    suppliers: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Supplier'
    }]

});
 
logisticOperatorSchema.plugin(mongoosePaginate);
mongoose.model('LogisticOperator', logisticOperatorSchema);
