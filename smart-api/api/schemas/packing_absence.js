const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const packingAbsenceSchema = new mongoose.Schema({
    plant: {
        plant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plant'
        },
        local: String
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    date: {
        type: Number
    },
    temperature: {
        type: Number
    },
    permanence_time: {
        type: Number
    },
    packing_code: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    routes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    }],
    actual_gc16: {
        days: Number,
        max: Number,
        min: Number,
    },
    serial: String,
    code: String,
    packing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Packing'
    },
    status: String
}).plugin(mongoosePaginate);


module.exports = mongoose.model('PackingAbsence', packingAbsenceSchema);
