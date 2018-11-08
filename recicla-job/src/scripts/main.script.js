const ora = require('ora')
const cron = require('node-cron')

const { Setting } = require('../models/settings.model')
const { Packing } = require('../models/packings.model')
const { ControlPoint } = require('../models/control_points.model')

const runSM = require('./runSM.script')
const spinner = ora('State Machine working...')

module.exports = async () => {
    const setting = await getSettings()
    cron.schedule(`*/${setting.job_schedule_time_in_sec} * * * * *`, async () => {
    // cron.schedule(`*/5 * * * * *`, async () => {
        spinner.start()
        setTimeout(async () => {
            // const device_data_array = await DeviceData.find({})
            const controlPoints = await ControlPoint.find({})
                .populate('company')
                .populate('type')
            const packings = await Packing.find({})
                .populate('family')
                .populate('last_device_data')
                .populate('last_alert_history')
                .populate('last_event_record')

            packings.forEach(packing => {
                runSM(setting, packing, controlPoints)
            })

            spinner.succeed('Finished!')
        }, 2000)
    })
}

const getSettings = async () => {
    const settings = await Setting.find({})
    return settings[0]
}