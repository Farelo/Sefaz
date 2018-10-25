const debug = require('debug')('repository:reports')
const _ = require('lodash')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { Family } = require('../families/families.model')
const { Packing } = require('../packings/packings.model')
const { User } = require('../users/users.model')

exports.general_report = async () => {
    try {
        const aggregate = await Packing.aggregate([
            {
                $lookup: {
                    from: 'families',
                    localField: 'family',
                    foreignField: '_id',
                    as: 'family_object',
                },
            },
            {
                $unwind: {
                    path: '$family_object',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$family_object._id',
                    company: {
                        $first: '$family_object.company'
                    },
                    packings_quantity: { $sum: 1 },
                },
            }
        ])
        
        const data = await Promise.all(
            aggregate.map(async aggr => {
                let res = {}

                const family = await Family.findById(aggr._id)
                    .populate('company')

                res = {
                    family,
                    packings_quantity: aggr.packings_quantity
                }
                return res
            })
        )

        debug(data)
        return data
    } catch (error) {
        throw new Error(error)
    }
}