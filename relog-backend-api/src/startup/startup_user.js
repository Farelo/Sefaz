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
            const newCompany = await Company.create({ name: 'Evoy' })
            await newCompany.save()
            
            const newUser = new User({ full_name: 'Master Admin', email: 'admin@admin.smart', password: 'Admin20', role: 'masterAdmin', company: newCompany._id })
            await newUser.save()

            const has_settings = await Setting.find()
            if (!has_settings.length > 0){
                const setting = new Setting({
                    "expiration_date": new Date(new Date().getTime()+365*24*60*60*1000),
                    "enable_gc16" : true,
                    "battery_level_limit" : 70,
                    "accuracy_limit" : 100,
                    "job_schedule_time_in_sec" : 10,
                    "range_radius" : 493,
                    "clean_historic_moviments_time" : 1440,
                    "no_signal_limit_in_days" : 1,
                    "missing_sinal_limit_in_days" : 2,
                    "enable_local_incorreto" : true,
                    "enable_perdida" : true,
                    "enable_sem_sinal" : true,
                    "enable_viagem_atrasada" : true,
                    "enable_viagem_perdida" : true
                })
                await setting.save()    
            }
            
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