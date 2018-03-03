const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const projectSchema = new mongoose.Schema({
      name: {type: String, required: true, unique: true},
}).plugin(mongoosePaginate);

projectSchema.pre('remove', function(next) {
     // Remove all the assignment docs that reference the removed person.
    var cursor = this.model('Packing').find({project: this._id}).cursor()
    cursor.on('data', function(doc) {
      // Called once for every document
      doc.remove();
    });
    cursor.on('close', function() {
        next();
    });

});

mongoose.model('Project', projectSchema);
