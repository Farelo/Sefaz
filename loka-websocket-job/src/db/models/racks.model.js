const mongoose = require("mongoose");

const rackSchema = new mongoose.Schema({
  tag: {
    code: {
      type: String,
      minlength: 4,
      maxlength: 25,
      required: true,
    },
    version: {
      type: String,
      minlength: 1,
      maxlength: 100,
    },
    manufactorer: {
      type: String,
      minlength: 2,
      maxlength: 100,
    },
    deviceModel: {
      type: String,
    },
  },
  serial: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  type: {
    type: String,
    minlength: 0,
    maxlength: 100,
  },
  weigth: {
    type: Number,
    max: 10000,
    default: 0,
  },
  width: {
    type: Number,
    max: 10000,
    default: 0,
  },
  heigth: {
    type: Number,
    max: 10000,
    default: 0,
  },
  length: {
    type: Number,
    max: 10000,
    default: 0,
  },
  capacity: {
    type: Number,
    max: 10000,
    default: 0,
  },
  temperature: {
    type: Number,
    max: 1000,
    default: 0,
  },
  observations: {
    type: String,
    minlength: 0,
    maxlength: 250,
  },
  active: {
    type: Boolean,
    default: false,
  },
  absent: {
    type: Boolean,
    default: false,
  },
  absent_time: {
    type: Date,
    default: null,
  },
  cicle_start: {
    type: Date,
    default: null,
  },
  cicle_end: {
    type: Date,
    default: null,
  },
  last_cicle_duration: {
    type: Number,
    default: 0,
  },
  offlineWhileAbsent: [
    {
      start: {
        type: Date,
        default: null,
      },
      end: {
        type: Date,
        default: null,
      },
    },
  ],
  low_battery: {
    type: Boolean,
    default: false,
  },
  permanence_time_exceeded: {
    type: Boolean,
    default: false,
  },
  family: {
    type: mongoose.Schema.ObjectId,
    ref: "Family",
    required: true,
  },
  last_message_signal: {
    type: Date,
    default: null,
  },
  last_position: {
    type: mongoose.Schema.ObjectId,
    ref: "Position",
  },
  last_temperature: {
    type: mongoose.Schema.ObjectId,
    ref: "Temperature",
  },
  last_battery: {
    type: mongoose.Schema.ObjectId,
    ref: "Battery",
  },
  last_device_data: {
    type: mongoose.Schema.ObjectId,
    ref: "DeviceData",
  },
  last_device_data_battery: {
    type: mongoose.Schema.ObjectId,
    ref: "DeviceData",
  },
  last_current_state_history: {
    type: mongoose.Schema.ObjectId,
    ref: "CurrentStateHistory",
  },
  last_department: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
  },
  last_event_record: {
    type: mongoose.Schema.ObjectId,
    ref: "EventRecord",
  },
  last_owner_supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "EventRecord",
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },
  current_state: {
    type: String,
    required: true,
    enum: [
      "desabilitada_com_sinal",
      "desabilitada_sem_sinal",
      "analise",
      "viagem_em_prazo",
      "viagem_atrasada",
      "viagem_perdida",
      "sem_sinal",
      "perdida",
      "local_correto",
      "local_incorreto",
    ],
    lowercase: true,
    default: "analise",
    trim: true,
  },
  first_attempt_incorrect_local: {
    type: mongoose.Schema.ObjectId,
    ref: "DeviceData",
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

rackSchema.statics.findByTag = function (tag, projection = "") {
  return this.findOne({ "tag.code": tag }, projection);
};

const update_updated_at_middleware = function (next) {
  let update = this.getUpdate();
  update.update_at = new Date();
  next();
};

rackSchema.pre("update", update_updated_at_middleware);
rackSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const Rack = mongoose.model("Rack", rackSchema);

exports.Rack = Rack;
exports.rackSchema = rackSchema; 