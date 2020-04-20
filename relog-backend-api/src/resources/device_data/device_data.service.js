const debug = require("debug")("service:device_data");
const _ = require("lodash");
const { DeviceData } = require("./device_data.model");
const { CurrentStateHistory } = require("../current_state_history/current_state_history.model");
const { Family } = require("../families/families.model");
const { Packing } = require("../packings/packings.model");

exports.find_packing_by_device_id = async device_id => {
  try {
    const tag = { code: device_id };
    const packing = await Packing.findByTag(tag);

    return packing;
  } catch (error) {
    throw new Error(error);
  }
};

exports.get_device_data = async (
  device_id,
  { start_date = null, end_date = null, accuracy = null, max = null }
) => {
  let device_data = [];
  let conditions = {};
  let projection = {};
  let options = {};

  conditions.device_id = device_id;
  options.sort = { message_date: -1 };

  try {
    if (start_date && end_date)
      if (isNaN(start_date) && isNaN(end_date))
        conditions.message_date = {
          $gte: new Date(start_date),
          $lte: new Date(end_date)
        };
      else
        conditions.message_date_timestamp = {
          $gte: start_date,
          $lte: end_date
        };
    else if (start_date)
      if (isNaN(start_date))
        conditions.message_date = { $gte: new Date(start_date) };
      else conditions.message_date_timestamp = { $gte: start_date };
    else if (end_date)
      if (isNaN(start_date))
        conditions.message_date = { $lte: new Date(end_date) };
      else conditions.message_date_timestamp = { $lte: end_date };

    if (accuracy) conditions.accuracy = { $lte: accuracy };

    if (max) options.limit = parseInt(max);

    device_data = await DeviceData.find(conditions, projection, options);

    return device_data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.geolocation = async (
  query = { company_id: null, family_id: null, packing_serial: null }
) => {
  try {
    let packings = [];
    let families = [];
    let data = [];

    switch (true) {
      case query.company_id != null &&
        query.family_id != null &&
        query.packing_serial != null:
        families = await Family.find({ _id: query.family_id });
        data = await Promise.all(
          families.map(async family => {
            return await Packing.find({
              family: family._id,
              serial: query.packing_serial
            })
              .populate("last_device_data")
              .populate("last_device_data_battery")
              .populate("family");
          })
        );
        packings = _.flatMap(data);
        break;
      case query.company_id != null && query.family_id != null:
        families = await Family.find({ _id: query.family_id });
        data = await Promise.all(
          families.map(async family => {
            return await Packing.find({ family: family._id })
              .populate("last_device_data")
              .populate("last_device_data_battery")
              .populate("family");
          })
        );
        packings = _.flatMap(data);
        break;
      case query.company_id != null && query.packing_serial != null:
        families = await Family.find({ company: query.company_id });
        data = await Promise.all(
          families.map(async family => {
            return await Packing.find({
              family: family._id,
              serial: query.packing_serial
            })
              .populate("last_device_data")
              .populate("last_device_data_battery")
              .populate("family");
          })
        );
        packings = _.flatMap(data);
        break;
      case query.family_id != null && query.packing_serial != null:
        packings = await Packing.find({
          family: query.family_id,
          serial: query.packing_serial
        })
          .populate("last_device_data")
          .populate("last_device_data_battery")
          .populate("family");
        break;
      case query.company_id != null:
        families = await Family.find({ company: query.company_id });
        data = await Promise.all(
          families.map(async family => {
            return await Packing.find({ family: family._id })
              .populate("last_device_data")
              .populate("last_device_data_battery")
              .populate("family");
          })
        );
        packings = _.flatMap(data);
        break;
      case query.family_id != null:
        packings = await Packing.find({ family: query.family_id })
          .populate("last_device_data")
          .populate("last_device_data_battery")
          .populate("family");
        break;
      case query.packing_serial != null:
        packings = await Packing.find({ serial: query.packing_serial })
          .populate("last_device_data")
          .populate("last_device_data_battery")
          .populate("family");
        break;
      default:
        packings = await Packing.find({})
          .populate("last_device_data")
          .populate("last_device_data_battery")
          .populate("family");
        break;
    }

    return packings;
  } catch (error) {
    throw new Error(error);
  }
};

exports.find_by_date = async (conditions, currentState) => {
  try {

    let device_data_records = await DeviceData.aggregate([
      { $match: conditions },
      { $sort: { "created_at": -1 } },
      {
        $lookup: {
          from: "packings",
          localField: "device_id",
          foreignField: "tag.code",
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
      { $unwind: '$packing' },
      { $unwind: '$family' },
      { $group: { _id: "$packing", "doc": { "$first": "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } }
    ])

    console.log(device_data_records[0])
    console.log("***", device_data_records.length)

    device_data_records = await Promise.all(device_data_records.map(async elem => {
      let result = null
      if (currentState !== null) {
        result = await CurrentStateHistory.findOne({ type: currentState, packing: elem.packing._id, created_at: { $gte: elem.created_at } })
      } else {
        result = await CurrentStateHistory.findOne({ packing: elem.packing._id, created_at: { $gte: elem.created_at } })
      }

      elem.current_state = result ? result.type : ''
      return elem
    }))

    console.log("$$$", device_data_records.length)
    console.log("$$$", currentState)

    if (currentState !== null) {
      device_data_records = device_data_records.filter(elem => {
        return elem.current_state == currentState
      })
    }

    console.log("###", device_data_records.length)
    console.log(device_data_records[0])

    device_data_records = device_data_records.map(elem => {
      let device_data = {
        battery: elem.battery,
        accuracy: elem.accuracy,
        message_date: elem.message_date,
        latitude: elem.latitude,
        longitude: elem.longitude,
        current_state: elem.current_state
      }

      elem.devicedata = device_data

      return elem
    })

    return device_data_records

  } catch (error) {
    throw new Error(error);
  }
};

exports.createDeviceData = async deviceData => {
  try {
    const newDeviceData = new DeviceData(deviceData);
    await newDeviceData.save();

    return newDeviceData;
  } catch (error) {
    throw new Error(error);
  }
};
