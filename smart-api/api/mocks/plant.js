const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const plantSchema = new mongoose.Schema({
    plant_name:{type: String, required: true, unique: true},
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
    location: String,
    profile: [String]

});

plantSchema.pre('remove', function(next) {
    let plant  = this;
    // Remove all the assignment docs that reference the removed person.
    plant.model('Packing').update({"actual_plant.plant": plant._id},{$unset: {actual_plant: 1}},{multi: true})
         .then(() => {
           var cursor = plant.model('Route').find({"$or": [{"plant_factory": plant._id}, {"plant_supplier": plant._id}]}).cursor()
           cursor.on('data', function(doc) {
             // Called once for every documen
             doc.remove();
           });
           cursor.on('close', function() {
             var cursor = plant.model('Department').find({"plant": plant._id}).cursor()
             cursor.on('data', function(doc) {
               // Called once for every document
               doc.remove();
             });
             cursor.on('close', function() {
                 next();
             });
           });
         });

});

plantSchema.plugin(mongoosePaginate);
mongoose.model('Plant', plantSchema);
