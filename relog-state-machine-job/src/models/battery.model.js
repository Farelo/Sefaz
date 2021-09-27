const debug = require("debug")("model:battery");
const mongoose = require("mongoose");
const { Rack } = require("./racks.model");

const batterySchema = new mongoose.Schema({
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
   battery: {
      type: Number,
   },
   batteryVoltage: {
      type: Number,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

batterySchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const createMany = async (rack, batteryArray) => {
   for (const [index, battery] of batteryArray.entries()) {
      try {
         const newBattery = new Battery({
            tag: rack.tag.code,
            date: new Date(battery.date),
            timestamp: battery.timestamp,
            battery: battery.battery,
            batteryVoltage: battery.batteryVoltage,
         });

         await newBattery.save().catch((err) => debug(err));

         if (index == 0) {
            await newBattery
               .save()
               .then((doc) => referenceFromPackage(rack, doc))
               .catch((err) => debug(err));
         } else {
            await newBattery.save();
         }
      } catch (error) {
         debug(`Erro ao salvar a bateria do device ${rack.tag.code} | ${error}`);
      }
   }
};

const referenceFromPackage = async (rack, doc) => {
   try {
      await Rack.findByIdAndUpdate(rack._id, { last_battery: doc._id }, { new: true });
   } catch (error) {
      debug(error);
   }
};
const Battery = mongoose.model("Battery", batterySchema);

exports.Battery = Battery;
exports.batterySchema = batterySchema;
exports.createMany = createMany;
