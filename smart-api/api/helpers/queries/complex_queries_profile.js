exports.queries = {
  profiles: [{
      "$match": {
        "$or": [{
          "profile": {
            "$in": ["Supplier"]
          }
        }, ]
      }
    },
    {
      "$lookup": {
        "from": "suppliers",
        "localField": "_id",
        "foreignField": "profile",
        "as": "supplier"
      }
    }, {
      "$lookup": {
        "from": "admins",
        "localField": "_id",
        "foreignField": "profile",
        "as": "admin"
      }
    },
    {
      "$unwind": {
        "path": "$supplier",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      "$unwind": {
        "path": "$admin",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      $project: {
        "_id": '$_id',
        "_id": '$_id',
        "profile": "$profile",

        "email": "$email",
        "city": "$city",
        "street": "$street",
        "telephone": "$telephone",
        "cellphone": "$cellphone",
        "cep": "$cep",
        "neighborhood": "$neighborhood",
        "uf": "$uf",
        "user": {
          '$cond': {
            if: '$admin',
            then: '$admin',
            else: "$supplier"
          }
        }
      }
    }
  ]
}
