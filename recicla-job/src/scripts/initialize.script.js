const ora = require('ora')
const { Company } = require('../models/companies.model')
const { Family } = require('../models/families.model')
const { Packing } = require('../models/packings.model')
const { DeviceData } = require('../models/device_data.model')
const { Setting } = require('../models/settings.model')
const spinner = ora('Initializing...')

module.exports = async () => {
    spinner.start()
    setTimeout(async () => {
        const has_settings = await Setting.find()
        if (!has_settings.length > 0) await create_settings()
        spinner.info('Settings ok.')

        const has_packings = await Packing.find()
        if (!has_packings.length > 0) await create_many_packings()
        spinner.info('Packings ok.')

        const has_device_data = await DeviceData.find()
        if (!has_device_data.length > 0) await create_many_device_data()
        spinner.info('Device data ok.')

        spinner.succeed('Success!')
    }, 3000)
}

const create_settings = async () => {
    await Setting.create({
        enable_gc16: false,
        battery_level_limit: 18,
        job_schedule_time: 0.833333,
        range_radius: 32000,
        clean_historic_moviments_time: 1440,
        no_signal_limit_in_days: 2
    })
}

const create_many_packings = async () => {
    try {
        const company = await Company.create({ name: 'CEBRACEC', type: 'owner' })
        const family = await Family.create({ code: 'CODEA', company: company._id })

        for (let i=0; i<3; i++) {
            let packing = {} 
            packing = new Packing({
                family: family._id,
                tag: {
                    code: `50000${i}`,
                    version: '1.0',
                    manufactorer: 'Sigfox',
                },
                serial: `00${i}`,
                weigth: 1000,
                width: 1000,
                heigth: 1000,
                length: 1000,
                capacity: 1000,
                active: true
            })
            await packing.save()
            spinner.info('Packing created with success!')
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const create_many_device_data = async () => {
    try {
        for (let i=0; i<3;i++) {
            let device_data = {}

            device_data = new DeviceData({
                device_id: `50000${i}`,
                message_date: new Date().getTime(),
                last_communication: new Date().getTime(),
                latitude: 50,
                longitude: 60,
                accuracy: 80 + i,
                battery: {
                    percentage: 80,
                    voltage: 55
                },
                temperature: 40,
                seq_number: 10000
            })
            await device_data.save()
            spinner.info('Device data created with success!')
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}