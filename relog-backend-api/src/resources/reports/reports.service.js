const debug = require('debug')('service:packings')
const _ = require('lodash')
const reports_repository = require('./reports.repository')

exports.general_report = async () => {
    try {
        const data = await reports_repository.general_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_inventory_report = async () => {
    try {
        const data = await reports_repository.general_inventory_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.absent_report = async (query) => {
    try {
        const data = await reports_repository.absent_report(query)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.permanence_time_report = async (query) => {
    try {
        const data = await reports_repository.permanence_time_report(query)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.battery_report = async (family_id) => {
    try {
        const data = await reports_repository.battery_report(family_id)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.quantity_report = async (family_id) => {
    try {
        const data = await reports_repository.quantity_report(family_id)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_info_report = async (family_id) => {
    try {
        const data = await reports_repository.general_info_report(family_id)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.clients_report = async (company_id) => {
    try {
        const data = await reports_repository.clients_report(company_id)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.snapshot_report = async () => {
    try {
        const data = await reports_repository.snapshot_report()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.snapshot_recovery_report = async ({ snapshot_date = null }) => {
    try {
        const data = await reports_repository.snapshot_recovery_report(snapshot_date)
        return data
    } catch (error) {
        throw new Error(error)
    }
}