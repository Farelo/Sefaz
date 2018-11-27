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

exports.snapshot = async () => {
    try {
        const data = await reports_repository.snapshot_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.absent = async (query) => {
    try {
        const data = await reports_repository.absent_report(query)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.permanence_time = async (query) => {
    try {
        const data = await reports_repository.permanence_time_report(query)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.battery = async (family_id) => {
    try {
        const data = await reports_repository.battery_report(family_id)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

