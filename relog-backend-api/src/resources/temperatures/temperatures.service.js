const debug = require("debug")("service:temperatures");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Temperature } = require("./temperatures.model");
const { Rack } = require("../racks/racks.model");

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
 * @param {*} rack
 * @param {*} temperatureArray
 */
exports.createMany = async (rack, temperatureArray) => {
   let maxTimestampIndex = -1;
   if (temperatureArray.length) {
      // procura o índice do elemento com timestamp mais atual: primeiro elemento ou o último
      if (temperatureArray[0].timestamp >= temperatureArray[temperatureArray.length - 1].timestamp)
         maxTimestampIndex = 0;
      else maxTimestampIndex = temperatureArray.length - 1;

      updatePackageLastMessage(rack, temperatureArray[maxTimestampIndex]);

      for (const [index, temperature] of temperatureArray.entries()) {
         try {
            const newTemperature = new Temperature({
               tag: rack.tag.code,
               date: new Date(temperature.date),
               timestamp: temperature.timestamp,
               value: temperature.value,
            });

            await newTemperature.save().catch((err) => debug(err));

            if (index == maxTimestampIndex) {
               await newTemperature
                  .save()
                  .then((doc) => referenceFromPackage(rack, doc))
                  .catch((err) => debug(err));
            } else {
               await newTemperature.save();
            }
         } catch (error) {
            debug(`Erro ao salvar a temperatura do device ${rack.tag.code} | ${error}`);
         }
      }
   }
};

const updatePackageLastMessage = async (rack, newMessage) => {
   if (rack.last_message_signal) {
      if (new Date(newMessage.date).getTime() > new Date(rack.last_message_signal).getTime()) {
         await Rack.findByIdAndUpdate(rack._id, { last_message_signal: newMessage.date }, { new: true });
      }
   } else {
      await Rack.findByIdAndUpdate(rack._id, { last_message_signal: newMessage.date }, { new: true });
   }
};

const referenceFromPackage = async (rack, newTemperature) => {
   try {
      if (rack.last_temperature) {
         if (newTemperature.timestamp > rack.last_temperature.timestamp) {
            await Rack.findByIdAndUpdate(rack._id, { last_temperature: newTemperature._id }, { new: true });
         }
      } else {
         await Rack.findByIdAndUpdate(rack._id, { last_temperature: newTemperature._id }, { new: true });
      }
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
      let racks = [];

      switch (true) {
         // company, family and serial
         case companyId != null && familyId != null && serial != null:
            console.log("c, f e s");
            racks = await Rack.aggregate([
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
            racks = await Rack.aggregate([
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
            racks = await Rack.aggregate([
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
            racks = await Rack.aggregate([
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
            racks = await Rack.aggregate([
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
            racks = await Rack.find(
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
            racks = await Rack.find(
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
            racks = await Rack.find(
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
      return racks;
   } catch (error) {
      throw new Error(error);
   }
};
