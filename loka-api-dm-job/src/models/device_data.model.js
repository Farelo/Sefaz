const debug = require("debug")("model:device_data");
const mongoose = require("mongoose");
const { Rack} = require("./racks.model");

const deviceDataSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  message_date: {
    type: Date,
    required: true,
  },
  message_date_timestamp: {
    type: Number,
    required: true,
  },
  last_communication: {
    type: Date,
  },
  last_communication_timestamp: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  accuracy: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  seq_number: {
    type: Number,
  },
  battery: {
    percentage: {
      type: Number,
    },
    voltage: {
      type: Number,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
});

deviceDataSchema.index({ device_id: 1, message_date: -1 }, { unique: true });

deviceDataSchema.statics.findByDeviceId = function (device_id, projection = "") {
  return this.findOne({ device_id }, projection);
};


const update_updated_at_middleware = function (next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

const device_data_save = async (rack, device_data_array) => {
  //Limpa do array todas as mensagens (exceto a primeira) que não tenham
  //acurácia, ou tenham acurácia com mais de 32km
  let newBatchOfMessages = [];

  newBatchOfMessages = device_data_array.filter((elem, index) => {
    let result = false;

    if (index == 0) {
      result = true;
    } else {
      if (elem.accuracy !== null && elem.accuracy !== undefined) {
        if (elem.accuracy <= 32000) result = true;
      }
    }

    return result;
  });

  if (newBatchOfMessages.length > 0) {
    let isLastSignalAlreadySaved = false;
    if (newBatchOfMessages[0].accuracy > 32000) {
      let update_attrs = {};
      update_attrs.last_message_signal = new Date(newBatchOfMessages[0].messageDate);
      await Rack.findByIdAndUpdate(rack._id, update_attrs, { new: true });
      newBatchOfMessages = newBatchOfMessages.slice(1);
      isLastSignalAlreadySaved = true;
    }

    for (const [idx, device_data] of newBatchOfMessages.entries()) {
      try {
        const new_device_data = new DeviceData({
          device_id: device_data.deviceId.toString(),
          message_date: new Date(device_data.messageDate),
          message_date_timestamp: device_data.messageDateTimestamp,
          last_communication: new Date(device_data.lastCommunication),
          last_communication_timestamp: device_data.lastCommunicationTimestamp,
          latitude: device_data.latitude,
          longitude: device_data.longitude,
          accuracy: device_data.accuracy,
          temperature: device_data.temperature,
          seq_number: device_data.seqNumber,
          battery: {
            percentage: device_data.battery.percentage,
            voltage: device_data.battery.voltage,
          },
        });

        // salva no banco | observação: não salva mensagens iguais porque o model possui
        // índice unico e composto por device_id e message_date, e o erro de duplicidade nao interrompe o job
        // Também atualiza o atributo 'last_message_signal'
        if (idx == 0) {
          if (!isLastSignalAlreadySaved) {
            let update_attrs = {};
            update_attrs.last_message_signal = new_device_data.message_date;
            await Rack.findByIdAndUpdate(rack._id, update_attrs, { new: true });
          }

          await new_device_data
            .save()
            .then((doc) => {
              update_link_to_last_devicedata(rack, doc);
            })
            .catch((err) => debug(err));
        } else {
          await new_device_data.save();
        }

        // debug('Saved device_data ', device_data.deviceId, ' and message_date ', device_data.messageDate)
      } catch (error) {
        debug(
          "Erro ao salvar o device_data do device  ",
          device_data.deviceId,
          " para a data-hora ",
          device_data.messageDate,
          " | System Error ",
          error.errmsg ? error.errmsg : error.errors
        );
      }
    }
  }

  // if (device_data_array.length > 0)
  //     update_link_to_last_devicedata(rack, device_data_array[0])
};

const update_link_to_last_devicedata = async (rack, device_data) => {
  try {
    let update_attrs = {};
    let update = false;

    //momento da última mensagem
    let current_message_date_on_rack = rack.last_device_data ? rack.last_device_data.message_date : null;

    //se o novo device_data é mais recente que o que já esta salvo, então atualiza
    if (device_data.message_date > current_message_date_on_rack) {
      update_attrs.last_device_data = device_data._id;
      update = true;
    }

    //se o novo device_data possui informação de bateria
    if (device_data.battery.percentage || device_data.battery.voltage) {
      let rack_date_battery_data = rack.last_device_data_battery
        ? rack.last_device_data_battery.message_date
        : null;

      // se essa informação de bateria é mais recente que a que ja existe no rack ou o rack não tem ainda nenhuma info de bateria
      if (device_data.message_date > rack_date_battery_data) {
        update_attrs.last_device_data_battery = device_data._id;
      }
      update = true;
    }

    if (update) {
      // debug(' ')
      // debug(' ')
      // debug(JSON.stringify(rack))
      // debug('update rack')
      // debug('last_device_data', rack.last_device_data)
      // debug('update_attrs.last_device_data', update_attrs.last_device_data)

      // debug('last_device_data_battery', rack.last_device_data_battery)
      // debug('update_attrs.last_device_data_battery', update_attrs.last_device_data_battery)

      await Rack.findByIdAndUpdate(rack._id, update_attrs, { new: true });
    }
  } catch (error) {
    debug(error);
  }
};

//deviceDataSchema.post('save', saveDeviceDataToRack)
deviceDataSchema.pre("update", update_updated_at_middleware);
deviceDataSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const DeviceData = mongoose.model("DeviceData", deviceDataSchema);

exports.DeviceData = DeviceData;
exports.deviceDataSchema = deviceDataSchema;
exports.device_data_save = device_data_save;
