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

}).plugin(mongoosePaginate);

logisticOperatorSchema.pre('remove', function(next) {
    let logsitic = this;
    // Remove all the assignment docs that reference the removed person.
    logsitic.model('Plant').findOne({logistic_operator: logsitic._id}).exec()
     .then(doc => {
          doc.remove();
          next();
        });
});

module.exports = mongoose.model('LogisticOperator', logisticOperatorSchema);
