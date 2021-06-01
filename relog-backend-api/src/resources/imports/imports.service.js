const debug = require('debug')('service:home')
const _ = require('lodash')
const xlsx = require('node-xlsx').default

exports.import_rack = (rack_xlsx) => {
    try {
        let racks = []
        const file_name = new Date().getTime().toString()

        rack_xlsx.mv(`${__dirname}/uploads/${file_name}.xlsx`, err => {
            if (err) return { description: err }
            const workSheetsFromFile = xlsx.parse(`${__dirname}/uploads/${file_name}.xlsx`)
            racks = workSheetsFromFile[0].data
        })
        
        console.log("​exports.import_rack -> racks", racks)
        // const array_xlsx = workSheetsFromFile[0].data

        return { data: [] }
        
    } catch (error) {
        throw new Error(error)
    }
}