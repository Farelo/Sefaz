const debug = require('debug')('service:home')
const _ = require('lodash')
const home_repository = require('./home.repository')

exports.home_report = async (current_state) => {
    try {
        const data = await home_repository.home_report(current_state)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.home_low_battery_report = async () => {
    try {
        const data = await home_repository.home_low_battery_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.home_permanence_time_exceeded_report = async () => {
    try {
        const data = await home_repository.home_permanence_time_exceeded_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}