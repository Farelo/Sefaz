const { EventRecord } = require("./event_record.model");
const { CurrentStateHistory } = require("../current_state_history/current_state_history.model");

exports.find_by_control_point_and_date = async (conditions, currentState) => {
  try {

    let event_records = await EventRecord.aggregate([
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
          from: "families",
          localField: "packing.family",
          foreignField: "_id",
          as: "family"
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
      {
        $lookup: {
          from: "controlpoints",
          localField: "control_point",
          foreignField: "_id",
          as: "control_point"
        }
      },
      { $unwind: '$packing' },
      { $unwind: '$devicedata' },
      { $unwind: '$family' },
      { $unwind: '$control_point' },
      { $group: { _id: "$packing", "doc": { "$first": "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } }
    ])

    // console.log('conditions: ', conditions)
    // console.log('event_records.length: ', event_records.length)
    // console.log('event_records: ', JSON.stringify(event_records))

    let mPack = {};

    event_records = await Promise.all(event_records.map(async actualEventRecord => {
      let result = null
      if (currentState !== null) {
        result = await CurrentStateHistory
          .find({ type: currentState, device_data_id: actualEventRecord.device_data_id, packing: actualEventRecord.packing._id, created_at: conditions.created_at  }) //{ $gte: actualEventRecord.created_at }
          .sort({ created_at: -1 })
          .limit(1);

      } else {

        // if(actualEventRecord.device_id == '4073239')
        //   mPack = { packing: actualEventRecord.packing._id, device_data_id: actualEventRecord.device_data_id, created_at: conditions.created_at };

        result = await CurrentStateHistory
          .find({ packing: actualEventRecord.packing._id, device_data_id: actualEventRecord.device_data_id, created_at: conditions.created_at })
          .sort({ created_at: -1 })
          .limit(1);
      }

      actualEventRecord.current_state = result.length > 0 ? result[0].type : 'none'

      return actualEventRecord
    }))

    if (currentState == null) {
      event_records = event_records.filter(elem => {
        return elem.current_state !== 'none'
      })
    } else {
      event_records = event_records.filter(elem => {
        return elem.current_state == currentState
      })
    }

    // console.log("###", event_records.length)
    // console.log(event_records[0])

    // event_records = event_records.map(elem => {
    //   let device_data = {
    //     battery: elem.battery,
    //     accuracy: elem.accuracy,
    //     message_date: elem.message_date,
    //     latitude: elem.latitude,
    //     longitude: elem.longitude,
    //     current_state: elem.current_state
    //   }

    //   elem.devicedata = device_data

    //   return elem
    // })

    return event_records

  } catch (error) {
    throw new Error(error);
  }
};