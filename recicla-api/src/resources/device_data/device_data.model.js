const mongoose = require('mongoose');

const deviceDataSchema = new mongoose.Schema({

    deviceId: {
        type: String,
        required: true
    },
    messageDate: {
        type: Number,
        required: true
    },
    lastCommunication: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    accuracy: {
        type: Number
    },
    battery: {
        percentage: Number,
        voltage: Number
    },
    temperature: {
        type: Number
    },
    seqNumber: {
        type: Number,
        required: true
    }
});

const DeviceData = mongoose.model('DeviceData', deviceDataSchema);

exports.DeviceData = DeviceData;
exports.DeviceDataSchema = deviceDataSchema;