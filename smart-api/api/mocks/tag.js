const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const tagSchema = new mongoose.Schema({
  code: {type: String, required: true, unique: true}
});
tagSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Packing').findOne({tag: this._id}).exec()
        .then(doc => doc.remove())

    next();
});
tagSchema.plugin(mongoosePaginate);
mongoose.model('Tags', tagSchema);
