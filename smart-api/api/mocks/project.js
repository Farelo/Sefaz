const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const projectSchema = new mongoose.Schema({
      name: {type: String, required: true, unique: true},
});

projectSchema.plugin(mongoosePaginate);
mongoose.model('Project', projectSchema);
