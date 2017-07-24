var mongoose = require('mongoose');
 
var plantSchema = new mongoose.Schema({
    name:{type: String, required: true, unique: true},
    lat: {type: Number},
    lng: {type: Number},
    logistic_operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LogisticOperator'
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    profile: [String]

});
 
mongoose.model('Plant', plantSchema);
