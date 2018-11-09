const debug = require('debug')('startup:user')
const { User } = require('../resources/users/users.model')
const { Company } = require('../resources/companies/companies.model')
const config = require('config')

const dm_temp_test = require('../services/loka/dm.temp.testes')
const job = require('../Jobs/loka/dm.job')
const initialize_data = require('./temp-initialize.script')

const startupUser = async () => {
    try {
        const companies = await Company.find()
        if (!companies.length) {
            const newCompany = new Company({ name: config.get('company.name'), type: 'owner' })
            await newCompany.save()
            
            const newUser = new User({ full_name: 'Admin', email: 'admin@admin.smart', password: 'admin123', role: 'admin', company: newCompany })
            await newUser.save()
            // newCompany.users.push(newUser._id)
            
            debug('Startup user with success.')
        } else {
            debug('Company and User already created.')

            // await initialize_data()

            // await dm_temp_test.test_login()
            // await dm_temp_test.test_messages()
            // await dm_temp_test.test_positions()
            // dm_temp_test.test_deviceById()
            // dm_temp_test.test_devices_list()
            // dm_temp_test.test_confirmDevice()
            // dm_temp_test.test_getDeviceDataFromMidd()
            
            await job()
        }
    } catch (error) {
        debug('Something failed when startup a user.')
        throw new Error(error)
    }
}

module.exports = () => {
    startupUser()
}