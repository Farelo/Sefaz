const debug = require("debug")("service:temperatures");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Temperature } = require("./temperatures.model");
const { Packing } = require("../packings/packings.model");

exports.create = async (data) => {
   try {
      const newTemperature = new Temperature(data);
      await newTemperature.save();
      return newTemperature;
   } catch (error) {
      throw new Error(error);
   }
};

/**
 * Cria várias temperaturas a partir de um array de mensagens.
 * As mensagens devem estar em ordem cronológica crescente. Ou seja, da mais antiga para a mais recente.
 * @param {*} packing
 * @param {*} temperatureArray
 */
exports.createMany = async (packing, temperatureArray) => {
   let maxTimestampIndex = -1;
   if (temperatureArray.length) {
      // procura o índice do elemento com timestamp mais atual: primeiro elemento ou o último
      if (temperatureArray[0].timestamp >= temperatureArray[temperatureArray.length - 1].timestamp) maxTimestampIndex = 0;
      else maxTimestampIndex = temperatureArray.length - 1;

      updatePackageLastMessage(packing, temperatureArray[maxTimestampIndex]);

      for (const [index, temperature] of temperatureArray.entries()) {
         try {
            const newTemperature = new Temperature({
               tag: packing.tag.code,
               date: new Date(temperature.date),
               timestamp: temperature.timestamp,
               value: temperature.value,
            });

            await newTemperature.save().catch((err) => debug(err));

            if (index == maxTimestampIndex) {
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
   }
};

const updatePackageLastMessage = async (packing, lastMessage) => {
   let update_attrs = {};
   update_attrs.last_message_signal = lastMessage.date;
   await Packing.findByIdAndUpdate(packing._id, update_attrs, { new: true });
};

const referenceFromPackage = async (packing, doc) => {
   try {
      await Packing.findByIdAndUpdate(packing._id, { last_temperature: doc._id }, { new: true });
   } catch (error) {
      debug(error);
   }
};

exports.get = async ({ tag = null, start_date = null, end_date = null, max = 100 }) => {
   let conditions = {};
   let projection = {};
   let options = {};

   if (tag) conditions.tag = tag;
   // options.sort = { message_date: -1 };

   try {
      // Periodo of time
      if (start_date && end_date)
         if (isNaN(start_date) && isNaN(end_date))
            conditions.date = {
               $gte: new Date(start_date),
               $lte: new Date(end_date),
            };
         else
            conditions.timestamp = {
               $gte: start_date,
               $lte: end_date,
            };
      else if (start_date) {
         if (isNaN(start_date)) conditions.date = { $gte: new Date(start_date) };
         else conditions.timestamp = { $gte: start_date };
      } else if (end_date) {
         console.log("end_date", end_date);
         if (isNaN(end_date)) conditions.date = { $lte: new Date(end_date) };
         else conditions.timestamp = { $lte: end_date };
      }

      if (!start_date && !end_date) options.limit = parseInt(max);

      return await Temperature.find(conditions, projection, options).select(["-created_at", "-__v"]);
   } catch (error) {
      throw new Error(error);
   }
};

exports.getLast = async ({ companyId = null, familyId = null, serial = null }) => {
   try {
      let packings = [];

      switch (true) {
         // company, family and serial
         case companyId != null && familyId != null && serial != null:
            console.log("c, f e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_temperature: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $lookup: {
                     from: "temperatures",
                     localField: "last_temperature",
                     foreignField: "_id",
                     as: "last_temperature",
                  },
               },
               {
                  $unwind: {
                     path: "$last_temperature",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     "family.company": new mongoose.Types.ObjectId(companyId),
                     serial: serial,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_temperature.date": 1,
                     "last_temperature.timestamp": 1,
                     "last_temperature.value": 1,
                  },
               },
            ]);
            break;

         // company and family
         case companyId != null && familyId != null:
            console.log("c e f");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_temperature: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     "family.company": new mongoose.Types.ObjectId(companyId),
                  },
               },
               {
                  $lookup: {
                     from: "temperatures",
                     localField: "last_temperature",
                     foreignField: "_id",
                     as: "last_temperature",
                  },
               },
               {
                  $unwind: {
                     path: "$last_temperature",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_temperature.date": 1,
                     "last_temperature.timestamp": 1,
                     "last_temperature.value": 1,
                  },
               },
            ]);
            break;

         // company and serial
         case companyId != null && serial != null:
            console.log("c e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_temperature: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family.company": new mongoose.Types.ObjectId(companyId),
                     serial: serial,
                  },
               },
               {
                  $lookup: {
                     from: "temperatures",
                     localField: "last_temperature",
                     foreignField: "_id",
                     as: "last_temperature",
                  },
               },
               {
                  $unwind: {
                     path: "$last_temperature",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_temperature.date": 1,
                     "last_temperature.timestamp": 1,
                     "last_temperature.value": 1,
                  },
               },
            ]);
            break;

         //family and serial
         case familyId != null && serial != null:
            console.log("f e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_temperature: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     serial: serial,
                  },
               },
               {
                  $lookup: {
                     from: "temperatures",
                     localField: "last_temperature",
                     foreignField: "_id",
                     as: "last_temperature",
                  },
               },
               {
                  $unwind: {
                     path: "$last_temperature",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_temperature.date": 1,
                     "last_temperature.timestamp": 1,
                     "last_temperature.value": 1,
                  },
               },
            ]);
            break;

         //Only company
         case companyId != null:
            console.log("only company");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_temperature: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $lookup: {
                     from: "temperatures",
                     localField: "last_temperature",
                     foreignField: "_id",
                     as: "last_temperature",
                  },
               },
               {
                  $unwind: {
                     path: "$last_temperature",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family.company": new mongoose.Types.ObjectId(companyId),
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_temperature.date": 1,
                     "last_temperature.timestamp": 1,
                     "last_temperature.value": 1,
                  },
               },
            ]);
            break;

         //Only family
         case familyId != null:
            console.log("f");
            packings = await Packing.find(
               { family: familyId },
               {
                  "tag.code": 1,
                  serial: 1,
                  last_temperature: 1,
               }
            )
               .populate("last_temperature", "date timestamp value")
               .populate("family", "code company");
            break;

         //Only serial
         case serial != null:
            console.log("s");
            packings = await Packing.find(
               { serial: serial },
               {
                  "tag.code": 1,
                  serial: 1,
                  last_temperature: 1,
               }
            )
               .populate("last_temperature", "date timestamp value")
               .populate("family", "code company");
            break;

         default:
            console.log("default");
            packings = await Packing.find(
               {},
               {
                  "tag.code": 1,
                  serial: 1,
                  last_temperature: 1,
               }
            )
               .populate("last_temperature", "date timestamp value")
               .populate("family", "code company");
            break;
      }
      return packings;
   } catch (error) {
      throw new Error(error);
   }
};
