const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const logisticOperatorSchema = new mongoose.Schema({
    name: {type: String, required: true},
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

logisticOperatorSchema.pre('remove', function(next) {
    let logsitic = this;
    // Remove all the assignment docs that reference the removed person.
    logsitic.model('Plant').findOne({logistic_operator: logsitic._id}).exec()
     .then(doc => {
          doc.remove();
          next();
        });

});

logisticOperatorSchema.plugin(mongoosePaginate);
mongoose.model('LogisticOperator', logisticOperatorSchema);
