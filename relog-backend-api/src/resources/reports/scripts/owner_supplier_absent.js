const _ = require("lodash");
const moment = require("moment");
const { Rack } = require("../../racks/racks.model");
const { EventRecord } = require("../../event_record/event_record.model");
const { Position } = require("../../positions/positions.model");

/**
 * TODO: criar índices na coleção eventrecords
 */
module.exports = async (days) => {
   try {
      let startDate = new Date();

      const racks = await Rack.aggregate([
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
               from: "positions",
               localField: "last_owner_supplier.device_data_id",
               foreignField: "_id",
               as: "last_owner_supplier.device_data_id",
            },
         },
         {
            $unwind: {
               path: "$last_owner_supplier.device_data_id",
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
               "last_owner_supplier._id": 1,
               "last_owner_supplier.type.name": 1,
               "last_owner_supplier.accuracy": 1,
               "last_owner_supplier.control_point._id": 1,
               "last_owner_supplier.control_point.name": 1,
               "last_owner_supplier.control_point.type": 1,
               "last_owner_supplier.created_at": 1,
               "last_owner_supplier.device_data_id.date": 1,
            },
         },
      ]).allowDiskUse(true);

      //Filtra as embalagens com mais de x dias (default = 30 dias)

      let resultRacks = racks.filter((element) => {
         if (element.last_owner_supplier !== null) {
            return new Date(element.last_owner_supplier.created_at) < moment().subtract(days, "days").toDate();
         } else return false;
      });

      let resultList = [];

      for (const [i, actualRack] of resultRacks.entries()) {
         let query = {};
         if (actualRack.last_owner_supplier) {
            query = {
               rack: actualRack._id,
               created_at: { $gte: actualRack.last_owner_supplier.created_at },
               _id: { $ne: actualRack.last_owner_supplier._id },
            };
         } else query = { rack: actualRack._id };

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
         })
            .sort({ _id: -1 })
            .populate("control_point", "name");

         //Extrai dados dos eventos
         for (const [i, actualEventRecord] of results.entries()) {
            eventsList.push({
               control_point: actualEventRecord.control_point,
               created_at: actualEventRecord.created_at,
               type: actualEventRecord.type,
               device_data_id: actualEventRecord.device_data_id,
            });
         }

         resultList.push({
            family: actualRack.family ? actualRack.family.code : "-",
            serial: actualRack.serial,
            tag: actualRack.tag.code,
            lastOwnerOrSupplier: actualRack.last_owner_supplier.control_point
               ? actualRack.last_owner_supplier.control_point.name
               : "-",
            lastOwnerOrSupplierType: actualRack.last_owner_supplier.control_point
               ? actualRack.last_owner_supplier.control_point.type.name
               : "-",
            dateLastOwnerOrSupplier: actualRack.last_owner_supplier.created_at,
            leaveMessage: actualRack.last_owner_supplier.device_data_id
               ? actualRack.last_owner_supplier.device_data_id.date
               : "-",
            actualCP:
               actualRack.last_event_record.type == "inbound"
                  ? actualRack.last_event_record.control_point
                     ? actualRack.last_event_record.control_point.name
                     : "-"
                  : "-",
            dateActualCP:
               actualRack.last_event_record.type == "inbound" ? actualRack.last_event_record.created_at : "",
            status: actualRack.current_state,
            lastMessage: actualRack.last_message_signal,
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
