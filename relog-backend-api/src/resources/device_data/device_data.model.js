const mongoose = require("mongoose");
const { Rack } = require("../racks/racks.model");
const logger = require("../../config/winston.config");

const deviceDataSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true
  },
  message_date: {
    type: Date,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  message_date_timestamp: {
    type: Number,
    required: true
  },
  last_communication: {
    type: Date
  },
  last_communication_timestamp: {
    type: Number
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  accuracy: {
    type: Number
  },
  temperature: {
    type: Number
  },
  seq_number: {
    type: Number
  },
  battery: {
    percentage: {
      type: Number
    },
    voltage: {
      type: Number
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String
  }
});

deviceDataSchema.index(
  { device_id: 1, message_date_timestamp: -1 },
  { unique: true }
);

const update_rack = async (device_data, next) => {
  //logger.info("Update rack after save DeviceData");
  try {
    let update_attrs = {};
    let update = false; 
    const rack = await Rack.findByTag(device_data.device_id);

    if (!rack) next();

    let current_message_date_on_rack = await DeviceData.findById(
      rack.last_device_data,
      { _id: 0, message_date: 1 }
    );

    current_message_date_on_rack = current_message_date_on_rack
      ? current_message_date_on_rack.message_date
      : null;

    //se o novo device_data é mais recente que o que já esta salvo, então atualiza
    if (device_data.message_date > current_message_date_on_rack) {
      update_attrs.last_device_data = device_data._id;

      update = true;
    }

    //se o novo device_data possui informação de bateria
    if (device_data.battery.percentage || device_data.battery.voltage) {
      let rack_date_battery_data = await DeviceData.findById(
        rack.last_device_data_battery,
        { _id: 0, message_date: 1 }
      );

      rack_date_battery_data = rack_date_battery_data
        ? rack_date_battery_data.message_date
        : null;

      // se essa informação de bateria é mais recente que a que ja existe no rack ou o rack não tem ainda nenhuma info de bateria
      if (device_data.message_date > rack_date_battery_data) {
        update_attrs.last_device_data_battery = device_data._id;
      }

      update = true;
    }

    if (update)
      await Rack.findByIdAndUpdate(rack._id, update_attrs, { new: true });

    next();
    //logger.info("Update rack after save DeviceData SUCESS!");
  } catch (error) {
    //logger.info("Update rack after save DeviceData ERROR!");
    //logger.info(error);

    next(error);
  }
};

deviceDataSchema.statics.findByDeviceId = function(device_id, projection = "") {
  return this.findOne({ device_id }, projection);
};

deviceDataSchema.statics.findMosRecentById = function(id) {
  return this.find({ device_id: id })
    .sort({ _id: -1 })
    .limit(1);
};

const saveDeviceDataToRack = function(doc, next) {
  update_rack(doc, next);
};

const update_updated_at_middleware = function(next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

const device_data_save = async device_data => {
  //logger.info("Saving DeviceData: " + device_data.device_id);
  const new_device_data = new DeviceData({
    device_id: device_data.device_id.toString(),
    message_date: device_data.message_date,
    message_date_timestamp: device_data.message_date_timestamp,
    message_type: device_data.message_type,
    last_communication: device_data.last_communication,
    last_communication_timestamp: device_data.last_communication_timestamp,
    latitude: device_data.latitude,
    longitude: device_data.longitude,
    accuracy: device_data.accuracy,
    temperature: device_data.temperature,
    seq_number: device_data.seq_number,
    battery: {
      percentage: device_data.battery.percentage,
      voltage: device_data.battery.voltage
    },
    message: device_data.message
  });

  try {
    //salva no banco | observação: não salva mensagens iguais porque o model possui indice unico e composto por device_id e message_date,
    //e o erro de duplicidade nao interrompe o job
    await new_device_data.save();
    logger.info("Saved:\t" + new_device_data);
    //.info("Save DeviceData with Sucess!");

    // debug('Saved device_data ', device_data.deviceId, ' and message_date ', device_data.messageDate)
  } catch (error) {
    try {
      new_device_data.update();
      logger.info("Updated: \t" + new_device_data);
    } catch (error) {
      logger.info("Error to save DeviceData!");
      logger.info(new_device_data);
      logger.info(error);
    }
  }
};

deviceDataSchema.post("save", saveDeviceDataToRack);
deviceDataSchema.pre("update", update_updated_at_middleware);
deviceDataSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const DeviceData = mongoose.model("DeviceData", deviceDataSchema);

exports.DeviceData = DeviceData;
exports.deviceDataSchema = deviceDataSchema;
exports.device_data_save = device_data_save;
