const debug = require('debug')('service:packings')
const _ = require('lodash')
const reports_repository = require('./reports.repository')

exports.general = async () => {
    try {
        const data = await reports_repository.general_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_inventory = async () => {
    try {
        const data = await reports_repository.general_inventory_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

