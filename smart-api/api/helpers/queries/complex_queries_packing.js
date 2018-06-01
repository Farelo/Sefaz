'use strict';

const schemas  = require("../../schemas/require_schemas")
const ObjectId = schemas.ObjectId

exports.queries = {
  detailed_inventory: (supplier_id, package_code) => (
    [
      supplier_id ? { "$match": { "supplier": new ObjectId(supplier_id) } } : { "$match": { "supplier": { "$exists": true } } },
      package_code ? { "$match": { "code": package_code } } : { "$match": { "code": { "$exists": true } } },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$lookup": {
          "from": "historicpackings",
          "localField": "_id",
          "foreignField": "packing",
          "as": "historicpackingsObject"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "supplier": "$supplier",
            "project": "$project",
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantityTotal": {
            "$sum": 1
          },
          "quantityTraveling": {
            "$sum": { "$cond": [{ "$eq": ["$traveling", true] }, 1, 0] }
          },
          "quantityProblem": {
            "$sum": { "$cond": [{ "$eq": ["$problem", true] }, 1, 0] }
          },
          "quantityMissing": {
            "$sum": { "$cond": [{ "$eq": ["$missing", true] }, 1, 0] }
          },
          "quantityInFactory": {
            "$sum": { "$cond": [{ "$eq": ['$actual_plant.local', 'Factory'] }, 1, 0] },
          },
          "quantityInSupplier": {
            "$sum": { "$cond": [{ "$eq": ['$actual_plant.local', 'Supplier'] }, 1, 0] },
          },
          "quantityTimeExceeded": {
            "$sum": { "$cond": [{ "$eq": ['$trip.time_exceeded', true] }, 1, 0] }
          }
        }
      }
    ]
  ),
  detailed_inventory_by_plant: (supplier_id, package_code)=> (
    [
      { "$match": { "supplier": new ObjectId(supplier_id) } },
      { "$match": { "code": package_code } },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },

      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "supplier": "$supplier",
            "plant": "$actual_plant.plant",
            "code": "$code",
            "problem": "$problem"
          },
          "current_plant": {
            "$first": {
              "plant": '$plantObject',
              "local": '$actual_plant.local'
            }
          },
          "quantityTotal": {
            "$sum": 1
          },
        }
      }
    ]
  ),
  detailed_inventory_by_alert: (supplier_id)=> (
    [
      { "$match": { "supplier": new ObjectId(supplier_id) } },
      {
        "$lookup": {
          "from": "packings",
          "localField": "packing",
          "foreignField": "_id",
          "as": "packingObject"
        }
      },
      {
        "$unwind": {
          "path": "$packingObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "packing_code": "$packingObject.code",
            "supplier": "$supplier"
          },
          "package_code": {
            "$first": "$packingObject.code"
          },
          "lost_object": {
            "$sum": { "$cond": [{ "$eq": ["$status", 1] }, 1, 0] }
          },
          "incorrect_object": {
            "$sum": { "$cond": [{ "$eq": ["$status", 2] }, 1, 0] }
          },
          "low_battery": {
            "$sum": { "$cond": [{ "$eq": ["$status", 3] }, 1, 0] }
          },
          "late_object": {
            "$sum": { "$cond": [{ "$eq": ["$status", 4] }, 1, 0] }
          },
          "permanence_time": {
            "$sum": { "$cond": [{ "$eq": ["$status", 5] }, 1, 0] }
          },
        }
      }
    ]
  ),
  inventory_general: function(attr){
    return [ 
      attr ?  {"$match": {"supplier": new ObjectId(attr) }} : {"$match": { "supplier": { "$exists": true}}},
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },

      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "supplier": "$supplier",
            "project": "$project",
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          }
        }
      }
    ]
  },
  inventory_general_by_plant: function(code, supplier,project, attr) {
    return [
      {
        "$match": {
          "supplier": supplier,
          "code": code,
          "project": project,
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant.plant",
            "supplier": "$supplier",
            "project": "$project",
            "missing": "$missing",
            "traveling": "$traveling"
          },
          "code": {
            "$first": "$code"
          },
          "traveling": {
            "$first": "$traveling"
          },
          "missing": {
            "$first": "$missing"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": {
              "plant":'$plantObject',
              "local":'$actual_plant.local'
            }
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          }
        }
      }
    ]
  },
  supplier_inventory: function(id,attr) {
    return [
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$match": {
          "supplierObject._id": id,
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant.plant",
            "supplier": "$supplier",
            "project": "$project",
            "missing": "$missing"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": {
              "plant":'$plantObject',
              "local":'$actual_plant.local'
            }
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          }
        }
      }
    ]

  },
  historic_packing: function(serial,attr) {
    return [
       attr ?  {"$match": {"supplier": new ObjectId(attr), "serial": serial}} : {"$match": { "serial": serial}},
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "tags",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$lookup": {
          "from": "historicpackings",
          "localField": "_id",
          "foreignField": "_id",
          "as": "packingtag"
        }
      },
      {
        "$unwind": {
          "path": "$historicpackingsObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant.plant",
            "supplier": "$supplier",
            "missing": "$missing"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": {
              "plant":'$plantObject',
              "local":'$actual_plant.local'
            }
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          },
          "historic": {
            "$first": "$historicpackingsObject"
          }
        }
      }
    ]
  },
  quantity_total: function(code){
    return [
       {
        "$match": {
          "code": code,
        }
      },
      {
        "$group": {
          "_id": {
            "missing": "$missing"
          },
          "quantity": {
            "$sum": 1
          },
          "missing": {
            "$first": "$missing"
          }
        }
      }
    ];
  },
  quantity_inventory: function(code,attr){
    return [
      attr ?  {"$match": {"supplier": new ObjectId(attr), "code": code}} : {"$match": { "code": code}},
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant.plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$lookup": {
          "from": "historicpackings",
          "localField": "_id",
          "foreignField": "packing",
          "as": "historicpackingsObject"
        }
      },
      {
        "$unwind": {
        "path": "$supplierObject",
        'preserveNullAndEmptyArrays': true
      }
      }, {
        "$unwind": {
        "path": "$projectObject",
        'preserveNullAndEmptyArrays': true
      }
      },{
        "$unwind": {
        "path": "$plantObject",
        'preserveNullAndEmptyArrays': true
      }
      },
       {
        "$unwind": {
        "path": "$gc16Object",
        'preserveNullAndEmptyArrays': true
      }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant.plant",
            "supplier": "$supplier",
            "supplier": "$supplier",
            "missing": "$missing",
            "problem": "$problem",
            "traveling": "$traveling",
            "project": "$project",
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": {
              "plant":'$plantObject',
              "local":'$actual_plant.local'
            }
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          },
          "actual_gc16": {
            "$first": "$actual_gc16"
          },
          "missing": {
            "$first": "$missing"
          },
          "serial": {
            "$first": "$serial"
          },
          "problem": {
            "$first": "$problem"
          },
          "traveling": {
            "$first": "$traveling"
          },
          "historic": {
              "$first": "$historicpackingsObject"
          }
        }
      }
    ];
  },
  populate: [
    "plant.plant",
    "supplier",
    "packing",
    {
      path: 'packing',
      populate: {
        path: 'supplier',
        model: 'Supplier'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'project',
        model: 'Project'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'actual_plant.plant',
        model: 'Plant'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'gc16',
        model: 'GC16'
      }
    }
  ],
  packingList: function(code) {
    return [{
        "$match": {
          "actual_plant": {
            "$exists": true
          },
          "department": {
            "$exists": true
          },
          "code": code,
          "missing": false,
          "problem": false

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
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      }, {
        "$unwind": "$plantObject"
      }, {
        "$unwind": "$departmentObject"
      }, {
        "$unwind": "$supplierObject"
      }, {
        "$group": {
          "_id": {
            "department": "$department",
            "plant": "$actual_plant",
            "supplier": "$supplier"
          },
          "quantity": {
            "$sum": 1
          },
          "plant": {
            "$first": "$plantObject"
          },
          "department": {
            "$first": "$departmentObject"
          },
          "supplier": {
            "$first": "$supplierObject"
          }
        }
      }
    ];
  },
  quantityFound: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },
        "code": code,
        "missing": false
      }
    }, {
      "$group": {
        "_id": "$code",
        "quantity": {
          "$sum": 1
        }
      }
    }]
  },
  existingQuantity: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },
        "code": code
      }
    }, {
      "$group": {
        "_id": "$code",
        "quantity": {
          "$sum": 1
        }
      }
    }]
  },

  listPackingMissing: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          $exists: true
        },
        "department": {
          $exists: true
        },
        "code": code,
        "missing": true
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
        "as": "plantObject"
      }
    }, {
      "$unwind": "$plantObject"
    }, {
      "$unwind": "$departmentObject"
    }, {
      "$group": {
        "_id": {
          "department": "$department",
          "plant": "$actual_plant",
          "supplier": "$supplier"

        },
        "quantity": {
          "$sum": 1
        },
        "plant": {
          "$first": "$plantObject"
        },
        "department": {
          "$first": "$departmentObject"
        },
        "missing": {
          "$first": "$missing"
        }
      }
    }]
  },
  listPackingProblem: function(code) {
    return [{
        "$match": {
          "actual_plant": {
            "$exists": true
          },
          "department": {
            "$exists": true
          },
          "code": code,
          "problem": true
        }
      }, {
        "$lookup": {
          "from": "routes",
          "localField": "hashPacking",
          "foreignField": "hashPacking",
          "as": "routeObject"
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
          "as": "plantObject"
        }
      }, {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "ObjectSupplier"
        }
      }, {
        "$unwind": "$plantObject"
      }, {
        "$unwind": "$ObjectSupplier"
      }, {
        "$unwind": "$departmentObject"
      }, {
        "$unwind": "$routeObject"
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "routeObject.plant_factory",
          "foreignField": "_id",
          "as": "plantObjectCorrectFactory"
        }
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "routeObject.plant_supplier",
          "foreignField": "_id",
          "as": "plantObjectCorrectSupplier"
        }
      }, {
        "$unwind": "$plantObjectCorrectFactory"
      },
      {
        "$unwind": "$plantObjectCorrectSupplier"
      },

      {
        "$group": {
          "_id": {
            "department": "$departmentObject._id",
            "plant": "$plantObject._id",
            "supplier": "$ObjectSupplier._id"

          },
          "supplier": {
            "$first": "$ObjectSupplier.name"
          },
          "quantity": {
            "$sum": 1
          },
          "plant": {
            "$first": "$plantObject"
          },
          "department": {
            "$first": "$departmentObject"
          },
          "plantCorrectFactory": {
            "$first": "$plantObjectCorrectFactory"
          },
          "plantCorrectSupplier": {
            "$first": "$plantObjectCorrectSupplier"
          },
          "supplier": {
            "$first": "$ObjectSupplier"
          }
        }
      }
    ];
  },
  listPackingBySupplier: function(id) {

    return [{
        "$match": {
          "supplier": id,
          "gc16": {
            "$exists": false
          }
        }
      },
       {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$unwind": "$projectObject"
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "project": "$projectObject._id"
          },
          "packing": {
            "$first": "$code"
          },
          "project": {
            "$first": "$projectObject"
          }
        }
      }
    ];
  },
  listPackingDistinct: [
    {
      "$lookup": {
        "from": "projects",
        "localField": "project",
        "foreignField": "_id",
        "as": "projectObject"
      }
    },
    {
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "supplierObject"
      }
    }, {
      "$unwind": "$projectObject"
    }, {
      "$unwind": "$supplierObject"
    },
    {
      "$group": {
        "_id": {
          "code": "$code",
          "project": "$projectObject._id",
          "supplier": "$supplierObject._id"
        },
        "packing": {
          "$first": "$code"
        },
        "project": {
          "$first": "$projectObject"
        },
        "supplier": {
          "$first": "$supplierObject"
        }
      }

    }
  ],
  listPackingDistinctBySupplier: function (attr) {
    return [
      { "$match": { "supplier": new ObjectId(attr) } } , 
      {

      "$lookup": {
        "from": "projects",
        "localField": "project",
        "foreignField": "_id",
        "as": "projectObject"
      }
    },
    {
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "supplierObject"
      }
    }, {
      "$unwind": "$projectObject"
    }, {
      "$unwind": "$supplierObject"
    },
    {
      "$group": {
        "_id": {
          "code": "$code",
          "project": "$projectObject._id",
          "supplier": "$supplierObject._id"
        },
        "packing": {
          "$first": "$code"
        },
        "project": {
          "$first": "$projectObject"
        },
        "supplier": {
          "$first": "$supplierObject"
        }
      }

    }
  ]},
  listPackingDistinctByLogistic: function (attr) {
    return [
      { "$match": { "supplier": { "$in": attr } } } , 
      {

      "$lookup": {
        "from": "projects",
        "localField": "project",
        "foreignField": "_id",
        "as": "projectObject"
      }
    },
    {
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "supplierObject"
      }
    }, {
      "$unwind": "$projectObject"
    }, {
      "$unwind": "$supplierObject"
    },
    {
      "$group": {
        "_id": {
          "code": "$code",
          "project": "$projectObject._id",
          "supplier": "$supplierObject._id"
        },
        "packing": {
          "$first": "$code"
        },
        "project": {
          "$first": "$projectObject"
        },
        "supplier": {
          "$first": "$supplierObject"
        }
      }

    }
  ]},
  "listPackingsNoBinded": function(id) {
    return [
      {
      "$match": {
        "supplier": id
      }
    },{
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "ObjectSupplier"
      }
    },{
      "$lookup": {
        "from": "projects",
        "localField": "project",
        "foreignField": "_id",
        "as": "ObjectProject"
      }
    },{
      "$unwind": "$ObjectSupplier"
    },{
      "$unwind": "$ObjectProject"
    },{
      "$lookup": {
        "from": "plants",
        "localField": "ObjectSupplier.plant",
        "foreignField": "_id",
        "as": "ObjectPlant"
      }
    },{
      "$unwind": "$ObjectPlant"
    },{
      '$group': {
        "_id": {
          "code": "$code",
          "project": "$ObjectProject._id"
        },
        "id": {
            "$first": "$code"
        },
        "packing": {
          "$first": "$_id"
        },
        "supplier": {
            "$first": "$ObjectSupplier"
        },
        "plant": {
            "$first": "$ObjectPlant"
        },
        "project": {
            "$first": "$ObjectProject"
        }

      }
    }]
  },
  listPackingNoBindedWithCode: function(code) {
    return [{
      "$lookup": {
        "from": "routes",
        "localField": "code",
        "foreignField": "packing",
        "as": "packingObject"
      }
    }, {
      "$unwind": {
        "path": "$packingObject",
        'preserveNullAndEmptyArrays': true
      }
    }, {
      "$match": {
        '$or': [{
          "plantObject": {
            "$exists": false
          }
        }, {
          'code': code
        }]
      }
    }, {
      '$group': {
        "_id": "$code",
        "code": {
          "$first": "$code"
        }
      }
    }];
  },
  "packingListNoCode": [{
    "$match": {
      "actual_plant": {
        "$exists": true
      },
      "department": {
        "$exists": true
      },
      "missing": false,
      "problem": false

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
      "as": "plantObject"
    }
  }, {
    "$lookup": {
      "from": "routes",
      "localField": "hashPacking",
      "foreignField": "hashPacking",
      "as": "routeObject"
    }
  }, {
    "$unwind": "$plantObject"
  }, {
    "$unwind": "$routeObject"
  }, {
    "$unwind": "$departmentObject"
  }, {
    "$lookup": {
      "from": "suppliers",
      "localField": "routeObject.supplier",
      "foreignField": "_id",
      "as": "supplierObject"
    }
  }, {
    "$unwind": "$supplierObject"
  }, {
    "$group": {
      "_id": {
        "code": "$code",
        "department": "$department",
        "plant": "$actual_plant",
        "supplier": "$supplier"
      },
      "quantity": {
        "$sum": 1
      },
      "code": {
        "$first": "$code"
      },
      "plant": {
        "$first": "$plantObject"
      },
      "department": {
        "$first": "$departmentObject"
      },
      "supplier": {
        "$first": "$supplierObject"
      },
      "nothing": {
        "$sum": 1
      },
    }
  }],
  "quantityFoundNoCode": [{
    "$match": {
      "missing": false
    }
  }, {
    "$group": {
      "_id": "$code",
      "quantity": {
        "$sum": 1
      }
    }
  }],
  "existingQuantityNoCode": [{
    "$group": {
      "_id": "$code",
      "quantity": {
        "$sum": 1
      }
    }
  }],
  "listPackingMissingNoCodeNoRoute": [{
    "$match": {

      "missing": true
    }
  }, {
    "$group": {
      "_id": {
        "code": "$code",
      },
      "code": {
        "$first": "$code"
      },
      "quantity": {
        "$sum": 1
      },
      "missing": {
        "$first": "$missing"
      },
      "missing": {
        "$sum": 1
      }
    }
  }],
  "listPackingMissingNoCodeRoute": [{
    "$match": {
      "actual_plant": {
        $exists: true
      },
      "department": {
        $exists: true
      },

      "missing": true
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
      "as": "plantObject"
    }
  }, {
    "$lookup": {
      "from": "routes",
      "localField": "code",
      "foreignField": "packing",
      "as": "routeObject"
    }
  }, {
    "$unwind": "$plantObject"
  }, {
    "$unwind": "$departmentObject"
  }, {
    "$unwind": "$routeObject"
  }, {
    "$lookup": {
      "from": "suppliers",
      "localField": "routeObject.supplier",
      "foreignField": "_id",
      "as": "supplierObject"
    }
  }, {
    "$unwind": "$supplierObject"
  }, {
    "$group": {
      "_id": {
        "code": "$code",
        "department": "$department",
        "plant": "$actual_plant",
        "supplier": "$supplier"
      },
      "quantity": {
        "$sum": 1
      },
      "plant": {
        "$first": "$plantObject"
      },
      "department": {
        "$first": "$departmentObject"
      },
      "supplier": {
        "$first": "$supplierObject"
      },
      "missing": {
        "$first": "$missing"
      },
      "missing": {
        "$sum": 1
      },
    }
  }],
  "countAll": {

    "actual_plant": {
      "$exists": true
    },
    "department": {
      "$exists": true
    }


  },
  "listPackingProblemNoCode": [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },

        "problem": true
      }
    }, {
      "$lookup": {
        "from": "routes",
        "localField": "hashPacking",
        "foreignField": "hashPacking",
        "as": "routeObject"
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
        "as": "plantObject"
      }
    }, {
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "ObjectSupplier"
      }
    }, {
      "$unwind": "$plantObject"
    }, {
      "$unwind": "$ObjectSupplier"
    }, {
      "$unwind": "$departmentObject"
    }, {
      "$unwind": "$routeObject"
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "routeObject.plant_factory",
        "foreignField": "_id",
        "as": "plantObjectCorrectFactory"
      }
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "routeObject.plant_supplier",
        "foreignField": "_id",
        "as": "plantObjectCorrectSupplier"
      }
    }, {
      "$unwind": "$plantObjectCorrectFactory"
    },
    {
      "$unwind": "$plantObjectCorrectSupplier"
    },

    {
      "$group": {
        "_id": {
          "department": "$departmentObject._id",
          "plant": "$plantObject._id",
          "supplier": "$ObjectSupplier._id"

        },
        "supplier": {
          "$first": "$ObjectSupplier.name"
        },
        "quantity": {
          "$sum": 1
        },
        "code": {
          "$first": "$code"
        },
        "plant": {
          "$first": "$plantObject"
        },
        "department": {
          "$first": "$departmentObject"
        },
        "plantCorrectFactory": {
          "$first": "$plantObjectCorrectFactory"
        },
        "plantCorrectSupplier": {
          "$first": "$plantObjectCorrectSupplier"
        },
        "supplier": {
          "$first": "$ObjectSupplier"
        },
        "problem": {
          "$sum": 1
        }

      }
    }
  ]
}
