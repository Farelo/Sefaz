const debug = require('debug')('startup:user')
const { User } = require('../resources/users/users.model')
const { Company } = require('../resources/companies/companies.model')
const { Setting } = require('../resources/settings/settings.model')
const config = require('config')
// const dm_main = require('../jobs/loka/main.script')

const startupUser = async () => {
    try {
        const users = await User.find()
        if (!users.length) {
            // const newCompany = await Company.findOne({ type: 'owner' })
            const newCompany = await Company.create({ name: 'CEBRACE TESTE' })
            await newCompany.save()
            
            const newUser = new User({ full_name: 'Admin', email: 'admin@admin.smart', password: 'admin', role: 'admin', company: newCompany._id })
            await newUser.save()

            // const setting = new Setting({
            //     enable_gc16: true,
            //     battery_level_limit: 18,
            //     job_schedule_time_in_sec: 50,
            //     range_radius: 3000,
            //     clean_historic_moviments_time: 1440,
            //     no_signal_limit_in_days: 2
            // })

            // await setting.save()
            
            debug('Startup user with success.')
        } else {
            debug('Company and User already created.')

        }
    } catch (error) {
        debug('Something failed when startup a user.')
        throw new Error(error)
    }
}

module.exports = () => {
    startupUser()
}