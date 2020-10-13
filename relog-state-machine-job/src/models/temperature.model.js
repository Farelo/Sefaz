const debug = require("debug")("model:temperature");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

const temperatureSchema = new mongoose.Schema({
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
   value: {
      type: Number,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

temperatureSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const createMany = async (packing, temperatureArray) => {
   for (const [index, temperature] of temperatureArray.entries()) {
      try {
         const newTemperature = new Temperature({
            tag: packing.tag.code,
            date: new Date(temperature.date),
            timestamp: temperature.timestamp,
            value: temperature.latitude,
         });

         await newTemperature.save().catch((err) => debug(err));

         if (index == 0) {
            await newTemperature
               .save()
               .then((doc) => referenceFromPackage(packing, doc))
               .catch((err) => debug(err));
         } else {
            await newTemperature.save();
         }
      } catch (error) {
         debug(`Erro ao salvar a temperatura do device ${packing.tag.code} | ${error}`);
      }
   }
};

const referenceFromPackage = async (packing, doc) => {
   try {
      await Packing.findByIdAndUpdate(packing._id, { last_temperature: doc._id }, { new: true });
   } catch (error) {
      debug(error);
   }
};
const Temperature = mongoose.model("Temperature", temperatureSchema);

exports.Temperature = Temperature;
exports.temperatureSchema = temperatureSchema;
exports.createMany = createMany;
