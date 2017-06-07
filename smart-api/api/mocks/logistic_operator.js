var mongoose = require('mongoose');
 

var logisticOperatorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    cpf:{type: String, required: true, unique: true},
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    }

});
 

mongoose.model('LogisticOperator', logisticOperatorSchema);
