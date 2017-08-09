'use strict';

exports.queries = {
    'listAlerts':
    [{
        "$lookup": {
            "from": "packings",
            "localField": "packing",
            "foreignField": "_id",
            "as": "packingObject"
        }
    }, {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplier",
            "foreignField": "_id",
            "as": "supplierObject"
        }
    }, {
        "$unwind": "$packingObject"
    },  {
        "$unwind": "$supplierObject"
    }
   , {
        "$group": {
            "_id": {
                "hash": "$hashpacking",
                "status" : "$status"
            },
            "quantity": {
                "$sum": 1
            },
            "packing": {
                "$first": "$packingObject"
            },
            "supplier": {
                "$first": "$supplierObject"
            },
            "status": {
                "$first": "$status"
            },
            "hash": {
                "$first": "$hashpacking"
            }
        }
    },
  { $sort : { status : 1 } }]


}
