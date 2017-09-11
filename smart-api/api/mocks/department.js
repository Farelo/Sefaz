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
});

departmentSchema.pre('remove', function(next) {
    let department  =  this;
    console.log(this);
    // Remove all the assignment docs that reference the removed person.
    department.model('Packing')
        .update({"department": department._id},{$unset: {department: 1}},{multi: true})
        .then(() => department.model('Alerts').update({"department": department._id},{$unset: {department: 1}},{multi: true}))
        .then(() => department.model('HistoricPackings').update({"department": department._id},{$unset: {department: 1}},{multi: true},next));


});
departmentSchema.plugin(mongoosePaginate);
mongoose.model('Department', departmentSchema);
