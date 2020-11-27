const debug = require('debug')('service:logs')
const mongoose = require("mongoose");
const _ = require('lodash')
const { Log } = require('./logs.model')

exports.get_all = async () => {
    try {
       return await Log.find()

       } catch (error) {
        throw new Error(error)
    }
}


exports.create_log = async (entry) => {
    try {
        
        const new_log = new Log({"user": entry.userId, "action": entry.log, "newData": entry.newData})
        
        await new_log.save()

    } catch (error) {
        throw new Error(error)
    }
}
