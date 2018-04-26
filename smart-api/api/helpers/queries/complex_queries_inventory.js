'use strict';


exports.queries = {
  absence_general: function (equipamento, serial, time, local)  {
    const code = equipamento;//equipamento ? { 'code': equipamento } : {};
    
    return [
      serial ? { '$match': { 'serial': serial } } : { '$match': { 'code': { '$exists': true } } },
      code ? { '$match': { 'code': code } } : { '$match': { 'code': { '$exists': true } } },
      {
        '$lookup':
          {
            "from": "historicpackings",
            "localField": "_id",
            "foreignField": "packing",
            "as": "historic"
          }
      },
      local ?   
        {
          '$project': {
            'historico_last': {
              $filter: {
                input: '$historic',
                as: "num",
                cond: { '$eq': ['$$num.plant.local', local] }
              }
            },
            'historic': '$historic',
            "actual_plant": "$actual_plant",
            "last_plant": "$last_plant",
            "serial": "$serial",
            "code": "$code",
          }
        }
      :
        {
          '$project': {
            'historico_last': {
              $filter: {
                input: '$historic',
                as: "num",
                cond: { '$or': [{ '$eq': ['$$num.plant.local', 'Factory']}, {'$eq': ['$$num.plant.local', 'Supplier'] }] }
          
              }
            },
            'historic': '$historic',
            "actual_plant": "$actual_plant",
            "last_plant": "$last_plant",
            "serial": "$serial",
            "code": "$code",
          }
        }
      ,
      { '$unwind': '$historico_last' },
      { "$sort": { "historico_last.date": -1 } },
      {
        "$group": {
          "_id": "$_id",
          "base_time": {
            "$first": {
              "$subtract": [
                1524702771308,
                {
                  "$sum": [
                    "$historico_last.date",
                    "$historico_last.permanence_time"
                  ]
                }
              ]
            }
          },
          "historic": {
            "$first": "$historic"
          },
          "serial": {
            "$first": "$serial"
          },
          "code": {
            "$first": "$code"
          },
          "actual_plant": {
            "$first": "$actual_plant"
          },
          "last_plant": {
            "$first": "$last_plant"
          }
        }
      },
      { '$unwind': '$historic' },
      { "$sort": { "historic.date": -1 } },
      {
        "$group": {
          "_id": "$_id",
          "base_time": {
            "$first": '$base_time'
              
          },
          "historic": {
            "$first": "$historic"
          },
          "serial": {
            "$first": "$serial"
          },
          "code": {
            "$first": "$code"
          },
          "actual_plant": {
            "$first": "$actual_plant"
          },
          "last_plant": {
            "$first": "$last_plant"
          }
        }
      },
      {
        "$match": {
          "historic.plant.local": { '$ne': local }
        }
      },
      {
        '$lookup':
          {
            "from": "plants",
            "localField": "actual_plant.plant",
            "foreignField": "_id",
            "as": "actualplant"
          }
      },
      {
        '$lookup':
          {
            "from": "plants",
            "localField": "last_plant.plant",
            "foreignField": "_id",
            "as": "lastplant"
          }
      },
      {
        '$unwind': {
          "path": "$actualplant",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$unwind': {
          "path": "$lastplant",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        $project: {
          "_id": 1,
          "code": 1,
          "serial": 1,
          "base_time": 1,
          "lastplant": {
            '$cond': {
              if: '$actualplant',
              then: '$actualplant',
              else: '$lastplant'
            }
          }
        }
      },
      time ? { '$match': { 'base_time': { '$gte': time * 86400000 } } } : { '$match': { '$exists': [{ 'code': true }] } }
    ]},
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
