//Pesquisa geral
[ {
      "$group": {
        "_id": {
          "code": "$code",
          "supplier": "$supplier"
        },
        "code": {
          "$first": "$code"
        },
        "supplier": {
          "$first": "$supplier"
        },
        "description": {
          "$first": "$type"
        },
        "project": {
            "$first": "$project"
        },
        "quantity": {
          "$sum": 1
        },
        "gc16" : {
            "$first": "$gc16"
        }

      }
    }]
//Pesquisa geral por planta
[ {
       "$match": {
          "supplier": ObjectId(),
           "code": code
        }
      },
    {
      "$group": {
        "_id": {
          "code": "$code",
          "plant": "$actual_plant",
          "supplier": "$supplier"
        },
        "code": {
          "$first": "$code"
        },
        "supplier": {
          "$first": "$supplier"
        },
        "actual_plant": {
          "$first": "$actual_plant"
        },
        "description": {
          "$first": "$type"
        },
        "project": {
            "$first": "$project"
        },
        "quantity": {
          "$sum": 1
        },
        "gc16" : {
            "$first": "$gc16"
        }

      }
    }]
