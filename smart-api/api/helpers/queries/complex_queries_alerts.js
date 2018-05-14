'use strict';

const schemas  = require("../../schemas/require_schemas")
const ObjectId = schemas.ObjectId

exports.queries = {
    'listAlerts': function (attr) {
        return [
            attr ? { "$match": { "supplier": new ObjectId(attr) } } : { "$match": { "supplier": { "$exists": true } } },
            {
                "$lookup": {
                    "from": "packings",
                    "localField": "packing",
                    "foreignField": "_id",
                    "as": "packingObject"
                }
            }, {
                "$lookup": {
                    "from": "projects",
                    "localField": "project",
                    "foreignField": "_id",
                    "as": "projectObject"
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
            }, {
                "$unwind": "$supplierObject"
            }, {
                "$unwind": "$projectObject"
            }
            , {
                "$group": {
                    "_id": {
                        "supplier": "$supplier",
                        "project": "$project",
                        "code": "$packingObject.code",
                        "status": "$status"
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
                    "project": {
                        "$first": "$projectObject"
                    },
                    "status": {
                        "$first": "$status"
                    },
                    "hash": {
                        "$first": "$hashpacking"
                    }
                }
            },
            { $sort: { status: 1 } }]
    },
    'listAlertsLogistic': function (supplier_array) {
        return [
            { "$match": { "supplier": { "$in": supplier_array } } },
            {
                "$lookup": {
                    "from": "packings",
                    "localField": "packing",
                    "foreignField": "_id",
                    "as": "packingObject"
                }
            }, {
                "$lookup": {
                    "from": "projects",
                    "localField": "project",
                    "foreignField": "_id",
                    "as": "projectObject"
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
            }, {
                "$unwind": "$supplierObject"
            }, {
                "$unwind": "$projectObject"
            }
            , {
                "$group": {
                    "_id": {
                        "supplier": "$supplier",
                        "project": "$project",
                        "code": "$packingObject.code",
                        "status": "$status"
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
                    "project": {
                        "$first": "$projectObject"
                    },
                    "status": {
                        "$first": "$status"
                    },
                    "hash": {
                        "$first": "$hashpacking"
                    }
                }
            },
            { $sort: { status: 1 } }]
    },
    packing_list: function (code, project, supplier, status, attr) {
        return [
            attr ? { "$match": { "supplier": new ObjectId(attr) } } : { "$match": { "supplier": { "$exists": true } } },
            {
                "$lookup": {
                    "from": "packings",
                    "localField": "packing",
                    "foreignField": "_id",
                    "as": "packingObject"
                }
            }, {
                "$lookup": {
                    "from": "projects",
                    "localField": "project",
                    "foreignField": "_id",
                    "as": "projectObject"
                }
            }, {
                "$lookup": {
                    "from": "plants",
                    "localField": "actual_plant.plant",
                    "foreignField": "_id",
                    "as": "plantObject"
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
            }, {
                "$unwind": "$supplierObject"
            }, {
                "$unwind": "$projectObject"
            }, {
                "$unwind": {
                    "path": "$plantObject",
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                "$match": {
                    "supplier": supplier,
                    "project": project,
                    "packingObject.code": code,
                    "status": status
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "quantity": {
                        "$sum": 1
                    },
                    "packing": {
                        "$first": "$packingObject"
                    },
                    "supplier": {
                        "$first": "$supplierObject"
                    },
                    "project": {
                        "$first": "$projectObject"
                    },
                    "plant": {
                        "$first": "$plantObject"
                    },
                    "status": {
                        "$first": "$status"
                    },
                    "date": {
                        "$first": "$date"
                    },
                    "serial": {
                        "$first": "$serial"
                    }
                }
            },
            { $sort: { status: 1 } }]
    },
    packing_list_logistic: function (code, project, supplier, status, supplier_array) {
        return [
            { "$match": { "supplier": { "$in": supplier_array } } },
            {
                "$lookup": {
                    "from": "packings",
                    "localField": "packing",
                    "foreignField": "_id",
                    "as": "packingObject"
                }
            }, {
                "$lookup": {
                    "from": "projects",
                    "localField": "project",
                    "foreignField": "_id",
                    "as": "projectObject"
                }
            }, {
                "$lookup": {
                    "from": "plants",
                    "localField": "actual_plant.plant",
                    "foreignField": "_id",
                    "as": "plantObject"
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
            }, {
                "$unwind": "$supplierObject"
            }, {
                "$unwind": "$projectObject"
            }, {
                "$unwind": {
                    "path": "$plantObject",
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                "$match": {
                    "supplier": supplier,
                    "project": project,
                    "packingObject.code": code,
                    "status": status
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "quantity": {
                        "$sum": 1
                    },
                    "packing": {
                        "$first": "$packingObject"
                    },
                    "supplier": {
                        "$first": "$supplierObject"
                    },
                    "project": {
                        "$first": "$projectObject"
                    },
                    "plant": {
                        "$first": "$plantObject"
                    },
                    "status": {
                        "$first": "$status"
                    },
                    "date": {
                        "$first": "$date"
                    },
                    "serial": {
                        "$first": "$serial"
                    }
                }
            },
            { $sort: { status: 1 } }]
    }


}
