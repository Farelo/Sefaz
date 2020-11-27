const debug = require('debug')('model:logs')
const mongoose = require('mongoose')
const Joi = require('joi')

const logSchema = new mongoose.Schema({
  
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    newData: {
        type: Object,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
    
})

const Log = mongoose.model('Log', logSchema)

exports.Log = Log
exports.logSchema = logSchema