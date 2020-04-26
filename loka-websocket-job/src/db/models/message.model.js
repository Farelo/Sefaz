const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message_date: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  device_id: {
    type: String,
    required: true
  }
});

const Message = mongoose.model("Message", messageSchema);

exports.Message = Message;
exports.messageSchema = messageSchema;
