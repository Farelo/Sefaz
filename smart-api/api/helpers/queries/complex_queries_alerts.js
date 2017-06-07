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
                "hash": "$hashpacking"
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
            }
        }
    }],
    retrieve: function (code) {
      return [{
            "$match": {
                "packing": "ObjectId("+code+")",
            }
        },{
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
            "$lookup": {
                "from": "plants",
                "localField": "correct_plant_supplier",
                "foreignField": "_id",
                "as": "correct_plant_supplierObject"
            }
        }, {
            "$lookup": {
                "from": "plants",
                "localField": "correct_plant_factory",
                "foreignField": "_id",
                "as": "correct_plant_factoryObject"
            }
        }, {
            "$lookup": {
                "from": "departments",
                "localField": "department",
                "foreignField": "_id",
                "as": "departmentObject"
            }
        }, {
            "$lookup": {
                "from": "plants",
                "localField": "actual_plant",
                "foreignField": "_id",
                "as": "actual_plantObject"
            }
        }, {
            "$unwind": "$packingObject"
        }, {
            "$unwind": "$departmentObject"
        }, {
            "$unwind": "$supplierObject"
        }, {
            "$unwind": "$correct_plant_factoryObject"
        }, {
            "$unwind": "$correct_plant_supplierObject"
        }, {
            "$unwind": "$actual_plantObject"
        }, {
            "$project": {
                "_id": "$packingObject._id",
                "code": "$packingObject.code" ,
                "type": "$packingObject.type" ,
                "supplier":  "$supplierObject",
                "correct_plant_supplier":  "$correct_plant_supplierObject",
                "correct_plant_factory": "$correct_plant_factoryObject",
                "actual_plant":"$actual_plantObject",
                "department": "$departmentObject",
                "status":"$status"
                }
            }
        ]
    },
    listAllByHasshing: function (hashpacking) {
      return [{
         "$match": {
             "hashpacking": hashpacking,
         }
     },{
         "$lookup": {
             "from": "packings",
             "localField": "packing",
             "foreignField": "_id",
             "as": "packingObject"
         }
     }, {
         "$unwind": "$packingObject"
     }]
    }



}
