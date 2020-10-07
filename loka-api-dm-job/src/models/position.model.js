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

const update_updated_at_middleware = function (next) {
   let update = this.getUpdate();
   update.update_at = new Date();
   next();
};

const createMany = async (packing, positionArray) => {
   console.log("createMany", packing.tag.code, positionArray.length);
   //Limpa do array todas as mensagens (exceto a primeira) que não tenham
   //acurácia, ou tenham acurácia com mais de 32km
   let newBatchOfMessages = [];

   newBatchOfMessages = positionArray.filter((elem, index) => {
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
         update_attrs.last_message_signal = new Date(newBatchOfMessages[0].date);
         await Packing.findByIdAndUpdate(packing._id, update_attrs, { new: true });
         newBatchOfMessages = newBatchOfMessages.slice(1);
         isLastSignalAlreadySaved = true;
      }

      for (const [index, position] of newBatchOfMessages.entries()) {
         try {
            const newPosition = new Position({
               tag: packing.tag.code,
               date: new Date(position.date),
               timestamp: position.timestamp,
               last_communication: new Date(position.terminal.lastCommunicationString),
               last_communication_timestamp: position.terminal.lastCommunication,
               latitude: position.latitude,
               longitude: position.longitude,
               accuracy: position.accuracy,
            });

            console.log(newPosition);

            // salva no banco | observação: não salva mensagens iguais porque o model possui
            // índice unico e composto por tag e message_date, e o erro de duplicidade nao interrompe o job
            // Também atualiza o atributo 'last_message_signal'
            if (index == 0) {
               if (!isLastSignalAlreadySaved) {
                  let update_attrs = {};
                  update_attrs.last_message_signal = newPosition.message_date;
                  await Packing.findByIdAndUpdate(packing._id, update_attrs, { new: true });
               }

               await newPosition
                  .save()
                  .then((doc) => {
                     updatePackageReferencetoLastPosition(packing, doc);
                  })
                  .catch((err) => debug(err));
            } else {
               await newPosition.save();
            }

            // debug('Saved position ', position.deviceId, ' and message_date ', position.messageDate)
         } catch (error) {
            debug(
               "Erro ao salvar o position do device ",
               position.deviceId,
               " para a data-hora ",
               position.messageDate,
               " | System Error ",
               error.errmsg ? error.errmsg : error.errors
            );
         }
      }
   }
};

const updatePackageReferencetoLastPosition = async (packing, position) => {
   try {
      let update_attrs = {};

      //momento da última mensagem
      let lastPositionTimestamp = packing.last_position ? packing.last_position.timestamp : null;

      //se o novo position é mais recente que o que já esta salvo, então atualiza
      if (position.timestamp > lastPositionTimestamp) {
         update_attrs.last_position = position._id;

         await Packing.findByIdAndUpdate(packing._id, update_attrs, { new: true });
      }
   } catch (error) {
      debug(error);
   }
};

//positionSchema.post('save', saveDeviceDataToPacking)
positionSchema.pre("update", update_updated_at_middleware);
positionSchema.pre("findOneAndUpdate", update_updated_at_middleware);

const Position = mongoose.model("Position", positionSchema);

exports.Position = Position;
exports.positionSchema = positionSchema;
exports.createMany = createMany;
