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

exports.create_log = async (userId, log) => {
    try {

        const new_log = new Log({"user": (userId), "action": log})
        await new_log.save()
        
    } catch (error) {
        throw new Error(error)
    }
}

/*
exports.find_by_id = async ( id ) => {
    try {
        const log = await Log.find(id)
        return log
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_action = async (action) => {
    try {
        const log = await Log.findByAction(action)
        return log
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_date = async (id) => {
    try {
        const log = await Log.findByDateRange()
        return log
    } catch (error) {
        throw new Error(error)
    }
}
*/