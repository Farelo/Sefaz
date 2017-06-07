var mongoose = require('mongoose');
 
var companySchema = new mongoose.Schema({
      name: {type: String, required: true},
      cnpj: {type: String, required: true, unique: true}
});

mongoose.model('Company', companySchema);
