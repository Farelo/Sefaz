'use strict';

const schemas = require("../../../config/database/require_schemas")
const ObjectId = schemas.ObjectId

exports.queries = {
  plant_filter: function(code, supplier,project) {
    return [{
        "$lookup": {
          "from": "routes",
          "localField": "_id",
          "foreignField": "plant_factory",
          "as": "ObjectPlant"
        }
      },

      {
        "$unwind": {
          "path": "$ObjectPlant",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$match": {
          $or: [{
              "ObjectPlant.supplier": {
                $ne: new ObjectId(supplier)
              }
            },
            {
              "ObjectPlant.packing_code": {
                $ne: code
              }
            },
            {
              "ObjectPlant.project": {
                $ne: new ObjectId(project)
              }
            }
          ],

          "supplier": {
            $exists: false
          },

          "logistic_operator": {
            $exists: false
          }
        }
      }
    ]
  },
  packings_per_plant: [
    {
      "$lookup": {
        "from": "packings",
        "localField": "_id",
        "foreignField": "actual_plant.plant",
        "as": "packings"
      }
    },
    {
      "$unwind": {
        "path": "$packings",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$group': {
        '_id': '$_id',
        'quantity_packings': { '$sum': { '$cond': ['$packings', 1, 0] } },
        'plant_name': { '$first': '$plant_name' },
        'lat': { '$first': '$lat' },
        'lng': { '$first': '$lng' },
        'location': { '$first': '$location' },
      }
    }
  ]
}




//quantidades de embalagens
  // ('packings').find({}).count()

  // quantidade de embalagens perdidas 
  // ('packings').find({ missing: true }).count()

  //quantiade de embalagens incorretas
  // ('packings').find({ problem: true }).count()

  //quantiade de balagens em viagem
  // ('packings').find({'$and' : [{'trip.time_countdown': {'$gt': 0}}, {'trip.time_exceeded': false}]}).count()

  //quantidade que excederam o tempo  de permanencia 
  //('packings').find({'permanence.time_exceeded': true})


   //quantidade que excederam o tempo  de viagem 
  // ('packings').find({ 'trip.time_exceeded': true })