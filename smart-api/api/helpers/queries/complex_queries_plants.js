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
  }
}
