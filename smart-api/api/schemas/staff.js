const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const staffSchema = new mongoose.Schema({
      name: {type: String, required: true},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
}).plugin(mongoosePaginate);

mongoose.model('Staff', staffSchema);
