const debug = require('debug')('service:home')
const _ = require('lodash')
const xlsx = require('node-xlsx').default

exports.import_packing = (packing_xlsx) => {
    try {
        let packings = []
        const file_name = new Date().getTime().toString()

        packing_xlsx.mv(`${__dirname}/uploads/${file_name}.xlsx`, err => {
            if (err) return { description: err }
            const workSheetsFromFile = xlsx.parse(`${__dirname}/uploads/${file_name}.xlsx`)
            packings = workSheetsFromFile[0].data
        })
        
        console.log("​exports.import_packing -> packings", packings)
        // const array_xlsx = workSheetsFromFile[0].data

        return { data: [] }
        
    } catch (error) {
        throw new Error(error)
    }
}