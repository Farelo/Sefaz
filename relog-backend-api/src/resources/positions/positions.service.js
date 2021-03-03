const debug = require("debug")("service:positions");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Position } = require("./positions.model");
const { Packing } = require("../packings/packings.model");

exports.createMany = async (packing, positionArray) => {
   let maxTimestampIndex = -1;
   if (positionArray.length) {
      // procura o índice do elemento com timestamp mais atual: primeiro elemento ou o último
      if (positionArray[0].timestamp >= positionArray[positionArray.length - 1].timestamp) maxTimestampIndex = 0;
      else maxTimestampIndex = positionArray.length - 1;

      updatePackageLastMessage(packing, positionArray[maxTimestampIndex]);

      for (const [index, position] of positionArray.entries()) {
         if (position.accuracy <= 32000) {
            try {
               const newPosition = new Position({
                  tag: packing.tag.code,
                  date: new Date(position.date),
                  timestamp: position.timestamp,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  accuracy: position.accuracy,
               });

               // salva no banco | observação: não salva mensagens iguais porque o model possui
               // índice unico e composto por tag e timestamp, e o erro de duplicidade nao interrompe o job
               if (index == maxTimestampIndex) {
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
   }
};

const updatePackageLastMessage = async (packing, lastMessage) => {
   let update_attrs = {};
   update_attrs.last_message_signal = lastMessage.date;
   await Packing.findByIdAndUpdate(packing._id, update_attrs, { new: true });
};

const referenceFromPackage = async (packing, position) => {
   try {
      console.log(packing.tag.code);
      console.log(packing.last_position, position);
      console.log(packing.last_position.timestamp, position.timestamp);
      console.log(packing.last_position.timestamp > position.timestamp);

      if (position.timestamp > packing.last_position.timestamp) {
         console.log("eh maior", position.date, packing.last_position.date);
         console.log("eh maior", position.timestamp, packing.last_position.timestamp);
         await Packing.findByIdAndUpdate(packing._id, { last_position: position._id }, { new: true });
      }
   } catch (error) {
      debug(error);
   }
};

exports.getPosition = async ({ tag = null, start_date = null, end_date = null, accuracy = null, max = 100 }) => {
   try {
      let device_data = [];
      let conditions = {};
      let projection = {};
      let options = {};

      if (tag) conditions.tag = tag;
      // options.sort = { message_date: -1 };

      // Periodo of time
      if (start_date && end_date)
         if (isNaN(start_date) && isNaN(end_date))
            conditions.date = {
               $gte: new Date(start_date),
               $lte: new Date(end_date),
            };
         else
            conditions.timestamp = {
               $gte: parseInt(start_date),
               $lte: parseInt(end_date),
            };
      else if (start_date)
         if (isNaN(start_date)) conditions.date = { $gte: new Date(start_date) };
         else conditions.timestamp = { $gte: parseInt(start_date) };
      else if (end_date)
         if (isNaN(end_date)) conditions.date = { $lte: new Date(end_date) };
         else conditions.timestamp = { $lte: parseInt(end_date) };

      if (accuracy) conditions.accuracy = { $lte: parseInt(accuracy) };

      if (!start_date && !end_date) options.limit = parseInt(max);
      console.log(conditions);
      device_data = await Position.find(conditions, projection, options).select(["-created_at", "-__v"]);

      return device_data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.geolocation = async ({ companyId = null, familyId = null, serial = null }) => {
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
                     current_state: 1,
                     last_position: 1,
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
                     from: "positions",
                     localField: "last_position",
                     foreignField: "_id",
                     as: "last_position",
                  },
               },
               {
                  $unwind: {
                     path: "$last_position",
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
                     current_state: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_position.date": 1,
                     "last_position.timestamp": 1,
                     "last_position.latitude": 1,
                     "last_position.longitude": 1,
                     "last_position.accuracy": 1,
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
                     current_state: 1,
                     last_position: 1,
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
                     from: "positions",
                     localField: "last_position",
                     foreignField: "_id",
                     as: "last_position",
                  },
               },
               {
                  $unwind: {
                     path: "$last_position",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     current_state: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_position.date": 1,
                     "last_position.timestamp": 1,
                     "last_position.latitude": 1,
                     "last_position.longitude": 1,
                     "last_position.accuracy": 1,
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
                     current_state: 1,
                     last_position: 1,
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
                     from: "positions",
                     localField: "last_position",
                     foreignField: "_id",
                     as: "last_position",
                  },
               },
               {
                  $unwind: {
                     path: "$last_position",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     current_state: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_position.date": 1,
                     "last_position.timestamp": 1,
                     "last_position.latitude": 1,
                     "last_position.longitude": 1,
                     "last_position.accuracy": 1,
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
                     current_state: 1,
                     last_position: 1,
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
                     from: "positions",
                     localField: "last_position",
                     foreignField: "_id",
                     as: "last_position",
                  },
               },
               {
                  $unwind: {
                     path: "$last_position",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     current_state: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_position.date": 1,
                     "last_position.timestamp": 1,
                     "last_position.latitude": 1,
                     "last_position.longitude": 1,
                     "last_position.accuracy": 1,
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
                     current_state: 1,
                     last_position: 1,
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
                     from: "positions",
                     localField: "last_position",
                     foreignField: "_id",
                     as: "last_position",
                  },
               },
               {
                  $unwind: {
                     path: "$last_position",
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
                     current_state: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_position.date": 1,
                     "last_position.timestamp": 1,
                     "last_position.latitude": 1,
                     "last_position.longitude": 1,
                     "last_position.accuracy": 1,
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
                  current_state: 1,
                  last_position: 1,
               }
            )
               .populate("last_position", "date timestamp latitude longitude accuracy")
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
                  current_state: 1,
                  last_position: 1,
               }
            )
               .populate("last_position", "date timestamp latitude longitude accuracy")
               .populate("family", "code company");
            break;

         default:
            console.log("default");
            packings = await Packing.find(
               {},
               {
                  "tag.code": 1,
                  serial: 1,
                  current_state: 1,
                  last_position: 1,
               }
            )
               .populate("last_position", "date timestamp latitude longitude accuracy")
               .populate("family", "code company");
            break;
      }
      return packings;
   } catch (error) {
      throw new Error(error);
   }
};
