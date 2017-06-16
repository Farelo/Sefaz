var mongoose = require('mongoose');
 
var plantSchema = new mongoose.Schema({
    name:{type: String, required: true, unique: true},
    lat: {type: Number},
    lng: {type: Number}

});
 
mongoose.model('Plant', plantSchema);
