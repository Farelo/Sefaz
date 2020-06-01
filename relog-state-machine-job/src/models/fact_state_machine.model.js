const mongoose = require("mongoose");
const STATES = require("../scripts/common/states");

const factStateMachineSchema = new mongoose.Schema({
  packing: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "Packing",
      required: true,
    },
    family: {
      type: mongoose.Schema.ObjectId,
      ref: "Family",
      required: true,
    },
    serial: {
      type: String,
    },
    tag: {
      type: String,
    },
  },
  devicedatas: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "DeviceData",
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
  },
  eventrecords: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "EventRecord",
      required: true,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    controlpoints: {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "ControlPoint",
        required: true,
      },
      name: {
        type: String,
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      company_name: {
        type: String,
      },
    },
    type: {
      type: String,
      required: true,
      enum: ["inbound", "outbound"],
      lowercase: true,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  currentstatehistory: {
    _id: ObjectId,
    type: string,
    created_at: Date,
  },
});

/**
 *
 * @param {*} packing The Packing object
 * @param {*} eventrecords A new EventRecord object or null if want to repeat the packing.last_event_record
 * @param {*} currentstatehistory A new CurrentStateHistory object or null if wnats to reapeat the Packing.last_current_state_history
 * @param {*} companies The list of all Companies
 */
const generateNewFact = async (
  packing,
  eventrecord,
  currentstatehistory,
  companies
) => {
  if (eventrecord == null) eventrecord = packing.last_event_record;
  if (currentstatehistory == null)
    currentstatehistory = packing.last_current_state_history;

  let myCompany = null;
  if (packing.last_event_record)
    myCompany = companies.find(
      (elem) => elem._id == packing.last_event_record.control_point.company
    );

  let newFact = {
    packing: {
      _id: packing._id,
      family: packing.family,
      serial: packing.serial,
      tag: packing.tag.code,
    },
    devicedatas: {
      _id: getDeviceData(packing, "_id"),
      message_date: getDeviceData(packing, "message_date"),
      message_date_timestamp: getDeviceData(packing, "message_date_timestamp"),
      latitude: getDeviceData(packing, "latitude"),
      longitude: getDeviceData(packing, "longitude"),
      accuracy: getDeviceData(packing, "accuracy"),
      temperature: getDeviceData(packing, "temperature"),
      battery: getDeviceData(packing, "battery"),
      created_at: getDeviceData(packing, "created_at"),
    },
    eventrecords: {
      _id: getEventRecords(eventrecord, "_id"),
      accuracy: getEventRecords(eventrecord, "accuracy"),
      controlpoint: {
        _id: getEventRecords(eventrecord, "controlpoint._id"),
        name: getEventRecords(eventrecord, "controlpoint.name"),
        type: getEventRecords(eventrecord, "controlpoint.type"),
        company: getEventRecords(eventrecord, "controlpoint.company"),
        company_name: myCompany ? myCompany.name : '-',
      },
      type: getEventRecords(eventrecord, "type"),
      created_at: getEventRecords(eventrecord, "created_at"),
    },
    currentstatehistory: {
      _id: currentstatehistory._id,
      type: currentstatehistory.type,
    },
  };

  let newFactStateMachineObject = new FactStateMachine(newFact)
  await newFactStateMachineObject.save();
};

const getDeviceData = (packing, key) => {
  let result = null;
  if (packing.last_device_data) result = packing.last_device_data[key];
  return result;
};

const getEventRecords = (eventRecords, key) => {
  let result = null;
  if (eventRecords) result = eventRecords[key];
  return result;
};

// const update_packing = async (current_state_history, next) => {
//     try {
//         if (current_state_history.type !== STATES.BATERIA_BAIXA.alert && current_state_history.type !== STATES.PERMANENCIA_EXCEDIDA.alert && current_state_history.type !== STATES.AUSENTE.alert ) {
//             await Packing.findByIdAndUpdate(current_state_history.packing, { last_current_state_history: current_state_history._id }, { new: true })
//         }
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

// factStateMachineSchema.statics.findByPacking = function (packing_id, projection = '') {
//     return this
//         .find({ packing: packing_id }, projection)
//         .sort({ created_at: -1 })
// }

// const saveCurrentStateHistoryToPacking = function (doc, next) {
//     update_packing(doc, next)
// }

// const update_updated_at_middleware = function (next) {
//     let update = this.getUpdate()
//     update.update_at = new Date()
//     next()
// }

// factStateMachineSchema.post('save', saveCurrentStateHistoryToPacking)
// factStateMachineSchema.pre('update', update_updated_at_middleware)
// factStateMachineSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const FactStateMachine = mongoose.model(
  "FactStateMachine",
  factStateMachineSchema
);

exports.FactStateMachine = FactStateMachine;
exports.factStateMachineSchema = factStateMachineSchema;
exports.generateNewFact = generateNewFact;
