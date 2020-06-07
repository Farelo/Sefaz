const mongoose = require("mongoose"); 

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
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    controlpoint: {
      type: mongoose.Schema.ObjectId,
      ref: "ControlPoint",
      required: true,
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
    _id: { type: mongoose.Schema.ObjectId },
    type: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
});

/**
 *
 * @param {*} packing The Packing object
 * @param {*} eventrecords A new EventRecord object or null if want to repeat the packing.last_event_record
 * @param {*} currentstatehistory A new CurrentStateHistory object or null if wnats to reapeat the Packing.last_current_state_history
 * @param {*} companies The list of all Companies
 */
exports.generateNewFact = async (packing, eventrecord, currentStateHistory, companies) => { 

  try {
    if (eventrecord == null) eventrecord = packing.last_event_record;
    if (currentStateHistory == null) currentStateHistory = packing.last_current_state_history;

    let myCompany = null;
    if (packing.last_event_record)
      myCompany = companies.find((elem) => elem._id == packing.last_event_record.control_point.company);

    let auxDeviceData = {
      _id: getDeviceData(packing, "_id"),
      message_date: getDeviceData(packing, "message_date"),
      message_date_timestamp: getDeviceData(packing, "message_date_timestamp"),
      latitude: getDeviceData(packing, "latitude"),
      longitude: getDeviceData(packing, "longitude"),
      accuracy: getDeviceData(packing, "accuracy"),
      temperature: getDeviceData(packing, "temperature"),
      battery: getDeviceData(packing, "battery"),
      created_at: getDeviceData(packing, "created_at"),
    };

    let auxEventRecords = {
      _id: getEventRecords(eventrecord, "_id"),
      accuracy: getEventRecords(eventrecord, "accuracy"),
      controlpoint: getEventRecords(eventrecord, "control_point"),
      type: getEventRecords(eventrecord, "type"),
      created_at: getEventRecords(eventrecord, "created_at"),
    };

    let auxCurrentStateHistory = {
      _id: new mongoose.Types.ObjectId(currentStateHistory._id),
      type: currentStateHistory.type,
    };

    let newFact = {
      packing: {
        _id: packing._id,
        family: packing.family._id,
        serial: packing.serial,
        tag: packing.tag.code,
      },
      devicedatas: auxDeviceData,
      eventrecords: auxEventRecords,
      currentstatehistory: auxCurrentStateHistory,
    };

    let newFactStateMachineObject = new FactStateMachine(newFact);

    console.log("newFactStateMachineObject", JSON.stringify(newFactStateMachineObject));

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

const FactStateMachine = mongoose.model("FactStateMachine", factStateMachineSchema);

exports.FactStateMachine = FactStateMachine;
exports.factStateMachineSchema = factStateMachineSchema;
