'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug          = require('debug')('job:traveling')
const schemas        = require("../../api/schemas/require_schemas")
const historic       = require('../historic/historic');
const alerts_type    = require('./alerts_type');
const historic_types = require('../historic/historic_type')

module.exports = {
  set: function(p){
    return new Promise(function(resolve, reject) {
      p.missing = false;
      p.traveling = true;
      p.trip = {
        'time_exceeded': false,
        'date': new Date().getTime(),
        'time_countdown': 0
      };
      historic.create_from_alert(p, historic_types.TRAVELING, p.trip.date, p.trip.time_countdown)
      .then(() => resolve(p) )
      
    });
  },
  isLate: (packing) => {
    return new Promise((resolve, reject) => {
      try {
        if (packing.traveling) {
          if (packing.trip.time_exceeded) {
            let currentDate = new Date()
            let timeInterval = Math.floor(currentDate.getTime() - packing.trip.date)

            let delayedRoutes = packing.routes.filter(route => {
              return timeInterval > route.time.max
            })

            if (delayedRoutes.length > 0) {

              debug(`PACKING IS LATE, WHE'RE CREATING A ALERT TO: ${packing._id}`)
              packing.trip = {
                time_exceeded: true,
                date: packing.trip.date,
                time_countdown: timeInterval
              }

              let missingPackaging = packing.routes.filter(route => {
                // return timeInterval > (route.time.max - 1528306478348)
                return timeInterval > (route.time.max + route.time.to_be_late)
              })

              if (missingPackaging.length > 0) {
                debug(`PACKING IS MISSING: ${packing._id}`)
              }

              schemas.alert.find({ packing: new ObjectId(packing._id) }).then(alerts => {
                if (!alerts.length > 0) {
                  debug(`PACKING DON'T HAVE ALERTS: ${packing._id}`)

                  schemas.alert.create({
                    "routes": packing.routes,
                    "packing": packing._id,
                    "supplier": packing.supplier,
                    "status": alerts_type.TRAVELING,
                    "hashpacking": packing.hashPacking,
                    "serial": packing.serial,
                    "project": packing.project,
                    "date": new Date().getTime()
                  })
                    .then(() => historic.update_from_alert(packing, historic_types.TRAVELING, packing.trip.date, packing.trip.time_countdown))
                    .then(() => resolve(packing))
                } else {
                  debug(`PACKING HAVE ALERTS: ${packing._id}`)
                  schemas.alert.update({ //Verifica se o alerta ja existe
                    "packing": packing._id,
                    "status": alerts_type.TRAVELING
                  }, {
                      "routes": packing.routes,
                      "supplier": packing.supplier,
                      "hashpacking": packing.hashPacking,
                      "project": packing.project,
                      "serial": packing.serial
                    })
                    .then(() => historic.update_from_alert(packing, historic_types.TRAVELING, packing.trip.date, packing.trip.time_countdown))
                    .then(() => resolve(packing))
                }
              })

            } else {
              debug(`TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING: ${packing._id}`);
              packing.trip = {
                time_exceeded: false,
                date: packing.trip.date,
                time_countdown: timeInterval
              }

              historic.update_from_alert(packing, historic_types.TRAVELING, packing.trip.date, packing.trip.time_countdown)
                .then(() => resolve(packing))
            }
          } else {
            module.exports.create(packing).then(new_packing => resolve(new_packing))
          }
        } else {
          resolve(packing)
        }
      } catch (error) {
        reject(new Error(error))
      }
    })
  },
  create: function(p) {
    return new Promise(function(resolve, reject) {

      let date = new Date()
      let time = Math.floor(date.getTime()-p.trip.date);

      let result = p.routes.filter(r => {
        return r.time.max < time;
      });

      p.traveling = true;

      if (result.length > 0) { //Make sure the current plant belongs to the route
        console.log("TRAVELING TIME: ALERT CREATE TO PACKING:", p._id);
        p.trip = {
          'time_exceeded': true,
          'date': p.trip.date,
          'time_countdown':time
        };

        schemas.alert.create({
          "routes": p.routes,
          "packing": p._id,
          "supplier": p.supplier,
          "status": alerts_type.TRAVELING,
          "hashpacking": p.hashPacking,
          "serial": p.serial,
          "project": p.project,
          "date": new Date().getTime()
        })
        .then(() => historic.update_from_alert(p, historic_types.TRAVELING, p.trip.date, p.trip.time_countdown))
        .then(() => resolve(p));
      } else {
        console.log("TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING:", p._id);
        p.trip = {
          'time_exceeded': false,
          'date': p.trip.date,
          'time_countdown':time
        };

        historic.update_from_alert(p, historic_types.TRAVELING, p.trip.date, p.trip.time_countdown)
          .then(() => resolve(p))
       
      }
    });
  },
  evaluate_traveling: function(p) {
    return new Promise(function(resolve, reject) {
      if(p.traveling){
        if (p.trip.time_exceeded) {
          console.log("TRAVELING TIME: ALERT ALREADY EXIST TO PACKING:", p._id);
          let date = new Date()

          let time = Math.floor(date.getTime()-p.trip.date);

          let result = p.routes.filter(r => {
            return r.time.max < time;
          });

          if (result.length > 0) {
            p.trip = {
              'time_exceeded': true,
              'date': p.trip.date,
              'time_countdown':time
            };

            schemas.alert.update({ //Verifica se o alerta ja existe
              "packing": p._id,
              "status": alerts_type.TRAVELING
            }, {
              "routes": p.routes,
              "supplier": p.supplier,
              "hashpacking": p.hashPacking,
              "project": p.project,
              "serial": p.serial
            })
            .then(() => historic.update_from_alert(p, historic_types.TRAVELING, p.trip.date, p.trip.time_countdown))
            .then(() => resolve(p));

          } else {
            p.trip = {
              'time_exceeded': false,
              'date': p.trip.date,
              'time_countdown':time
            };

            schemas.alert.remove({
              "packing": p._id,
              "status":  alerts_type.TRAVELING
            })
            .then(() => historic.update_from_alert(p, historic_types.TRAVELING, p.trip.date, p.trip.time_countdown))
            .then(() => resolve(p));
          }
        } else {
          module.exports.create(p).then(new_p => resolve(new_p));
        }
      }else {
        resolve(p);
      }
    });
  }
}
