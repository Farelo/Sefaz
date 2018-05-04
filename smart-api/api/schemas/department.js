const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const departmentSchema = new mongoose.Schema({
    name:String,
    lat: {type: Number},
    lng: {type: Number},
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
}).plugin(mongoosePaginate);;

departmentSchema.pre('remove', function(next) {
    let department  =  this;
    console.log(this);
    // Remove all the assignment docs that reference the removed person.
    department.model('Packing')
        .update({"department": department._id},{$unset: {department: 1}},{multi: true})
        .then(() => department.model('Alerts').update({"department": department._id},{$unset: {department: 1}},{multi: true}))
        .then(() => department.model('HistoricPackings').update({"department": department._id},{$unset: {department: 1}},{multi: true},next));
});

departmentSchema.pre('update', function(next) {
    let department  =  this;
    mongoose.models['Packing']
        .update({"department": department._conditions._id},{$unset: {department: 1}},{multi: true})
        .then(() => mongoose.models['Alerts'].update({"department": department._conditions._id},{$unset: {department: 1}},{multi: true}))
        .then(() => mongoose.models['HistoricPackings'].update({"department": department._conditions._id},{$unset: {department: 1}},{multi: true},next));
});


module.exports = mongoose.model('Department', departmentSchema);
