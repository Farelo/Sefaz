const mongoose = require("mongoose");

const factStateMachineSchema = new mongoose.Schema({
   type: {
      type: String,
   },
   packing: {
      _id: {
         type: mongoose.Schema.ObjectId,
         ref: "Packing",
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
      },
      message_date: {
         type: Date,
      },
      message_date_timestamp: {
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
      battery: {
         percentage: {
            type: Number,
         },
         voltage: {
            type: Number,
         },
      },
      seq_number: {
         type: Number,
      },
      created_at: {
         type: Date,
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
      default: Date.now,
   },
});

/**
 *
 * @param {*} factType Type of fact
 * @param {*} packing The Packing object
 * @param {*} eventrecord A new EventRecord object or null if want to repeat the packing.last_event_record
 * @param {*} currentStateHistory A new CurrentStateHistory object or null if wants to repeat the Packing.last_current_state_history
 */
exports.generateNewFact = async (factType, packing, eventrecord, currentStateHistory) => {
   try {
      if (eventrecord == null) eventrecord = packing.last_event_record ? packing.last_event_record : null;
      if (currentStateHistory == null)
         currentStateHistory = packing.last_current_state_history ? packing.last_current_state_history : null;

      console.log(" ");
      console.log(factType);
      console.log("packing:");
      console.log(JSON.stringify(packing));
      console.log("eventrecord");
      console.log(eventrecord);
      console.log("currentstatehistory");
      console.log(currentStateHistory);

      // let myCompany = null;
      // if (packing.last_event_record)
      //   myCompany = companies.find((elem) => elem._id == packing.last_event_record.control_point.company);

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

      let auxEventRecords = {
         _id: getEventRecords(eventrecord, "_id"),
         accuracy: getEventRecords(eventrecord, "accuracy"),
         control_point: getEventRecords(eventrecord, "control_point"),
         type: getEventRecords(eventrecord, "type"),
         created_at: getEventRecords(eventrecord, "created_at"),
      };

      let auxCurrentStateHistory = {
         _id: currentStateHistory ? new mongoose.Types.ObjectId(currentStateHistory._id) : null,
         type: currentStateHistory ? currentStateHistory.type : null,
         created_at: currentStateHistory ? currentStateHistory.created_at : null,
      };

      let newFact = {
         type: factType,
         packing: {
            _id: packing._id,
            family: packing.family ? packing.family._id : null,
            serial: packing.serial,
            tag: packing.tag.code,
         },
         devicedata: auxDeviceData,
         eventrecord: auxEventRecords,
         currentstatehistory: auxCurrentStateHistory,
      };

      console.log("JSON.stringify(newFact):");
      console.log(JSON.stringify(newFact));

      let newFactStateMachineObject = new FactStateMachine(newFact);

      console.log("newFactStateMachineObject");
      console.log(JSON.stringify(newFactStateMachineObject));

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
