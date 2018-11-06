const moment = require('moment')

const { Family } = require('../../models/families.model')

module.exports = async (packing, setting) => {
    if (packing.family.routes.length > 0) {
        // console.log(">>>>>>>> TEM ROTA")

        // const family = await Family.findById(packing.family).populate('routes')
        // console.log(family)

    }
}

// traveling_time
    // max
    // min
    // overtime