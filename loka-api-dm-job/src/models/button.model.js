const debug = require("debug")("model:button");
const mongoose = require("mongoose");
const { Rack} = require("./racks.model");

const buttonSchema = new mongoose.Schema({
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
   detector_switch: {
      type: Boolean,
      default: true
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

buttonSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const createMany = async (rack, buttonArray) => {
   for (const [index, button] of buttonArray.entries()) {
      try {
         const newButton = new Button({
            tag: rack.tag.code,
            date: new Date(button.date),
            timestamp: button.timestamp,
            detector_switch: button.detector_switch
         });

         await newButton.save().catch((err) => debug(err));

         if (index == 0) {
            await newButton
               .save()
               .then((doc) => referenceFromPackage(rack, doc))
               .catch((err) => debug(err));
         } else {
            await newButton.save();
         }
      } catch (error) {
         debug(`Erro ao salvar a Detector Switch do device ${rack.tag.code} | ${error}`);
      }
   }
};

const referenceFromPackage = async (rack, doc) => {
   try {
      await Rack.findByIdAndUpdate(rack._id, { last_detector_switch: doc._id }, { new: true });
   } catch (error) {
      debug(error);
   }
};
const Button = mongoose.model("Button", buttonSchema);

exports.Button = Button;
exports.buttonSchema = buttonSchema;
exports.createMany = createMany;
