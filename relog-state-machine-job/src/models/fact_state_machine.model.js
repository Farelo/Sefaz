const mongoose = require("mongoose");
const STATES = require("../scripts/common/states");

const factStateMachineSchema = new mongoose.Schema({
  type:{
    type: String,
  },
  packing: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "Packing",
      required: true,
    },
    family: {
      type: mongoose.Schema.ObjectId,
      ref: "Family",
    },
    serial: {
      type: String,
    },
    tag: {
      type: String,
    },
  },
  devicedata: {
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
    seq_number:{
      type: Number,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  eventrecord: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "EventRecord",
    },
    accuracy: {
      type: Number,
    },
    control_point: {
      type: mongoose.Schema.ObjectId,
      ref: "ControlPoint",
    },
    type: {
      type: String,
    },
    created_at: {
      type: Date,
    },
  },
  currentstatehistory: {
    _id: { type: mongoose.Schema.ObjectId },
    type: {
      type: String,
    },
    created_at: {
      type: Date,
    },
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

/**
 * 
 * @param {*} factType Type of fact
 * @param {*} packing The Packing object
 * @param {*} eventrecord A new EventRecord object or null if want to repeat the packing.last_event_record
 * @param {*} currentStateHistory A new CurrentStateHistory object or null if wnats to reapeat the Packing.last_current_state_history
 */
exports.generateNewFact = async (factType, packing, eventrecord, currentStateHistory) => {
  // console.log("[generateNewFact] model");
  // console.log("params packing", JSON.stringify(packing));
  // console.log("params eventrecord", JSON.stringify(eventrecord));
  // console.log("params currentStateHistory", JSON.stringify(currentStateHistory));
  // console.log("params companies", companies.length);
  // console.log(' ')
  
  try {
    if (eventrecord == null) eventrecord = packing.last_event_record;
    if (currentStateHistory == null) currentStateHistory = packing.last_current_state_history;

    // let myCompany = null;
    // if (packing.last_event_record)
    //   myCompany = companies.find((elem) => elem._id == packing.last_event_record.control_point.company);

    console.log('-----------');
    console.log('\n packing');
    console.log(JSON.stringify(packing));

    let auxDeviceData = {
      _id: getDeviceData(packing, "_id"),
      message_date: getDeviceData(packing, "message_date"),
      message_date_timestamp: getDeviceData(packing, "message_date_timestamp"),
      latitude: getDeviceData(packing, "latitude"),
      longitude: getDeviceData(packing, "longitude"),
      accuracy: getDeviceData(packing, "accuracy"),
      temperature: getDeviceData(packing, "temperature"),
      battery: getDeviceData(packing, "battery"),
      seq_number: getDeviceData(packing, "seq_number"),
      created_at: getDeviceData(packing, "created_at"),
    };

    console.log('\n eventrecord');
    console.log(JSON.stringify(eventrecord));

    let auxEventRecords = {
      _id: getEventRecords(eventrecord, "_id"),
      accuracy: getEventRecords(eventrecord, "accuracy"),
      control_point: getEventRecords(eventrecord, "control_point"),
      type: getEventRecords(eventrecord, "type"),
      created_at: getEventRecords(eventrecord, "created_at"),
    };

    console.log('\n currentStateHistory');
    console.log(JSON.stringify(currentStateHistory));

    let auxCurrentStateHistory = {
      _id: new mongoose.Types.ObjectId(currentStateHistory._id),
      type: currentStateHistory.type,
    };

    let newFact = {
      type: factType,
      packing: {
        _id: packing._id,
        family: packing.family._id,
        serial: packing.serial,
        tag: packing.tag.code,
      },
      devicedata: auxDeviceData,
      eventrecord: auxEventRecords,
      currentstatehistory: auxCurrentStateHistory,
    };

    let newFactStateMachineObject = new FactStateMachine(newFact);

    // console.log("newFactStateMachineObject", JSON.stringify(newFactStateMachineObject));

    await newFactStateMachineObject.save();
  } catch (error) {
    console.log(error);
  }
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

const FactStateMachine = mongoose.model("FactStateMachine", factStateMachineSchema);

exports.FactStateMachine = FactStateMachine;
exports.factStateMachineSchema = factStateMachineSchema;
