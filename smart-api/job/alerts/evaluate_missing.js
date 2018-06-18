'use strict'

const debug             = require('debug')('job:evaluate_missing')
const schemas           = require("../../api/schemas/require_schemas")
const historic          = require('../historic/historic');
const alerts_type       = require('./alerts_type');
const historic_types    = require('../historic/historic_type')

module.exports = (packing) => {
  return new Promise((resolve, reject) => {
    try {
      let today = new Date()
      let timeInterval = Math.floor(today.getTime() - packing.trip.date)
      let missingRoutes = packing.routes.filter(route => {
        return timeInterval > (route.time.max + route.time.to_be_late)
      })

      if (missingRoutes.length > 0) {
        debug(`THIS PACKING IS MISSING: ${packing._id}`)
        packing.missing = true
        packing.traveling = false
        packing.packing_missing = {
          "date": packing.packing_missing.date,
          "time_countdown": timeInterval
        }
        schemas.alert.update({
          "packing": packing._id,
          "status": alerts_type.TRAVELING
        }, 
        {
          department: packing.department,
          actual_plant: packing.last_plant,
          supplier: packing.supplier,
          project: packing.project,
          status: alerts_type.MISSING,
          hashpacking: packing.hashPacking,
          serial: packing.serial,
          date: new Date().getTime()
        })
          .then(() => historic.update_from_alert(packing, historic_types.MISSING, packing.packing_missing.date, packing.packing_missing.time_countdown))
          .then(() => resolve(packing))

      } else {
        debug("THIS PACKING IS TRAVELING: ", packing._id)
        resolve(packing)
      }
    } catch (error) {
      reject(new Error(error))      
    }
  })
}
