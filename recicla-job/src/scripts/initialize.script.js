const ora = require('ora')
const { Setting } = require('../models/settings.model')
const { Company } = require('../models/companies.model')
const { Family } = require('../models/families.model')
const { Packing } = require('../models/packings.model')
const { DeviceData } = require('../models/device_data.model')
const { ControlPoint } = require('../models/control_points.model')
const { Type } = require('../models/types.model')
const { GC16 } = require('../models/gc16.model')
const { Route } = require('../models/routes.model')
const spinner = ora('Initializing...')

module.exports = async () => {
    spinner.start()
    setTimeout(async () => {

        // await create_gc16()
        // await create_routes()

        // const has_settings = await Setting.find()
        // if (!has_settings.length > 0) await create_settings()
        // spinner.info('Settings ok.')

        // const has_packings = await Packing.find()
        // if (!has_packings.length > 0) await create_many_packings()
        // spinner.info('Packings ok.')

        // const has_device_data = await DeviceData.find()
        // if (!has_device_data.length > 0) await create_many_device_data()
        // spinner.info('Device data ok.')

        // const has_control_points = await ControlPoint.find()
        // if (!has_control_points.length > 0) await create_many_control_points()
        // spinner.info('Control point data ok.')

        spinner.succeed('Success!')
    }, 3000)
}

const create_settings = async () => {
    const setting = new Setting({
        enable_gc16: true,
        battery_level_limit: 18,
        job_schedule_time_in_sec: 50,
        range_radius: 3000,
        clean_historic_moviments_time: 1440,
        no_signal_limit_in_days: 2
    })
    await setting.save()
}

const create_many_packings = async () => {
    try {
        const company = await Company.create({ name: 'CEBRACEC', type: 'owner' })
        const family = await Family.create({ code: 'CODEA', company: company._id })
        
        const anotherCompany = await Company.create({ name: 'Fornecedor A', type: 'client' })
        const anotherFamily = await Family.create({ code: 'CODEB', company: anotherCompany._id })

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

        await Packing.create({
            family: anotherFamily._id,
            tag: {
                code: `500003`,
                version: '1.0',
                manufactorer: 'Sigfox',
            },
            serial: `003`,
            weigth: 1000,
            width: 1000,
            heigth: 1000,
            length: 1000,
            capacity: 1000,
            active: true
        })
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const create_many_device_data = async () => {
    try {
        for (let i=0; i<4;i++) {
            let device_data = {}

            device_data = new DeviceData({
                device_id: `50000${i}`,
                message_date: new Date().getTime(),
                last_communication: new Date().getTime(),
                latitude: 50+i,
                longitude: 60+i,
                accuracy: 80+i,
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

const create_many_control_points = async () => {
    try {
        await Type.insertMany({ name: 'fornecedor' }, { name: 'op logistico' })

        const type = await Type.create({ name: 'fabrica' })
        const company = await Company.findOne({})

        for (let i = 0; i < 3; i++) {
            let control_point = {}
            control_point = new ControlPoint({
                name: `Control Point ${i}`,
                lat: 70+i,
                lng: 120+i,
                full_address: 'Testeeeeeeeee',
                type: type._id,
                company: company._id
            })
            await control_point.save()
            spinner.info('Control Point created with success!')
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const create_gc16 = async () => {
    const family = await Family.findOne({})
    await GC16.create({
        family: family._id,
        stock: {
            days: 2,
            value: 2,
            max: 2,
            qty_container: 2,
            qty_container_max: 2
        }
    })
}

const create_routes = async () => {
    const family = await Family.find({})
    const control_points = await ControlPoint.find({})

    await Route.create({
        family: family[0]._id,
        first_point: control_points[0]._id,
        second_point: control_points[1]._id,
        traveling_time: {
            max: 3,
            min: 1,
            overtime: 4
        }
    })

    await Route.create({
        family: family[1]._id,
        first_point: control_points[0]._id,
        second_point: control_points[1]._id,
        traveling_time: {
            max: 3,
            min: 1,
            overtime: 4
        }
    })
}