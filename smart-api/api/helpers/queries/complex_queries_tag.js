exports.queries = {
    "listTagsNoBinded": [{
        "$lookup": {
            "from": "packings",
            "localField": "mac",
            "foreignField": "tag_mac",
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
    }],
    "listTagsNoBindedAmount": [{
        "$lookup": {
            "from": "packings",
            "localField": "mac",
            "foreignField": "tag_mac",
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
      },
        { "$group": { "_id": null, "count": { "$sum": 1 } }}
      ],
    "listTagsBindedAndNoBinded": [{
            "$lookup": {
                "from": "packings",
                "localField": "mac",
                "foreignField": "tag_mac",
                "as": "packingObject"
            },
        },
        {
            "$project": {
                "_id": "$_id",
                "code": "$code",
                "mac": "$mac",
                "friendly_name": '$friendly_name',
                "status": {
                    $size: "$packingObject"
                }
            }
        }
    ]
}
