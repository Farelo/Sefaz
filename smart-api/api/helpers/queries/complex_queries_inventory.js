'use strict';
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.queries = {
  inventory_general: function(supplier_array){
    return [ {"$match": {"supplier": { "$in": supplier_array } }},
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
        "$match": {
            "actual_plant.plant": { "$exists": true, "$ne": null }
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
  historic_packing: function(serial,supplier_array) {
    return [
      {"$match": {"supplier": { "$in": supplier_array }, "serial": serial}},
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
  quantity_inventory: function(code,supplier_array){
    return [
      {"$match": {"supplier": { "$in": supplier_array }, "code": code}},
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
  ]
}
