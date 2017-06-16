'use strict';

exports.queries = {
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
        },{
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
        }];
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
            },{
                "$unwind": "$plantObject"
            },{
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
            },{
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
    "listPackingsNoBinded": [
    {
        "$lookup": {
            "from": "routes",
            "localField": "hashPacking",
            "foreignField": "hashPacking",
            "as": "packingObject"
        }
    }, {
        "$unwind": {
            "path": "$packingObject",
            'preserveNullAndEmptyArrays': true
        }
    }, {
        "$match": {
            "packingObject": {
                "$exists": false
            }
        }
    }, {
        '$group': {
            "_id": {
                    "code": "$code",
                    "supplier": "$supplier"
                },
            "code": {
                "$first": "$code"
            }
        }
    }],
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
    },{
        "$group": {
            "_id": {
                "code": "$code",
            },
            "code": {
                "$first":"$code"
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
        },{
            "$unwind": "$plantObject"
        },{
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
        },{
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
