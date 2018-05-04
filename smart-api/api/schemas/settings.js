'use strict';

var mongoose = require('mongoose');

var settingsSchema = new mongoose.Schema({
    "_id": Number,
    "battery_level": Number,
    "clean": Number,
    "register_gc16": {
        enable: Boolean,
        days: Number,
        'id': {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GC16'
        }  
    },
    "range_radius": Number
});

module.exports = mongoose.model('Settings', settingsSchema);
