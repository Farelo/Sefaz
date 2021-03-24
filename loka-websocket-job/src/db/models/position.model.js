const debug = require("debug")("model:position");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

const positionSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

positionSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const createMany = async (packing, positionArray) => {
  let firstSaved = true;
  for (const [index, position] of positionArray.entries()) {
    if (position.accuracy <= 32000) {
      try {
        const newPosition = new Position({
          tag: packing.tag.code,
          date: new Date(position.timestamp * 1000),
          timestamp: position.timestamp,
          last_communication: new Date(position.terminal.lastCommunicationString),
          last_communication_timestamp: position.terminal.lastCommunication,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
        });

        // salva no banco | observação: não salva mensagens iguais porque o model possui
        // índice unico e composto por tag e timestamp, e o erro de duplicidade nao interrompe o job
        if (firstSaved) {
          firstSaved = false;
          await newPosition
            .save()
            .then((newDoc) => referenceFromPackage(packing, newDoc))
            .catch((err) => debug(err));
        } else {
          await newPosition.save();
        }
      } catch (error) {
        debug(`Erro ao salvar a posição do device ${packing.tag.code} | ${error}`);
      }
    }
  }
};

const create = async (position, actualPacking = null) => {
  if (!actualPacking) {
    actualPacking = await Packing.findOne({ "tag.code": position.tag });
  }

  let newPosition = new Position({
    tag: actualPacking.tag,
    date: new Date(position.date),
    timestamp: position.timestamp,
    latitude: position.latitude,
    longitude: position.latitude,
    accuracy: position.accuracy,
  });

  await newPosition
    .save()
    .then((newDocument) => referenceFromPackage(actualPacking, newDocument))
    .catch((error) => debug(error));
};

const referenceFromPackage = async (packing, position) => {
  try {
    await Packing.findByIdAndUpdate(packing._id, { last_position: position._id }, { new: true });
  } catch (error) {
    debug(error);
  }
};

const Position = mongoose.model("Position", positionSchema);

exports.Position = Position;
exports.positionSchema = positionSchema;
exports.create = create;
exports.createMany = createMany;
