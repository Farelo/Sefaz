const debug = require('debug')('service:settings')
const _ = require('lodash')
const { Setting } = require('./settings.model')

exports.get_setting = async () => {
    try {
        const settings = await Setting.find()

        return settings[0]
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const setting = await Setting.findById(id)
        return setting
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_setting = async (id, setting_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const setting = await Setting.findByIdAndUpdate(id, setting_edited, options)

        return setting
    } catch (error) {
        throw new Error(error)
    }
}
