const _ = require("lodash");
const moment = require("moment");
const { Packing } = require("../../packings/packings.model");
const { EventRecord } = require("../../event_record/event_record.model");
const { Position } = require("../../positions/positions.model");

/**
 * TODO: criar índices na coleção eventrecords
 */
module.exports = async () => {
   try {
      let startDate = new Date();

      const packings = await Packing.aggregate([
         {
            $match: {
               last_owner_supplier: {
                  $exists: true,
                  $ne: null,
               },
               absent: true,
            },
         },
         {
            $lookup: {
               from: "eventrecords",
               localField: "last_owner_supplier",
               foreignField: "_id",
               as: "last_owner_supplier",
            },
         },
         {
            $unwind: {
               path: "$last_owner_supplier",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $match: {
               "last_owner_supplier.type": "outbound",
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
               from: "eventrecords",
               localField: "last_event_record",
               foreignField: "_id",
               as: "last_event_record",
            },
         },
         {
            $unwind: {
               path: "$last_event_record",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "controlpoints",
               localField: "last_event_record.control_point",
               foreignField: "_id",
               as: "last_event_record.control_point",
            },
         },
         {
            $unwind: {
               path: "$last_event_record.control_point",
               preserveNullAndEmptyArrays: true,
            },
         },

         {
            $lookup: {
               from: "controlpoints",
               localField: "last_owner_supplier.control_point",
               foreignField: "_id",
               as: "last_owner_supplier.control_point",
            },
         },
         {
            $unwind: {
               path: "$last_owner_supplier.control_point",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "types",
               localField: "last_owner_supplier.control_point.type",
               foreignField: "_id",
               as: "last_owner_supplier.control_point.type",
            },
         },
         {
            $unwind: {
               path: "$last_owner_supplier.control_point.type",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $project: {
               tag: 1,
               serial: 1,
               "family.code": 1,
               current_state: 1,
               last_message_signal: 1,
               "last_event_record.type": 1,
               "last_event_record.accuracy": 1,
               "last_event_record.control_point._id": 1,
               "last_event_record.control_point.name": 1,
               "last_event_record.control_point.type": 1,
               "last_event_record.created_at": 1,
               "last_owner_supplier.type.name": 1,
               "last_owner_supplier.accuracy": 1,
               "last_owner_supplier.control_point._id": 1,
               "last_owner_supplier.control_point.name": 1,
               "last_owner_supplier.control_point.type": 1,
               "last_owner_supplier.created_at": 1,
            },
         },
      ]).allowDiskUse(true);

      console.log(packings[0]);
      console.log(packings[1]);

      //Filtra as embalagens com 30 dias+
      let resultPackings = packings.filter((element) => {
         if (element.last_owner_supplier !== null) {
            return new Date(element.last_owner_supplier.created_at) < moment().subtract(30, "days").toDate();
         } else return false;
      });

      console.log(resultPackings.length);
      let resultList = [];

      console.log("percorrendo embalagens");
      for (const [i, actualPacking] of resultPackings.entries()) {
         if (i % 500 == 0) console.log(i);
         let query = {};
         if (actualPacking.last_owner_supplier) {
            query = { packing: actualPacking._id, created_at: { $gt: actualPacking.last_owner_supplier.created_at } };
            if (actualPacking.tag.code == "4086010") {
               console.log("4086010");
               console.log(query);
            }
         } else query = { packing: actualPacking._id };

         /**
          * TODO:
          * E se juntar os dois finds abaixo em um só aggregate ordenado pela data do position?
          */
         //Seleciona os eventos que ocorreram após a saída do owner
         let eventsList = [];
         let results = await EventRecord.find(query, {
            control_point: 1,
            created_at: 1,
            type: 1,
            device_data_id: 1,
         }).populate("control_point", "name");

         //Extrai dados dos eventos
         for (const [i, actualEventRecord] of results.entries()) {
            eventsList.push({
               control_point: actualEventRecord.control_point,
               created_at: actualEventRecord.created_at,
               type: actualEventRecord.type,
               device_data_id: actualEventRecord.device_data_id,
            });
         }

         //Seleciona as posições que ocorreram após a saída do owner
         // let positionsList = [];
         // let queryPosition = {};
         // if (actualPacking.last_owner_supplier)
         //    queryPosition = {
         //       tag: actualPacking.tag.code,
         //       date: { $gt: actualPacking.last_owner_supplier.created_at },
         //    };
         // else queryPosition = { tag: actualPacking._id };

         // let resultsPositions = await Position.aggregate([
         //    {
         //       $match: queryPosition,
         //    },
         //    {
         //       $project: {
         //          latitude: 1,
         //          longitude: 1,
         //          accuracy: 1,
         //          timestamp: 1,
         //       },
         //    },
         // ]).allowDiskUse(true);

         // // console.log("percorrendo positions após owner");
         // for (const [i, actualPosition] of resultsPositions.entries()) {
         //    positionsList.push({
         //       latitude: actualPosition.latitude,
         //       longitude: actualPosition.longitude,
         //       accuracy: actualPosition.accuracy,
         //       timestamp: actualPosition.timestamp,
         //    });
         // }

         resultList.push({
            family: actualPacking.family ? actualPacking.family.code : "-",
            serial: actualPacking.serial,
            tag: actualPacking.tag.code,
            lastOwnerOrSupplier: actualPacking.last_owner_supplier.control_point
               ? actualPacking.last_owner_supplier.control_point.name
               : "-",
            lastOwnerOrSupplierType: actualPacking.last_owner_supplier.control_point
               ? actualPacking.last_owner_supplier.control_point.type.name
               : "-",
            dateLastOwnerOrSupplier: actualPacking.last_owner_supplier.created_at,
            actualCP:
               actualPacking.last_event_record.type == "inbound"
                  ? actualPacking.last_event_record.control_point
                     ? actualPacking.last_event_record.control_point.name
                     : "-"
                  : "-",
            dateActualCP:
               actualPacking.last_event_record.type == "inbound" ? actualPacking.last_event_record.created_at : "",
            status: actualPacking.current_state,
            lastMessage: actualPacking.last_message_signal,
            eventList: eventsList,
         });
      }

      let endDate = new Date();
      console.log(`${startDate} | ${endDate} | ${(endDate.getTime() - startDate.getTime()) / 1000}s`);

      return resultList;
   } catch (error) {
      console.log(error);
      return [];
   }
};
