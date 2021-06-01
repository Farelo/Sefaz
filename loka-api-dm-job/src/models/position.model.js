const debug = require("debug")("model:position");
const mongoose = require("mongoose");
const { Rack } = require("./racks.model");

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

const createMany = async (rack, positionArray) => {
   let firstSaved = true;
   for (const [index, position] of positionArray.entries()) {
      if (position.accuracy <= 32000) {
         try {
            const newPosition = new Position({
               tag: rack.tag.code,
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
                  .then((newDoc) => referenceFromPackage(rack, newDoc))
                  .catch((err) => debug(err));
            } else {
               await newPosition.save();
            }
         } catch (error) {
            debug(`Erro ao salvar a posição do device ${rack.tag.code} | ${error}`);
         }
      }
   }
};

const referenceFromPackage = async (rack, position) => {
   try {
      await Rack.findByIdAndUpdate(rack._id, { last_position: position._id }, { new: true });
   } catch (error) {
      debug(error);
   }
};

const Position = mongoose.model("Position", positionSchema);

exports.Position = Position;
exports.positionSchema = positionSchema;
exports.createMany = createMany;
