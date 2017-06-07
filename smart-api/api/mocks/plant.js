var mongoose = require('mongoose');
 
var plantSchema = new mongoose.Schema({
    name:{type: String, required: true, unique: true},

});
 
mongoose.model('Plant', plantSchema);
