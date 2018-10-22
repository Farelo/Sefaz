const debug = require('debug')('startup:user')
const { User } = require('../resources/users/users.model')
const { Company } = require('../resources/companies/companies.model')
const config = require('config')

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
        }
    } catch (error) {
        debug('Something failed when startup a user.')
        throw new Error(error)
    }
}

module.exports = () => {
    startupUser()
}