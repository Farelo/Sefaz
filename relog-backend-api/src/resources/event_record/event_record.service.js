const { EventRecord } = require("./event_record.model");

exports.find_by_control_point_and_date = async conditions => {
  try {

    const event_records = await EventRecord.aggregate([ 
        { $match: conditions },
        { $sort: { "created_at": -1 } }, 
        {
            $lookup: {
                from: "packings",
                localField: "packing",
                foreignField: "_id",
                as: "packing"
            }
        },
        {
            $lookup: {
                from: "devicedatas",
                localField: "device_data_id",
                foreignField: "_id",
                as: "devicedata"
            }
        },
        { $unwind: '$packing' },
        { $unwind: '$devicedata' },
        { $group : { _id : "$packing", "doc": { "$first":"$$ROOT" } } },
        { $replaceRoot : { newRoot: "$doc" } }
    ])

    return event_records

  } catch (error) {
    throw new Error(error);
  }
};