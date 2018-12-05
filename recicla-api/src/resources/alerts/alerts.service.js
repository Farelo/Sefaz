const debug = require('debug')('service:alerts')
const _ = require('lodash')
const alerts_repository = require('./alerts.repository')

exports.get_alerts = async () => {
    try {
        const data = await alerts_repository.get_alerts()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_alerts_by_family = async (family_id, current_state) => {
    try {
        const data = await alerts_repository.get_alerts_by_family(family_id, current_state)
        return data
    } catch (error) {
        throw new Error(error)
    }
}